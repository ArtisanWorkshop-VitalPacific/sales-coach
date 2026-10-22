'use client';

export interface Utterance {
  text: string;
  /** performance.now() timestamps. */
  startedAt: number;
  endedAt: number;
}

export interface RecognizerEvents {
  onSpeechStart?: (at: number) => void;
  onInterim?: (text: string) => void;
  onUtterance?: (u: Utterance) => void;
  onError?: (message: string) => void;
  onState?: (listening: boolean) => void;
}

type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onspeechstart: (() => void) | null;
};

export function speechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/**
 * Browser speech recognition with endpointing: an utterance is committed after a short
 * silence. One recognition session per utterance keeps results clean across browsers.
 */
export class Recognizer {
  endpointMs = 1100;
  private rec: SR | null = null;
  private active = false;
  private finalText = '';
  private interim = '';
  private startedAt = 0;
  private lastHeard = 0;
  private timer: number | null = null;
  private restartTimer: number | null = null;
  private generation = 0;

  constructor(
    private lang: string,
    private events: RecognizerEvents,
  ) {}

  get listening() {
    return this.active;
  }

  get speaking() {
    return this.startedAt > 0;
  }

  get speakingForMs() {
    return this.startedAt ? performance.now() - this.startedAt : 0;
  }

  get partialText() {
    return `${this.finalText} ${this.interim}`.trim();
  }

  setLang(lang: string) {
    this.lang = lang;
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.reset();
    this.spawn();
    this.events.onState?.(true);
  }

  /** Stop listening and drop anything heard. */
  stop() {
    this.active = false;
    this.generation++;
    this.clearTimers();
    try {
      this.rec?.abort();
    } catch {
      /* ignore */
    }
    this.rec = null;
    this.reset();
    this.events.onState?.(false);
  }

  /** Commit what has been heard right now (the "I'm done" button). */
  commitNow() {
    if (this.partialText) this.commit();
  }

  private reset() {
    this.finalText = '';
    this.interim = '';
    this.startedAt = 0;
    this.lastHeard = 0;
  }

  private clearTimers() {
    if (this.timer !== null) window.clearTimeout(this.timer);
    if (this.restartTimer !== null) window.clearTimeout(this.restartTimer);
    this.timer = null;
    this.restartTimer = null;
  }

  private spawn() {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      this.events.onError?.('Speech recognition is not available in this browser. Type your replies instead.');
      this.active = false;
      this.events.onState?.(false);
      return;
    }
    const gen = ++this.generation;
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = this.lang;
    rec.maxAlternatives = 1;
    // Each recognition session reports results from index 0; keep text per session.
    let sessionFinal = '';
    const base = this.finalText;
    rec.onresult = (e) => {
      if (gen !== this.generation) return;
      let interim = '';
      sessionFinal = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]!;
        if (r.isFinal) sessionFinal += `${r[0].transcript} `;
        else interim += `${r[0].transcript} `;
      }
      this.finalText = `${base} ${sessionFinal}`.replace(/\s+/g, ' ').trim();
      this.interim = interim.trim();
      const now = performance.now();
      if (!this.startedAt && this.partialText) {
        this.startedAt = now;
        this.events.onSpeechStart?.(now);
      }
      this.lastHeard = now;
      this.events.onInterim?.(this.partialText);
      this.arm();
    };
    rec.onerror = (e) => {
      if (gen !== this.generation) return;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        this.events.onError?.('Microphone access is blocked. Allow the microphone, or type your replies.');
        this.stop();
      }
      // no-speech, aborted, network: onend restarts.
    };
    rec.onend = () => {
      if (gen !== this.generation || !this.active) return;
      // Browsers end sessions on their own; keep listening.
      this.restartTimer = window.setTimeout(() => {
        if (this.active && gen === this.generation) this.spawn();
      }, 120);
    };
    this.rec = rec;
    try {
      rec.start();
    } catch {
      this.restartTimer = window.setTimeout(() => this.active && this.spawn(), 300);
    }
  }

  private arm() {
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.timer = null;
      if (!this.active) return;
      if (performance.now() - this.lastHeard >= this.endpointMs - 30 && this.partialText) this.commit();
    }, this.endpointMs);
  }

  private commit() {
    const text = this.partialText;
    const u: Utterance = { text, startedAt: this.startedAt || performance.now(), endedAt: this.lastHeard || performance.now() };
    // Fresh session for the next utterance.
    this.generation++;
    try {
      this.rec?.abort();
    } catch {
      /* ignore */
    }
    this.rec = null;
    this.clearTimers();
    this.reset();
    if (this.active) this.spawn();
    if (text) this.events.onUtterance?.(u);
  }
}
