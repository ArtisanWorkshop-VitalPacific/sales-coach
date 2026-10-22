import type { LineWriter, Perceiver, PerceptionInput } from './adapters';
import { cleanLine } from './adapters';
import { buildSessionSpec, type ContentIndex, type SessionSpec, type SpecRequest } from './content';
import {
  afterHoldDirective,
  decideNext,
  interruptDirective,
  openingDirective,
  type TurnDirective,
} from './director';
import { HeuristicPerceiver } from './heuristic/perceiver';
import { ScriptedWriter } from './heuristic/writer';
import type { CustomerTurn, LatencySample, MoveEvent, SessionRecord, StatePoint, TranscriptTurn } from './record';
import { AudioTag, type BehaviorId } from './schema';
import { applyPerception, type CustomerState, emptyPerception, initState, type Perception } from './state';
import { createRng, newId, type Rng, wordCount } from './util';

export interface TechTurnInput {
  text: string;
  /** Milliseconds since session start, measured by the client. Optional. */
  startedAtMs?: number;
  endedAtMs?: number;
  /** The tech started talking while the customer was still speaking. */
  interruptedCustomer?: boolean;
  /** If the tech spoke during a customer hold, how far into the hold they started. */
  holdElapsedMs?: number;
}

export interface SessionSnapshot {
  v: 1;
  id: string;
  request: SpecRequest & { seed: number };
  t0: number;
  state: CustomerState;
  transcript: TranscriptTurn[];
  moves: MoveEvent[];
  timeline: StatePoint[];
  perceptions: SessionRecord['perceptions'];
  directives: SessionRecord['directives'];
  latency: LatencySample[];
  rngState: number;
  pending: Pending | null;
  armed: { afterMs: number; moveId: string; text: string } | null;
  lastCustomerMoveId?: string;
  lastCustomerObjectionId?: string;
  contentVersion: string;
  adapters: { perceiver: string; writer: string };
}

interface Pending {
  kind: 'think' | 'away';
  moveId?: string;
  holdMs: number;
  customerTurnId: string;
}

export interface SessionOptions {
  index: ContentIndex;
  perceiver: Perceiver;
  writer: LineWriter;
  now?: () => number;
  /** Called with the directive as soon as it is decided, before the line is written. */
  onDirective?: (d: TurnDirective) => void;
}

/**
 * One practice call. Transport-agnostic: the browser demo, the API route, the LiveKit
 * agent, and the test bench all drive this same class.
 */
export class CustomerSession {
  readonly id: string;
  readonly spec: SessionSpec;
  readonly state: CustomerState;
  private readonly index: ContentIndex;
  private readonly perceiver: Perceiver;
  private readonly writer: LineWriter;
  private readonly fallbackPerceiver = new HeuristicPerceiver();
  private readonly fallbackWriter: ScriptedWriter;
  private readonly now: () => number;
  private readonly onDirective?: (d: TurnDirective) => void;
  private rng: Rng;
  private t0: number;
  private request: SpecRequest & { seed: number };
  private transcript: TranscriptTurn[] = [];
  private moves: MoveEvent[] = [];
  private timeline: StatePoint[] = [];
  private perceptions: SessionRecord['perceptions'] = [];
  private directives: SessionRecord['directives'] = [];
  private latency: LatencySample[] = [];
  private pending: Pending | null = null;
  private armed: SessionSnapshot['armed'] = null;
  private lastCustomerMoveId?: string;
  private lastCustomerObjectionId?: string;
  private endedAt?: number;

  constructor(request: SpecRequest, opts: SessionOptions, restore?: SessionSnapshot) {
    this.index = opts.index;
    this.perceiver = opts.perceiver;
    this.writer = opts.writer;
    this.now = opts.now ?? (() => Date.now());
    this.onDirective = opts.onDirective;
    const seed = restore?.request.seed ?? request.seed ?? Math.floor(Math.random() * 2 ** 31);
    this.request = restore?.request ?? { ...request, seed };
    this.spec = buildSessionSpec(this.index, this.request);
    this.fallbackWriter = new ScriptedWriter(seed);
    if (restore) {
      this.id = restore.id;
      this.t0 = restore.t0;
      this.state = restore.state;
      this.transcript = restore.transcript;
      this.moves = restore.moves;
      this.timeline = restore.timeline;
      this.perceptions = restore.perceptions;
      this.directives = restore.directives;
      this.latency = restore.latency;
      this.rng = createRng(restore.rngState);
      this.pending = restore.pending;
      this.armed = restore.armed;
      this.lastCustomerMoveId = restore.lastCustomerMoveId;
      this.lastCustomerObjectionId = restore.lastCustomerObjectionId;
    } else {
      this.id = newId('ses');
      this.t0 = this.now();
      this.state = initState(this.spec, this.index);
      this.rng = createRng(seed);
      this.pushTimeline();
    }
  }

  static restore(snapshot: SessionSnapshot, opts: SessionOptions) {
    return new CustomerSession(snapshot.request, opts, snapshot);
  }

  snapshot(): SessionSnapshot {
    return {
      v: 1,
      id: this.id,
      request: this.request,
      t0: this.t0,
      state: this.state,
      transcript: this.transcript,
      moves: this.moves,
      timeline: this.timeline,
      perceptions: this.perceptions,
      directives: this.directives,
      latency: this.latency,
      rngState: this.rng.getState(),
      pending: this.pending,
      armed: this.armed,
      lastCustomerMoveId: this.lastCustomerMoveId,
      lastCustomerObjectionId: this.lastCustomerObjectionId,
      contentVersion: this.index.bundle.version,
      adapters: { perceiver: this.perceiver.name, writer: this.writer.name },
    };
  }

  get elapsedMs() {
    return this.now() - this.t0;
  }

  get isEnded() {
    return this.state.ended;
  }

  get transcriptTurns(): readonly TranscriptTurn[] {
    return this.transcript;
  }

  /** The customer's opening line, or null when the tech speaks first. */
  async start(): Promise<CustomerTurn | null> {
    if (this.transcript.length > 0) return null;
    const d = openingDirective(this.spec);
    if (!d) return null;
    return this.speak(d, 'opening');
  }

  async techTurn(input: TechTurnInput): Promise<CustomerTurn> {
    const at = input.startedAtMs ?? this.elapsedMs;
    const text = input.text.trim();
    const timing: BehaviorId[] = [];
    const pending = this.pending;
    this.pending = null;

    // Spoke during a step-away: nobody heard it. The customer comes back.
    if (pending?.kind === 'away') {
      this.transcript.push({ id: newId('t'), speaker: 'tech', text, atMs: at, endMs: input.endedAtMs, behaviors: [] });
      const d = afterHoldDirective(this.ctx(emptyPerception()), pending.moveId, 'away');
      return this.speak(d, 'return');
    }
    if (pending?.kind === 'think') {
      const elapsed = input.holdElapsedMs ?? 0;
      const move = pending.moveId ? this.index.move(pending.moveId) : undefined;
      const min = move?.evaluate.passIf.minSilenceMs ?? Math.min(4000, pending.holdMs);
      if (elapsed < min) timing.push('filled_silence');
      else timing.push('held_silence');
      const ev = this.moves.find((m) => m.turnId === pending.customerTurnId && m.moveId === pending.moveId);
      if (ev) ev.silenceMs = elapsed;
    }
    if (input.interruptedCustomer) timing.push('interrupted_customer');
    const durationMs = input.endedAtMs && input.startedAtMs ? input.endedAtMs - input.startedAtMs : 0;
    if (wordCount(text) > 140 || durationMs > 50000) timing.push('rambled');
    this.armed = null;

    const techTurn: TranscriptTurn = { id: newId('t'), speaker: 'tech', text, atMs: at, endMs: input.endedAtMs };
    const t1 = this.now();
    const perception = await this.perceive(text);
    const perceiveMs = this.now() - t1;
    for (const b of timing) {
      if (!perception.behaviors.some((x) => x.id === b)) perception.behaviors.push({ id: b, evidence: '(timing)' });
    }
    applyPerception(this.state, perception, this.spec, this.index);
    techTurn.behaviors = perception.behaviors.map((b) => b.id);
    this.transcript.push(techTurn);
    this.perceptions.push({ turnId: techTurn.id, perception });
    this.judgeMoves(perception);
    this.pushTimeline();

    const d = decideNext(this.ctx(perception));
    const t2 = this.now();
    const turn = await this.speak(d, techTurn.id);
    this.latency.push({ turnId: techTurn.id, perceiveMs, writeMs: this.now() - t2, totalMs: this.now() - t1 });
    return turn;
  }

  /** A customer hold ran its full length with the tech staying quiet. */
  async holdElapsed(): Promise<CustomerTurn | null> {
    const pending = this.pending;
    if (!pending) return null;
    this.pending = null;
    if (pending.kind === 'think') {
      const ev = this.moves.find((m) => m.turnId === pending.customerTurnId && m.moveId === pending.moveId);
      if (ev) {
        ev.silenceMs = pending.holdMs;
        this.finishSilenceMove(ev);
      }
      const p = emptyPerception();
      p.behaviors.push({ id: 'held_silence', evidence: '(timing)' });
      applyPerception(this.state, p, this.spec, this.index);
      this.state.turn -= 1; // a held silence is not a tech turn
      this.perceptions.push({ turnId: pending.customerTurnId, perception: p });
    }
    const d = afterHoldDirective(this.ctx(emptyPerception()), pending.moveId, pending.kind);
    return this.speak(d, 'after-hold');
  }

  /** The client fired an armed interrupt while the tech was talking. */
  interrupt(): CustomerTurn | null {
    const armed = this.armed;
    if (!armed) return null;
    this.armed = null;
    const d = interruptDirective(this.spec, { afterMs: armed.afterMs, moveId: armed.moveId, lines: [armed.text] });
    const turn: TranscriptTurn = {
      id: newId('t'),
      speaker: 'customer',
      text: armed.text,
      atMs: this.elapsedMs,
      act: 'interrupt',
      tone: 'rushed',
      moveId: armed.moveId,
    };
    this.transcript.push(turn);
    this.directives.push({ turnId: turn.id, directive: d });
    this.recordMove(armed.moveId, turn.id);
    this.lastCustomerMoveId = armed.moveId;
    return this.toCustomerTurn(turn, d);
  }

  end(): SessionRecord {
    if (!this.endedAt) this.endedAt = this.now();
    this.state.ended = true;
    for (const ev of this.moves) {
      if (ev.result !== 'pending') continue;
      const move = this.index.move(ev.moveId);
      if (move?.delivery.holdSilenceMs && ev.silenceMs !== undefined) this.finishSilenceMove(ev);
      else if (ev.techTurnsSeen === 0) {
        ev.result = 'unclear';
        ev.reason = 'The call ended before the tech responded.';
      } else this.finalizeMove(ev, true);
    }
    return this.record();
  }

  record(): SessionRecord {
    const end = this.endedAt ?? this.now();
    return {
      id: this.id,
      schema: 1,
      scenarioId: this.spec.scenario.id,
      personaId: this.spec.persona.id,
      companyId: this.spec.company?.id,
      drillId: this.spec.drill?.id,
      kind: this.spec.kind,
      difficulty: this.spec.difficulty,
      seed: this.request.seed,
      language: this.spec.language,
      contentVersion: this.index.bundle.version,
      adapters: { perceiver: this.perceiver.name, writer: this.writer.name },
      startedAt: new Date(this.t0).toISOString(),
      endedAt: this.endedAt ? new Date(this.endedAt).toISOString() : undefined,
      durationMs: end - this.t0,
      transcript: this.transcript,
      moves: this.moves,
      timeline: this.timeline,
      perceptions: this.perceptions,
      directives: this.directives,
      decision: this.state.decision,
      finalState: this.state,
      latency: this.latency,
    };
  }

  /* ---------------------------------------------------------------- internals */

  private ctx(perception: Perception) {
    return {
      spec: this.spec,
      index: this.index,
      state: this.state,
      perception,
      rng: this.rng,
      elapsedMs: this.elapsedMs,
      lastCustomerMoveId: this.lastCustomerMoveId,
      lastCustomerObjectionId: this.lastCustomerObjectionId,
    };
  }

  private perceptionInput(text: string): PerceptionInput {
    const concerns: PerceptionInput['concerns'] = this.state.objections
      .filter((o) => o.status !== 'resolved')
      .map((o) => {
        const m = this.index.move(o.moveId);
        return {
          id: o.moveId,
          label: m?.name ?? o.moveId,
          concern: m?.resolution?.concern ?? m?.summary ?? '',
          voiced: o.status !== 'latent',
          resolvers: m?.resolution?.resolvingBehaviors ?? [],
        };
      });
    const rc = this.spec.persona.hidden.realConcern;
    if (!this.state.realConcern.resolved) {
      concerns.push({ id: 'real', label: 'Deeper worry', concern: rc.description, voiced: this.state.realConcern.revealed, resolvers: [] });
    }
    const lastCustomer = [...this.transcript].reverse().find((t) => t.speaker !== 'tech');
    const lastMove = lastCustomer?.moveId ? this.index.move(lastCustomer.moveId) : undefined;
    return {
      spec: this.spec,
      state: this.state,
      transcript: this.transcript,
      techText: text,
      concerns,
      revealedFacts: this.spec.persona.hidden.facts
        .filter((f) => this.state.revealedFacts.includes(f.id))
        .map((f) => ({ id: f.id, text: f.text, useValue: f.useValue })),
      lastCustomerTurn: lastCustomer,
      lastCustomerMoveGroup: lastMove?.group,
    };
  }

  private async perceive(text: string): Promise<Perception> {
    const input = this.perceptionInput(text);
    if (!text) return emptyPerception();
    try {
      return await this.perceiver.perceive(input);
    } catch (e) {
      console.warn(`[sales-coach] perceiver ${this.perceiver.name} failed, using heuristic:`, (e as Error).message);
      return this.fallbackPerceiver.perceive(input);
    }
  }

  private async write(d: TurnDirective): Promise<string> {
    if (d.act === 'silence') return '';
    const input = { spec: this.spec, state: this.state, transcript: this.transcript, directive: d };
    try {
      const line = await this.writer.write(input);
      if (line.trim()) return cleanLine(line, AudioTag.options);
    } catch (e) {
      console.warn(`[sales-coach] writer ${this.writer.name} failed, using scripted:`, (e as Error).message);
    }
    return this.fallbackWriter.write(input);
  }

  private async speak(d: TurnDirective, afterTurnId: string): Promise<CustomerTurn> {
    this.onDirective?.(d);
    const text = await this.write(d);
    const speaker = d.speaker === 'secondary' ? 'secondary' : 'customer';
    const turn: TranscriptTurn = {
      id: newId('t'),
      speaker,
      text,
      atMs: this.elapsedMs,
      act: d.act,
      tone: d.tone,
      moveId: d.moveId,
    };
    this.transcript.push(turn);
    this.directives.push({ turnId: turn.id, directive: d });
    if (d.moveId && afterTurnId !== 'after-hold' && afterTurnId !== 'return') this.recordMove(d.moveId, turn.id);
    if (d.holdSilenceMs && d.holdKind) {
      this.pending = { kind: d.holdKind, moveId: d.moveId, holdMs: d.holdSilenceMs, customerTurnId: turn.id };
      turn.silenceMs = d.holdSilenceMs;
    }
    this.armed = d.armInterrupt
      ? { afterMs: d.armInterrupt.afterMs, moveId: d.armInterrupt.moveId, text: this.rng.pick(d.armInterrupt.lines) ?? 'So how much?' }
      : null;
    if (d.armInterrupt) this.state.movesUsed[d.armInterrupt.moveId] = this.state.movesUsed[d.armInterrupt.moveId] ?? 1;
    this.lastCustomerMoveId = d.moveId;
    this.lastCustomerObjectionId = d.objectionId;
    if (d.end) this.state.ended = true;
    return this.toCustomerTurn(turn, d);
  }

  private toCustomerTurn(turn: TranscriptTurn, d: TurnDirective): CustomerTurn {
    const sec = this.spec.persona.secondary;
    return {
      id: turn.id,
      speaker: d.speaker,
      speakerName: d.speaker === 'secondary' && sec ? sec.name.split(' ')[0]! : this.spec.persona.shortName,
      act: d.act,
      text: turn.text,
      tone: d.tone,
      audioTags: d.audioTags,
      delayMs: d.delayMs,
      holdSilenceMs: d.holdSilenceMs,
      holdKind: d.holdKind,
      armInterrupt: this.armed ?? undefined,
      soundCue: d.soundCue,
      moveId: d.moveId,
      decision: d.decision,
      ended: this.state.ended,
    };
  }

  private recordMove(moveId: string, turnId: string) {
    const move = this.index.move(moveId);
    if (!move) return;
    this.moves.push({
      moveId,
      kind: move.kind,
      turnId,
      firedAtMs: this.elapsedMs,
      result: 'pending',
      techTurnsSeen: 0,
      behaviorsAfter: [],
      addressed: false,
    });
  }

  private judgeMoves(perception: Perception) {
    const ids = perception.behaviors.map((b) => b.id);
    for (const ev of this.moves) {
      if (ev.result !== 'pending') continue;
      const move = this.index.move(ev.moveId);
      if (!move) continue;
      ev.techTurnsSeen += 1;
      for (const id of ids) if (!ev.behaviorsAfter.includes(id)) ev.behaviorsAfter.push(id);
      const concernId = move.kind === 'objection' ? move.id : this.directives.find((x) => x.turnId === ev.turnId)?.directive.objectionId;
      if (perception.addressed.some((a) => a.concernId === concernId || (move.kind === 'behavior' && a.concernId === 'real'))) ev.addressed = true;
      if (move.delivery.holdSilenceMs && ev.silenceMs !== undefined) {
        this.finishSilenceMove(ev);
        continue;
      }
      if (move.evaluate.failIf.anyBehaviors.some((b) => ids.includes(b))) {
        ev.result = 'fail';
        ev.reason = `Did ${move.evaluate.failIf.anyBehaviors.filter((b) => ids.includes(b)).join(', ')}`;
        continue;
      }
      if (this.passed(ev)) {
        ev.result = 'pass';
        continue;
      }
      if (ev.techTurnsSeen >= move.evaluate.windowTurns) this.finalizeMove(ev, false);
    }
  }

  private passed(ev: MoveEvent): boolean {
    const move = this.index.move(ev.moveId);
    if (!move) return false;
    const pi = move.evaluate.passIf;
    const any = pi.anyBehaviors.length === 0 || pi.anyBehaviors.some((b) => ev.behaviorsAfter.includes(b));
    const all = pi.allBehaviors.every((b) => ev.behaviorsAfter.includes(b));
    const addressed = pi.addressedConcern ? ev.addressed : true;
    const hasCriteria = pi.anyBehaviors.length > 0 || pi.allBehaviors.length > 0 || pi.addressedConcern;
    if (!hasCriteria) return false;
    // Objections pass when the concern was addressed even if the exact behavior differs.
    if (pi.addressedConcern && ev.addressed && all) return true;
    return any && all && addressed;
  }

  private finalizeMove(ev: MoveEvent, atEnd: boolean) {
    const move = this.index.move(ev.moveId);
    if (!move) return;
    const failed = move.evaluate.failIf.anyBehaviors.filter((b) => ev.behaviorsAfter.includes(b));
    if (failed.length) {
      ev.result = 'fail';
      ev.reason = `Did ${failed.join(', ')}`;
    } else if (this.passed(ev)) ev.result = 'pass';
    else {
      ev.result = 'fail';
      ev.reason = atEnd ? 'The call ended without a passing response.' : 'No passing response in the window.';
    }
  }

  private finishSilenceMove(ev: MoveEvent) {
    const move = this.index.move(ev.moveId);
    const min = move?.evaluate.passIf.minSilenceMs ?? 4000;
    ev.result = (ev.silenceMs ?? 0) >= min ? 'pass' : 'fail';
    ev.reason = `${Math.round((ev.silenceMs ?? 0) / 100) / 10}s of silence held, ${min / 1000}s needed`;
  }

  private pushTimeline() {
    const s = this.state;
    this.timeline.push({
      turn: s.turn,
      atMs: this.elapsedMs,
      phase: s.phase,
      trust: Math.round(s.trust),
      understanding: Math.round(s.understanding),
      engagement: Math.round(s.engagement),
      mood: s.mood,
      objections: s.objections
        .filter((o) => o.status !== 'latent')
        .map((o) => ({ moveId: o.moveId, strength: Math.round(o.strength), status: o.status })),
    });
  }
}
