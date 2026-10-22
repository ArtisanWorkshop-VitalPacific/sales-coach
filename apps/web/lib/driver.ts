'use client';

import {
  CustomerSession,
  type CustomerTurn,
  HeuristicPerceiver,
  ScriptedWriter,
  type SessionRecord,
  type SessionSnapshot,
  type SpecRequest,
  type TechTurnInput,
} from '@sales-coach/engine';
import { contentIndex } from './content';

/** One interface for the browser-only demo engine and the Claude-backed server engine. */
export interface SessionDriver {
  readonly mode: 'demo' | 'brain';
  start(req: SpecRequest): Promise<CustomerTurn | null>;
  tech(input: TechTurnInput): Promise<CustomerTurn>;
  hold(): Promise<CustomerTurn | null>;
  interrupt(): CustomerTurn | null;
  end(): SessionRecord;
  readonly snapshot: SessionSnapshot | null;
  /** Called when the server is unreachable and the call continues on the demo engine. */
  onFallback?: (reason: string) => void;
}

const localOpts = (seed?: number) => ({
  index: contentIndex(),
  perceiver: new HeuristicPerceiver(),
  writer: new ScriptedWriter(seed ?? 1),
});

/** Runs the whole engine in the browser: rules-based listening and scripted lines. No keys needed. */
export class LocalDriver implements SessionDriver {
  readonly mode = 'demo' as const;
  private session: CustomerSession | null = null;

  constructor(restore?: SessionSnapshot) {
    if (restore) this.session = CustomerSession.restore(restore, localOpts(restore.request.seed));
  }

  get snapshot() {
    return this.session?.snapshot() ?? null;
  }

  async start(req: SpecRequest) {
    const seed = req.seed ?? Math.floor(Math.random() * 2 ** 31);
    this.session = new CustomerSession({ ...req, seed }, localOpts(seed));
    return this.session.start();
  }
  tech(input: TechTurnInput) {
    return this.need().techTurn(input);
  }
  hold() {
    return this.need().holdElapsed();
  }
  interrupt() {
    return this.need().interrupt();
  }
  end() {
    return this.need().end();
  }
  private need() {
    if (!this.session) throw new Error('Session not started');
    return this.session;
  }
}

interface TurnResponse {
  snapshot: SessionSnapshot;
  turn: CustomerTurn | null;
  error?: string;
}

/** Claude on the server. The server is stateless: the call's snapshot travels with each turn. */
export class RemoteDriver implements SessionDriver {
  mode: 'demo' | 'brain' = 'brain';
  private snap: SessionSnapshot | null = null;
  private local: LocalDriver | null = null;
  onFallback?: (reason: string) => void;

  get snapshot() {
    return this.local?.snapshot ?? this.snap;
  }

  private async postOnce(body: Record<string, unknown>): Promise<TurnResponse> {
    const res = await fetch('/api/turn', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45_000),
    });
    const json = (await res.json().catch(() => ({}))) as TurnResponse;
    if (!res.ok || !json.snapshot) {
      const err = new Error(json.error ?? `Server error ${res.status}`) as Error & {
        status?: number;
      };
      err.status = res.status;
      throw err;
    }
    return json;
  }

  /** One retry for a dropped connection or a server hiccup before giving up on Claude. */
  private async post(body: Record<string, unknown>): Promise<TurnResponse> {
    try {
      return await this.postOnce(body);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status && status >= 400 && status < 500) throw e;
      return this.postOnce(body);
    }
  }

  private fallBack(reason: string) {
    if (!this.snap) throw new Error(reason);
    this.local = new LocalDriver(this.snap);
    this.mode = 'demo';
    this.onFallback?.(reason);
    return this.local;
  }

  async start(req: SpecRequest) {
    try {
      const r = await this.post({ op: 'start', request: req });
      this.snap = r.snapshot;
      return r.turn;
    } catch (e) {
      this.local = new LocalDriver();
      this.mode = 'demo';
      this.onFallback?.((e as Error).message);
      return this.local.start(req);
    }
  }

  async tech(input: TechTurnInput) {
    if (this.local) return this.local.tech(input);
    try {
      const r = await this.post({ op: 'tech', snapshot: this.snap, input });
      this.snap = r.snapshot;
      return r.turn!;
    } catch (e) {
      return this.fallBack((e as Error).message).tech(input);
    }
  }

  async hold() {
    if (this.local) return this.local.hold();
    try {
      const r = await this.post({ op: 'hold', snapshot: this.snap });
      this.snap = r.snapshot;
      return r.turn;
    } catch (e) {
      return this.fallBack((e as Error).message).hold();
    }
  }

  /** Interrupts are already written; apply them locally so they land instantly. */
  interrupt() {
    if (this.local) return this.local.interrupt();
    if (!this.snap) return null;
    const s = CustomerSession.restore(this.snap, localOpts(this.snap.request.seed));
    const turn = s.interrupt();
    this.snap = s.snapshot();
    return turn;
  }

  end() {
    if (this.local) return this.local.end();
    if (!this.snap) throw new Error('Session not started');
    const s = CustomerSession.restore(this.snap, localOpts(this.snap.request.seed));
    const record = s.end();
    record.adapters = this.snap.adapters;
    return record;
  }
}
