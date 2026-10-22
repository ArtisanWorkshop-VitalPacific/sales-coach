/**
 * Model configuration by role. Change models here, not in prompts.
 *
 * standard  Sonnet 5.5 plays the customer with no up-front thinking for speed.
 * max       Opus 5.5 in fast mode plays the customer. Highest quality, about 3x the cost.
 * economy   Haiku 5.5 for load tests and the test bench.
 *
 * The Coach always runs on Opus 5.5 at high effort; certification exams use Fable 5.1.
 */
export type ModelPreset = 'standard' | 'max' | 'economy';

export interface CallConfig {
  model: string;
  effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  speed?: 'fast';
  thinking?: { type: 'between_tools' } | { type: 'disabled' } | { type: 'adaptive' };
  maxTokens: number;
}

export interface RoleConfig {
  perceive: CallConfig;
  write: CallConfig;
  coach: CallConfig;
  exam: CallConfig;
}

export const PRESETS: Record<ModelPreset, RoleConfig> = {
  standard: {
    perceive: { model: 'claude-sonnet-5-5', effort: 'low', thinking: { type: 'between_tools' }, maxTokens: 900 },
    write: { model: 'claude-sonnet-5-5', effort: 'low', thinking: { type: 'between_tools' }, maxTokens: 300 },
    coach: { model: 'claude-opus-5-5', effort: 'high', maxTokens: 12000 },
    exam: { model: 'claude-fable-5-1', effort: 'high', maxTokens: 16000 },
  },
  max: {
    perceive: { model: 'claude-opus-5-5', effort: 'low', speed: 'fast', maxTokens: 1500 },
    write: { model: 'claude-opus-5-5', effort: 'low', speed: 'fast', maxTokens: 800 },
    coach: { model: 'claude-opus-5-5', effort: 'high', maxTokens: 12000 },
    exam: { model: 'claude-fable-5-1', effort: 'high', maxTokens: 16000 },
  },
  economy: {
    perceive: { model: 'claude-haiku-5-5', effort: 'low', thinking: { type: 'disabled' }, maxTokens: 900 },
    write: { model: 'claude-haiku-5-5', effort: 'low', thinking: { type: 'disabled' }, maxTokens: 300 },
    coach: { model: 'claude-sonnet-5-5', effort: 'medium', maxTokens: 10000 },
    exam: { model: 'claude-opus-5-5', effort: 'high', maxTokens: 12000 },
  },
};

export function presetFromEnv(value: string | undefined): ModelPreset {
  return value === 'max' || value === 'economy' ? value : 'standard';
}

/** Request fields for a role, ready to spread into messages.create. */
export function requestFields(c: CallConfig) {
  return {
    model: c.model,
    max_tokens: c.maxTokens,
    ...(c.speed ? { speed: c.speed } : {}),
    ...(c.thinking ? { thinking: c.thinking } : {}),
    ...(c.effort ? { output_config: { effort: c.effort } } : {}),
  };
}
