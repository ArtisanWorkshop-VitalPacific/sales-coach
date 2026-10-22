'use client';

import {
  type CustomerTurn,
  type SessionRecord,
  type SessionSpec,
  type SpecRequest,
  stripTags,
  type TechTurnInput,
} from '@sales-coach/engine';
import type { Capabilities } from './capabilities';
import { LocalDriver, RemoteDriver, type SessionDriver } from './driver';
import { Recognizer, speechRecognitionSupported, type Utterance } from './speech/recognizer';
import { CUE_LABEL, playCue, unlockSfx } from './speech/sfx';
import { Speaker, type VoiceRef } from './speech/speaker';
import { readSettings } from './store';
import { browserVoicePrefs, elevenVoiceFor } from './voices';

export type CallStatus =
  | 'ready'
  | 'connecting'
  | 'customer'
  | 'listening'
  | 'thinking'
  | 'hold'
  | 'ended'
  | 'error';

export interface Caption {
  id: string;
  who: 'tech' | 'customer' | 'secondary' | 'cue';
  name: string;
  text: string;
  interrupted?: boolean;
}

export interface CallState {
  status: CallStatus;
  captions: Caption[];
  interim: string;
  holdKind?: 'think' | 'away';
  mode: 'demo' | 'brain';
  voice: 'eleven' | 'browser';
  micAvailable: boolean;
  micOn: boolean;
  customerSpeaking: boolean;
  techSpeaking: boolean;
  startedAt: number | null;
  error?: string;
  notice?: string;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
let captionSeq = 0;

export interface CallOptions {
  request: SpecRequest;
  spec: SessionSpec;
  caps: Capabilities | null;
  onEnded: (record: SessionRecord, mode: 'demo' | 'brain') => void;
}

/**
 * Runs one practice call in the browser: plays the customer, listens to the tech,
 * handles the customer's silences, step-aways, and interruptions.
 */
export class CallController {
  state: CallState;
  private listeners = new Set<() => void>();
  private driver: SessionDriver;
  private speaker: Speaker;
  private rec: Recognizer;
  private t0 = 0;
  private holdStart = 0;
  private inHold = false;
  private holdTimer: number | null = null;
  private interruptTimer: number | null = null;
  private armed: CustomerTurn['armInterrupt'] | null = null;
  private busy = false;
  private ended = false;
  private interruptedCustomer = false;
  private disposed = false;
  /** The browser refused to listen without a tap (iOS). Hands-free resumes after one tap. */
  private needsTap = false;
  private degradedNotice = false;
  /** Bumped on every turn change; a playback that wakes up to a newer number stops there. */
  private seq = 0;

  constructor(private opts: CallOptions) {
    const settings = readSettings();
    const brain = !!opts.caps?.brain && settings.brain === 'auto';
    const eleven = !!opts.caps?.voice && settings.voice === 'auto';
    this.driver = brain ? new RemoteDriver() : new LocalDriver();
    this.driver.onFallback = () =>
      this.set({
        mode: 'demo',
        notice: 'Lost the connection to Claude. The call continues in demo mode.',
      });
    this.speaker = new Speaker(eleven);
    this.speaker.onLevel = (on) => this.set({ customerSpeaking: on });
    this.rec = new Recognizer(opts.spec.language === 'es' ? 'es-US' : 'en-US', {
      onSpeechStart: () => this.onSpeechStart(),
      onInterim: (t) => this.set({ interim: t }),
      onUtterance: (u) => void this.onUtterance(u),
      onError: (m, code) => {
        if (code === 'unsupported') this.set({ notice: m, micAvailable: false });
        else {
          // Phones often need a tap before they let a page listen. Keep the mic, ask for a tap.
          this.needsTap = true;
          this.set({ notice: m });
        }
      },
      onState: (on) => this.set({ micOn: on }),
    });
    this.rec.endpointMs = settings.endpointMs;
    this.state = {
      status: 'ready',
      captions: [],
      interim: '',
      mode: brain ? 'brain' : 'demo',
      voice: eleven ? 'eleven' : 'browser',
      micAvailable: speechRecognitionSupported(),
      micOn: false,
      customerSpeaking: false,
      techSpeaking: false,
      startedAt: null,
    };
  }

  /* ------------------------------------------------------------- React glue */

  subscribe = (cb: () => void) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };
  getState = () => this.state;
  private set(patch: Partial<CallState>) {
    if (this.disposed) return;
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }
  private caption(c: Omit<Caption, 'id'>) {
    this.set({ captions: [...this.state.captions, { ...c, id: `c${++captionSeq}` }] });
  }

  /* ---------------------------------------------------------------- actions */

  /** Must be called from a tap: unlocks audio on phones. */
  async begin() {
    if (this.state.status !== 'ready') return;
    this.speaker.unlock();
    unlockSfx();
    // Ask for the microphone inside the tap, which phones require.
    navigator.mediaDevices
      ?.getUserMedia?.({ audio: true })
      .then((stream) => stream.getTracks().forEach((t) => t.stop()))
      .catch(() => {});
    this.t0 = performance.now();
    this.set({ status: 'connecting', startedAt: Date.now() });
    try {
      const turn = await this.driver.start(this.opts.request);
      this.set({ mode: this.driver.mode });
      if (turn) await this.playCustomer(turn);
      else this.listen();
    } catch (e) {
      this.set({ status: 'error', error: (e as Error).message });
    }
  }

  /** Typed reply, for browsers without speech recognition or noisy rooms. */
  sendText(text: string) {
    const t = text.trim();
    if (!t || this.busy || this.ended) return;
    if (this.state.status === 'customer') this.cutIn();
    const now = performance.now();
    const words = t.split(/\s+/).length;
    void this.onUtterance({ text: t, startedAt: now - Math.min(30000, words * 380), endedAt: now });
  }

  /** "I'm done talking": skip the silence wait. */
  commitNow() {
    this.rec.commitNow();
  }

  /** Push-to-talk and mic toggle. */
  toggleMic() {
    if (this.busy || this.ended) return;
    if (this.rec.listening) {
      if (this.rec.partialText) this.rec.commitNow();
      return;
    }
    if (this.state.status === 'customer') this.cutIn();
    this.needsTap = false;
    this.set({ notice: undefined });
    this.rec.start();
  }

  /** Talk over the customer. */
  cutIn() {
    if (this.state.status !== 'customer') return;
    this.interruptedCustomer = true;
    this.speaker.stop();
  }

  async hangUp() {
    await this.finish();
  }

  dispose() {
    this.ended = true;
    this.clearTimers();
    this.rec.stop();
    this.speaker.stop();
    this.disposed = true;
  }

  /** Replay a line in the customer's voice (used by the debrief). */
  get speakerRef() {
    return this.speaker;
  }

  /* --------------------------------------------------------------- the loop */

  private voiceFor(speaker: CustomerTurn['speaker']): VoiceRef {
    const p = this.opts.spec.persona;
    const secondary = speaker === 'secondary';
    return { eleven: elevenVoiceFor(p, secondary), browser: browserVoicePrefs(p, secondary) };
  }

  private async playCustomer(turn: CustomerTurn) {
    if (this.ended) return;
    const my = ++this.seq;
    const stale = () => my !== this.seq || this.ended;
    const wasListening = this.rec.listening;
    this.rec.stop();
    this.set({ interim: '', techSpeaking: false });
    // Phones keep the mic's audio route for a moment; playing right away can land in the earpiece.
    if (wasListening) await sleep(200);
    if (turn.soundCue) {
      this.caption({ who: 'cue', name: '', text: CUE_LABEL[turn.soundCue] });
      const ms = playCue(turn.soundCue);
      if (ms) await sleep(ms);
    }
    const delay =
      this.state.mode === 'brain' ? Math.min(turn.delayMs, 350) : Math.min(turn.delayMs, 1600);
    if (delay > 0) await sleep(delay);
    if (stale()) return;
    if (turn.degraded) {
      console.warn(
        '[sales-coach] backup answered this turn:',
        turn.degraded.stage,
        turn.degraded.reason,
      );
      this.degradedNotice = true;
      this.set({
        notice:
          'Claude missed that turn, so a backup line played. If this keeps happening, check the Claude key and credits.',
      });
    } else if (this.degradedNotice) {
      this.degradedNotice = false;
      this.set({ notice: undefined });
    }
    if (turn.text.trim()) {
      this.caption({
        who: turn.speaker === 'secondary' ? 'secondary' : 'customer',
        name: turn.speakerName,
        text: stripTags(turn.text),
      });
      this.set({ status: 'customer', holdKind: undefined });
      this.interruptedCustomer = false;
      await this.speaker.speak(turn.text, this.voiceFor(turn.speaker));
      if (stale()) return;
    }
    this.armed = turn.armInterrupt ?? null;
    if (turn.ended) {
      await sleep(600);
      if (stale()) return;
      await this.finish();
      return;
    }
    if (turn.holdSilenceMs && turn.holdSilenceMs > 0) {
      this.startHold(turn);
      return;
    }
    this.listen();
  }

  private startHold(turn: CustomerTurn) {
    const my = this.seq;
    this.inHold = true;
    this.holdStart = performance.now();
    this.set({ status: 'hold', holdKind: turn.holdKind ?? 'think' });
    if (readSettings().inputMode === 'hands-free' && this.state.micAvailable && !this.needsTap)
      this.rec.start();
    this.holdTimer = window.setTimeout(async () => {
      this.holdTimer = null;
      if (my !== this.seq || this.rec.speaking || this.busy || this.ended) return;
      this.rec.stop();
      this.inHold = false;
      this.busy = true;
      this.set({ status: 'thinking' });
      try {
        const next = await this.driver.hold();
        this.busy = false;
        if (next) await this.playCustomer(next);
        else this.listen();
      } catch (e) {
        this.busy = false;
        this.set({ status: 'error', error: (e as Error).message });
      }
    }, turn.holdSilenceMs);
  }

  private listen() {
    if (this.ended) return;
    this.set({ status: 'listening', holdKind: undefined });
    if (readSettings().inputMode === 'hands-free' && this.state.micAvailable && !this.needsTap)
      this.rec.start();
  }

  private onSpeechStart() {
    this.set({ techSpeaking: true });
    if (this.holdTimer !== null) {
      window.clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    const armed = this.armed;
    if (armed && this.interruptTimer === null) {
      this.interruptTimer = window.setTimeout(() => {
        this.interruptTimer = null;
        void this.fireInterrupt();
      }, armed.afterMs);
    }
  }

  private async fireInterrupt() {
    if (!this.rec.speaking || this.busy || this.ended || !this.armed) return;
    const partial = this.rec.partialText;
    this.rec.stop();
    this.armed = null;
    if (partial)
      this.caption({ who: 'tech', name: 'You', text: `${partial}...`, interrupted: true });
    const t = this.driver.interrupt();
    if (t) await this.playCustomer(t);
    else this.listen();
  }

  private async onUtterance(u: Utterance) {
    if (this.busy || this.ended) return;
    this.seq++;
    this.clearTimers();
    const rel = (t: number) => Math.max(0, Math.round(t - this.t0));
    const input: TechTurnInput = {
      text: u.text,
      startedAtMs: rel(u.startedAt),
      endedAtMs: rel(u.endedAt),
      ...(this.interruptedCustomer ? { interruptedCustomer: true } : {}),
      ...(this.inHold
        ? { holdElapsedMs: Math.max(0, Math.round(u.startedAt - this.holdStart)) }
        : {}),
    };
    this.inHold = false;
    this.interruptedCustomer = false;
    this.armed = null;
    this.rec.stop();
    this.caption({ who: 'tech', name: 'You', text: u.text });
    this.set({ status: 'thinking', interim: '', techSpeaking: false });
    this.busy = true;
    try {
      const turn = await this.driver.tech(input);
      this.busy = false;
      await this.playCustomer(turn);
    } catch (e) {
      this.busy = false;
      this.set({ status: 'error', error: (e as Error).message });
    }
  }

  private clearTimers() {
    if (this.holdTimer !== null) window.clearTimeout(this.holdTimer);
    if (this.interruptTimer !== null) window.clearTimeout(this.interruptTimer);
    this.holdTimer = null;
    this.interruptTimer = null;
  }

  private async finish() {
    if (this.ended) return;
    this.ended = true;
    this.clearTimers();
    this.rec.stop();
    this.speaker.stop();
    try {
      const record = this.driver.end();
      this.set({ status: 'ended' });
      this.opts.onEnded(record, this.driver.mode);
    } catch (e) {
      this.set({ status: 'error', error: (e as Error).message });
    }
  }
}
