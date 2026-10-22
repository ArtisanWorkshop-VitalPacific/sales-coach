import {
  CustomerSession,
  HeuristicPerceiver,
  type LineWriter,
  type Perceiver,
  ScriptedWriter,
} from '@sales-coach/engine';
import { ClaudeCoach, claudeAdapters, presetFromEnv } from '@sales-coach/engine/claude';
import { contentIndex } from '../content';

type Adapters = { perceiver: Perceiver; writer: LineWriter; coach: ClaudeCoach | null };
let cached: Adapters | null = null;

/** Claude adapters when the key is set, otherwise the same rules engine the demo uses. */
export function serverAdapters(seed = 1): Adapters {
  if (process.env.ANTHROPIC_API_KEY) {
    if (!cached) {
      const a = claudeAdapters({ preset: presetFromEnv(process.env.SALES_COACH_PRESET) });
      cached = { perceiver: a.perceiver, writer: a.writer, coach: a.coach };
    }
    return cached;
  }
  return { perceiver: new HeuristicPerceiver(), writer: new ScriptedWriter(seed), coach: null };
}

export function sessionOptions(seed?: number) {
  const a = serverAdapters(seed);
  return { index: contentIndex(), perceiver: a.perceiver, writer: a.writer };
}

export { CustomerSession };
