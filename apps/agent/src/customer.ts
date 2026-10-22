import { ReadableStream } from 'node:stream/web';
import { type JobContext as LkJobContext, type llm, type tts, voice } from '@livekit/agents';
import { type CustomerSession, type CustomerTurn, type SessionRecord, stripTags } from '@sales-coach/engine';

/**
 * Bridges the LiveKit voice pipeline and the customer engine.
 *
 * There is no LLM node. When the tech finishes a turn (VAD + turn detector + Deepgram), the
 * transcript goes to CustomerSession.techTurn() and the returned line is spoken with say().
 * Timing the engine asks for is honored here:
 *   delayMs        pause before the customer speaks (minus the time the engine already took)
 *   holdSilenceMs  after the line, wait; if the tech stays quiet, call holdElapsed()
 *   armInterrupt   if the tech then talks for afterMs straight, cut in with the armed line
 */

type AudioFrame = tts.SynthesizedAudio['frame'];

export interface Caption {
  speaker: 'tech' | 'customer' | 'secondary';
  name?: string;
  text: string;
  final: boolean;
  atMs: number;
  act?: string;
  tone?: string;
  holdMs?: number;
}

export interface BridgeOptions {
  engine: CustomerSession;
  ctx: LkJobContext;
  /** ElevenLabs v3 and later render [sighs] style tags; older models would read them aloud. */
  ttsSupportsTags: boolean;
  /** A second voice for the spouse or partner, when the persona has one. */
  secondaryTts?: tts.TTS | null;
  appSessionId?: string;
}

const encoder = new TextEncoder();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class CustomerBridge {
  private session: voice.AgentSession | null = null;
  private chain: Promise<unknown> = Promise.resolve();
  private techSpeakingSince: number | null = null;
  private techStoppedAt: number | null = null;
  private interruptedCustomer = false;
  private agentState: voice.AgentState = 'initializing';
  private holdStartedAt: number | null = null;
  private holdTimer: NodeJS.Timeout | null = null;
  private holdElapsedMs: number | undefined;
  private armed: CustomerTurn['armInterrupt'] | null = null;
  private interruptTimer: NodeJS.Timeout | null = null;
  private finished = false;

  constructor(private readonly opts: BridgeOptions) {}

  private get engine() {
    return this.opts.engine;
  }

  /** Wire session events. Call after AgentSession is constructed, before start(). */
  attach(session: voice.AgentSession) {
    this.session = session;
    session.on(voice.AgentSessionEventTypes.UserStateChanged, (ev) => {
      if (ev.newState === 'speaking') this.techStartedSpeaking();
      else if (ev.oldState === 'speaking') this.techStoppedSpeaking();
    });
    session.on(voice.AgentSessionEventTypes.AgentStateChanged, (ev) => {
      this.agentState = ev.newState;
    });
    session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (ev) => {
      void this.caption({ speaker: 'tech', text: ev.transcript, final: ev.isFinal, atMs: this.engine.elapsedMs });
    });
    session.on(voice.AgentSessionEventTypes.Close, () => {
      void this.finish('session-closed');
    });
  }

  /** The customer's opening line (or nothing, when the tech speaks first). */
  async open() {
    await this.enqueue(async () => {
      const turn = await this.engine.start();
      if (turn) await this.play(turn, 0);
    });
  }

  /** Called from the agent's onUserTurnCompleted hook with the tech's final transcript. */
  techTurn(text: string) {
    const startedAtMs = this.techSpeakingSince ?? this.techStoppedAt ?? this.engine.elapsedMs;
    const endedAtMs = this.techStoppedAt ?? this.engine.elapsedMs;
    const interruptedCustomer = this.interruptedCustomer;
    const holdElapsedMs = this.holdElapsedMs;
    this.interruptedCustomer = false;
    this.holdElapsedMs = undefined;
    this.techSpeakingSince = null;
    this.cancelHold();
    this.cancelInterrupt();
    this.armed = null;
    void this.enqueue(async () => {
      if (this.engine.isEnded) return;
      const t0 = Date.now();
      const turn = await this.engine.techTurn({ text, startedAtMs, endedAtMs, interruptedCustomer, holdElapsedMs });
      await this.play(turn, Date.now() - t0);
    });
  }

  /** Ends the engine session once and publishes the record. */
  async finish(reason: string): Promise<SessionRecord | null> {
    if (this.finished) return null;
    this.finished = true;
    this.cancelHold();
    this.cancelInterrupt();
    const record = this.engine.end();
    const payload = JSON.stringify({ reason, appSessionId: this.opts.appSessionId, record });
    try {
      // Records can be large; text streams chunk them. Captions use plain data packets.
      await this.opts.ctx.room.localParticipant?.sendText(payload, { topic: 'record' });
    } catch (e) {
      console.warn('[agent] could not publish the session record:', (e as Error).message);
    }
    return record;
  }

  /* ---------------------------------------------------------------- internals */

  private enqueue(fn: () => Promise<void>): Promise<void> {
    const next = this.chain.then(fn).catch((e) => console.error('[agent] turn failed:', e));
    this.chain = next;
    return next;
  }

  private techStartedSpeaking() {
    const now = this.engine.elapsedMs;
    this.techSpeakingSince ??= now;
    this.techStoppedAt = null;
    if (this.agentState === 'speaking') this.interruptedCustomer = true;
    // Speaking into a hold: the tech broke the silence. Keep how long they lasted.
    if (this.holdStartedAt !== null) {
      this.holdElapsedMs = now - this.holdStartedAt;
      this.cancelHold();
    }
    // An armed interrupt fires after afterMs of continuous tech speech.
    const armed = this.armed;
    if (armed && !this.interruptTimer) {
      this.interruptTimer = setTimeout(() => {
        this.interruptTimer = null;
        if (this.techSpeakingSince === null) return;
        void this.enqueue(async () => {
          const turn = this.engine.interrupt();
          this.armed = null;
          if (turn) await this.play(turn, turn.delayMs, false);
        });
      }, armed.afterMs);
    }
  }

  private techStoppedSpeaking() {
    this.techStoppedAt = this.engine.elapsedMs;
    this.cancelInterrupt();
  }

  private cancelHold() {
    if (this.holdTimer) clearTimeout(this.holdTimer);
    this.holdTimer = null;
    this.holdStartedAt = null;
  }

  private cancelInterrupt() {
    if (this.interruptTimer) clearTimeout(this.interruptTimer);
    this.interruptTimer = null;
  }

  private startHold(turn: CustomerTurn) {
    if (!turn.holdSilenceMs) return;
    this.holdStartedAt = this.engine.elapsedMs;
    this.holdTimer = setTimeout(() => {
      this.holdTimer = null;
      if (this.holdStartedAt === null) return;
      this.holdStartedAt = null;
      void this.enqueue(async () => {
        const next = await this.engine.holdElapsed();
        if (next) await this.play(next, 0);
      });
    }, turn.holdSilenceMs);
  }

  /** Speak one customer turn, then set up whatever timing it asked for. */
  private async play(turn: CustomerTurn, spentMs: number, allowInterruptions = true) {
    const session = this.session;
    if (!session) return;
    const wait = Math.max(0, turn.delayMs - spentMs);
    if (wait > 0) await sleep(wait);

    const display = stripTags(turn.text);
    let handle: voice.SpeechHandle | null = null;
    if (display) {
      void this.caption({
        speaker: turn.speaker === 'secondary' ? 'secondary' : 'customer',
        name: turn.speakerName,
        text: display,
        final: true,
        atMs: this.engine.elapsedMs,
        act: turn.act,
        tone: turn.tone,
        holdMs: turn.holdSilenceMs,
      });
      const spoken = this.opts.ttsSupportsTags ? turn.text : display;
      const audio = turn.speaker === 'secondary' && this.opts.secondaryTts ? audioOf(this.opts.secondaryTts, spoken) : undefined;
      handle = session.say(spoken, { allowInterruptions, ...(audio ? { audio } : {}) });
    }
    this.armed = turn.armInterrupt ?? null;
    if (turn.holdSilenceMs && turn.holdKind) {
      if (handle) await handle.waitForPlayout().catch(() => undefined);
      this.startHold(turn);
    }
    if (turn.ended) {
      if (handle) await handle.waitForPlayout().catch(() => undefined);
      await this.finish('customer-ended');
    }
  }

  private async caption(c: Caption) {
    if (!c.text.trim()) return;
    try {
      await this.opts.ctx.room.localParticipant?.publishData(encoder.encode(JSON.stringify(c)), {
        reliable: true,
        topic: 'captions',
      });
    } catch {
      // Captions are best effort; the record carries the full transcript.
    }
  }
}

/** Pre-synthesized audio for the secondary speaker, so the spouse sounds like a different person. */
function audioOf(ttsInstance: tts.TTS, text: string): ReadableStream<AudioFrame> {
  const stream = ttsInstance.synthesize(text);
  return new ReadableStream<AudioFrame>({
    async start(controller) {
      try {
        for await (const chunk of stream) controller.enqueue(chunk.frame);
      } finally {
        controller.close();
      }
    },
  });
}

/** The customer agent: no LLM. Every completed tech turn goes to the engine instead. */
export class CustomerAgent extends voice.Agent {
  constructor(private readonly bridge: CustomerBridge) {
    super({
      instructions: 'You are a homeowner in a practice call. Replies come from the Sales Coach engine, not from a model here.',
    });
  }

  override async onEnter(): Promise<void> {
    await this.bridge.open();
  }

  override async onUserTurnCompleted(_chatCtx: llm.ChatContext, newMessage: llm.ChatMessage): Promise<void> {
    const text = newMessage.textContent?.trim();
    if (text) this.bridge.techTurn(text);
    // Never let the pipeline generate its own reply.
    throw new voice.StopResponse();
  }
}
