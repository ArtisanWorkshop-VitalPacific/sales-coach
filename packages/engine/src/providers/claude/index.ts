export { createClaudeClient, withFastFallback, textOf } from './client';
export { PRESETS, presetFromEnv, requestFields, type CallConfig, type ModelPreset, type RoleConfig } from './config';
export { ClaudePerceiver, toPerception } from './perceiver';
export { ClaudeWriter } from './writer';
export { ClaudeCoach, coachUser, mergeDebrief } from './coach';
export { PROMPT_VERSION, perceiverSystem, perceiverUser, writerSystem, writerUser, coachSystem, transcriptText } from './prompts';

import { createClaudeClient } from './client';
import { PRESETS, type ModelPreset } from './config';
import { ClaudeCoach } from './coach';
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
