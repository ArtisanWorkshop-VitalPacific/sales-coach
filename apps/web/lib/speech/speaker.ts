'use client';

import { stripTags } from '@sales-coach/engine';
import type { BrowserVoicePrefs } from '../voices';

export interface VoiceRef {
  /** ElevenLabs voice id. */
  eleven: string;
  browser: BrowserVoicePrefs;
}

type Outcome = 'done' | 'stopped';

const FEMALE = ['Samantha', 'Ava', 'Allison', 'Susan', 'Zoe', 'Nicky', 'Karen', 'Moira', 'Tessa', 'Victoria', 'Microsoft Aria', 'Microsoft Jenny', 'Google US English', 'Paulina', 'Mónica', 'Monica'];
const MALE = ['Aaron', 'Alex', 'Tom', 'Fred', 'Evan', 'Nathan', 'Daniel', 'Microsoft Guy', 'Microsoft David', 'Google UK English Male', 'Jorge', 'Juan', 'Diego'];

function silentWavUrl(): string {
  const samples = 800;
  const buf = new ArrayBuffer(44 + samples * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF');
  v.setUint32(4, 36 + samples * 2, true);
  w(8, 'WAVE');
  w(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 16000, true);
  v.setUint32(28, 32000, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  w(36, 'data');
  v.setUint32(40, samples * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

/**
 * Plays customer and coach lines. ElevenLabs through /api/tts when the deployment has a key,
 * otherwise the browser's own voices. One persistent audio element keeps iOS happy.
 */
export class Speaker {
  private audio: HTMLAudioElement | null = null;
  private finish: ((o: Outcome) => void) | null = null;
  private elevenFailures = 0;
  private voices: SpeechSynthesisVoice[] = [];
  onLevel?: (speaking: boolean) => void;

  constructor(private eleven: boolean) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      load();
      window.speechSynthesis.addEventListener?.('voiceschanged', load);
    }
  }

  get usingEleven() {
    return this.eleven && this.elevenFailures < 2;
  }

  /** Call inside a tap handler before the first line, so mobile browsers allow audio. */
  unlock() {
    if (typeof window === 'undefined') return;
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      (this.audio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    }
    try {
      this.audio.src = silentWavUrl();
      void this.audio.play().catch(() => {});
    } catch {
      /* ignore */
    }
    if ('speechSynthesis' in window) {
      try {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        window.speechSynthesis.speak(u);
      } catch {
        /* ignore */
      }
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    const f = this.finish;
    this.finish = null;
    this.onLevel?.(false);
    f?.('stopped');
  }

  async speak(text: string, voice: VoiceRef): Promise<Outcome> {
    this.stop();
    const spoken = text.trim();
    if (!spoken) return 'done';
    if (this.usingEleven) {
      const r = await this.speakEleven(spoken, voice).catch(() => null);
      if (r) return r;
      this.elevenFailures++;
    }
    return this.speakBrowser(stripTags(spoken), voice.browser);
  }

  private speakEleven(text: string, voice: VoiceRef): Promise<Outcome | null> {
    return new Promise((resolve) => {
      if (!this.audio) this.unlock();
      const audio = this.audio!;
      let started = false;
      const done = (o: Outcome | null) => {
        audio.onended = null;
        audio.onerror = null;
        audio.onplaying = null;
        this.finish = null;
        this.onLevel?.(false);
        resolve(o);
      };
      this.finish = (o) => done(o);
      audio.onplaying = () => {
        started = true;
        this.onLevel?.(true);
      };
      audio.onended = () => done('done');
      audio.onerror = () => done(started ? 'done' : null);
      const lang = voice.browser.lang.startsWith('es') ? 'es' : 'en';
      audio.src = `/api/tts?v=${encodeURIComponent(voice.eleven)}&g=${voice.browser.gender}&l=${lang}&t=${encodeURIComponent(text)}`;
      audio.play().catch(() => done(null));
    });
  }

  private pickVoice(p: BrowserVoicePrefs): SpeechSynthesisVoice | undefined {
    const lang = p.lang.slice(0, 2);
    const pool = this.voices.filter((v) => v.lang.toLowerCase().startsWith(lang));
    const byName = (names: string[]) => {
      for (const n of names) {
        const hit = pool.find((v) => v.name.toLowerCase().includes(n.toLowerCase()));
        if (hit) return hit;
      }
      return undefined;
    };
    return (
      byName(p.hints) ??
      byName(p.gender === 'female' ? FEMALE : MALE) ??
      pool.find((v) => v.lang.toLowerCase() === p.lang.toLowerCase()) ??
      pool[0]
    );
  }

  private speakBrowser(text: string, p: BrowserVoicePrefs): Promise<Outcome> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
        resolve('done');
        return;
      }
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      const v = this.pickVoice(p);
      if (v) u.voice = v;
      u.lang = v?.lang ?? p.lang;
      u.rate = p.rate;
      u.pitch = p.pitch;
      // Safety net: some browsers never fire onend.
      const words = text.split(/\s+/).length;
      const timer = window.setTimeout(() => done('done'), 2500 + words * 520);
      const done = (o: Outcome) => {
        window.clearTimeout(timer);
        if (this.finish) {
          this.finish = null;
          this.onLevel?.(false);
          resolve(o);
        }
      };
      this.finish = (o) => {
        window.clearTimeout(timer);
        this.onLevel?.(false);
        resolve(o);
      };
      u.onstart = () => this.onLevel?.(true);
      u.onend = () => done('done');
      u.onerror = () => done('done');
      synth.cancel();
      synth.speak(u);
    });
  }
}
