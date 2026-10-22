export {
  createClaudeClient,
  recoverable,
  resilient,
  stripTuning,
  textOf,
  withFastFallback,
} from './client';
export { ClaudeCoach, coachUser, mergeDebrief } from './coach';
export {
  type CallConfig,
  type ModelPreset,
  PERCEIVE_BUDGET_MS,
  PRESETS,
  presetFromEnv,
  type RoleConfig,
  requestFields,
} from './config';
export { ClaudePerceiver, toPerception } from './perceiver';
export {
  coachSystem,
  PROMPT_VERSION,
  perceiverSystem,
  perceiverUser,
  transcriptText,
  writerSystem,
  writerUser,
} from './prompts';
export { ClaudeWriter } from './writer';

import { createClaudeClient } from './client';
import { ClaudeCoach } from './coach';
import { type ModelPreset, PRESETS } from './config';
import { ClaudePerceiver } from './perceiver';
import { ClaudeWriter } from './writer';

/** Everything a server needs to run Claude-backed sessions, from one API key. */
export function claudeAdapters(opts: { apiKey?: string; preset?: ModelPreset } = {}) {
  const client = createClaudeClient(opts.apiKey);
  const roles = PRESETS[opts.preset ?? 'standard'];
  return {
    client,
    roles,
    perceiver: new ClaudePerceiver(client, roles.perceive),
    writer: new ClaudeWriter(client, roles.write),
    coach: new ClaudeCoach(client, roles.coach),
  };
}
