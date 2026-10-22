import type { Persona, VoiceSpec } from '@sales-coach/engine';

/**
 * ElevenLabs default voices (available on every account). A persona's own
 * voice.elevenlabsVoiceId always wins; this is the fallback casting.
 */
export const ELEVEN = {
  matilda: 'XrExE9yKIg1WjnnlVkGX', // warm, mature female, American
  aria: '9BWtsMINqrJLrRacOk9x', // middle-aged female, American, textured
  jessica: 'cgSgspJ2msm6clMCkdW9', // young adult female, American, expressive
  laura: 'FGY2WhTYpPnrIDTdsKH5', // young adult female, American, upbeat
  sarah: 'EXAVITQu4vr4xnSDxMaL', // young adult female, soft
  bill: 'pqHfZKP75CvOlQylNhV4', // older male, American
  roger: 'CwhRBWXzGAHq8TQ4Fs17', // middle-aged male, American, confident
  brian: 'nPczCjzI2devNBz1zQrb', // middle-aged male, American, deep
  chris: 'iP95p4xoKVk53GoZ742B', // middle-aged male, American, casual
  eric: 'cjVigY5qzO86Huf0OWal', // middle-aged male, American, friendly
  liam: 'TX3LPaxmHKxFdv7VOQHJ', // young adult male, American
  will: 'bIHbv24MWmeRgasZH58o', // young adult male, American, relaxed
} as const;

/** The coach's voice for debriefs and drill lessons. */
export const COACH_VOICE = ELEVEN.eric;

const CASTING: Record<string, string> = {
  'margaret-retiree': ELEVEN.matilda,
  'devin-researcher': ELEVEN.liam,
  'rick-landlord': ELEVEN.roger,
  'tasha-burned': ELEVEN.jessica,
  'brian-today': ELEVEN.chris,
  'rosa-spanish': ELEVEN.sarah,
  'morgan-first-home': ELEVEN.laura,
  'paul-engineer': ELEVEN.bill,
  'jen-busy-parent': ELEVEN.laura,
  'greg-selling': ELEVEN.brian,
  'linda-warranty': ELEVEN.aria,
  'ruiz-couple': ELEVEN.aria,
};

function ageOf(v: VoiceSpec): number {
  const m = v.ageRange.match(/\d+/);
  return m ? Number(m[0]) : 45;
}

function castByVoice(v: VoiceSpec): string {
  const age = ageOf(v);
  if (v.gender === 'female')
    return age >= 60 ? ELEVEN.matilda : age >= 42 ? ELEVEN.aria : ELEVEN.jessica;
  return age >= 60 ? ELEVEN.bill : age >= 42 ? ELEVEN.roger : ELEVEN.will;
}

export function elevenVoiceFor(persona: Persona, secondary = false): string {
  if (secondary && persona.secondary) {
    return persona.secondary.voice.elevenlabsVoiceId || castByVoice(persona.secondary.voice);
  }
  return persona.voice.elevenlabsVoiceId || CASTING[persona.id] || castByVoice(persona.voice);
}

export interface BrowserVoicePrefs {
  lang: string;
  gender: 'female' | 'male';
  hints: string[];
  rate: number;
  pitch: number;
}

export function browserVoicePrefs(persona: Persona, secondary = false): BrowserVoicePrefs {
  const v = secondary && persona.secondary ? persona.secondary.voice : persona.voice;
  return {
    lang: persona.language === 'es' ? 'es-US' : 'en-US',
    gender: v.gender,
    hints: v.browserVoiceHints,
    rate: v.rate,
    pitch: v.pitch,
  };
}

export const COACH_BROWSER: BrowserVoicePrefs = {
  lang: 'en-US',
  gender: 'male',
  hints: ['Aaron', 'Alex', 'Google US English', 'Microsoft Guy', 'Daniel'],
  rate: 1.02,
  pitch: 1,
};
