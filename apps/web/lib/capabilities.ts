import { PRESETS, presetFromEnv } from '@sales-coach/engine/claude';
import { elevenLabsKey } from './server/keys';

export interface Capabilities {
  /** Claude plays the customer and coaches. Off means Demo mode (rules + scripted lines). */
  brain: boolean;
  /** ElevenLabs voices. Off means the browser's built-in voices. */
  voice: boolean;
  /** LiveKit Live mode is configured. */
  live: boolean;
  billing: boolean;
  db: boolean;
  servicetitan: boolean;
  preset: string;
  models: { listen: string; speak: string; coach: string } | null;
}

/** Server only: what this deployment can do, from which keys are set. Never exposes values. */
export function capabilities(): Capabilities {
  const env = process.env;
  const brain = !!env.ANTHROPIC_API_KEY;
  const preset = presetFromEnv(env.SALES_COACH_PRESET);
  const roles = PRESETS[preset];
  return {
    brain,
    voice: !!elevenLabsKey(),
    live: !!(env.LIVEKIT_URL && env.LIVEKIT_API_KEY && env.LIVEKIT_API_SECRET),
    billing: !!env.STRIPE_SECRET_KEY,
    db: !!env.DATABASE_URL,
    servicetitan: !!(
      env.SERVICETITAN_CLIENT_ID &&
      env.SERVICETITAN_CLIENT_SECRET &&
      env.SERVICETITAN_APP_KEY
    ),
    preset,
    models: brain
      ? {
          listen: roles.perceive.model + (roles.perceive.speed === 'fast' ? ' (fast)' : ''),
          speak: roles.write.model + (roles.write.speed === 'fast' ? ' (fast)' : ''),
          coach: roles.coach.model,
        }
      : null,
  };
}
