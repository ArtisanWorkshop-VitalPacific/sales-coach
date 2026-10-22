'use client';

import type { SoundCue } from '@sales-coach/engine';

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const C =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!C) return null;
  ctx ??= new C();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freqs: number[], start: number, dur: number, gain = 0.06) {
  const c = audio();
  if (!c) return;
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.02);
  g.gain.setValueAtTime(gain, c.currentTime + start + dur - 0.05);
  g.gain.linearRampToValueAtTime(0, c.currentTime + start + dur);
  g.connect(c.destination);
  for (const f of freqs) {
    const o = c.createOscillator();
    o.frequency.value = f;
    o.connect(g);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.05);
  }
}

/** Synthesized cues for moments that need a sound. Others show as a caption only. */
export function playCue(cue: SoundCue): number {
  switch (cue) {
    case 'phone-ring':
      tone([440, 480], 0, 0.9);
      tone([440, 480], 1.4, 0.9);
      return 2300;
    case 'doorbell':
      tone([659], 0, 0.5, 0.08);
      tone([523], 0.5, 0.8, 0.08);
      return 1300;
    default:
      return 0;
  }
}

export function unlockSfx() {
  audio();
}

export const CUE_LABEL: Record<SoundCue, string> = {
  'phone-ring': 'Phone ringing',
  doorbell: 'Doorbell',
  'dog-bark': 'Dog barking',
  'tv-background': 'TV in the background',
  'kids-background': 'Kids in the background',
  'door-close': 'Door closes',
  footsteps: 'Footsteps',
};
