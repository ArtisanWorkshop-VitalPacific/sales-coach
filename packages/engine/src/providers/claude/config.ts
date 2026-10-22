/**
 * Model configuration by role. Change models here, not in prompts.
 *
 * standard  Haiku 5.5 listens (fast structured perception), Sonnet 5.5 speaks as the customer.
 * max       Sonnet 5.5 listens, Opus 5.5 in fast mode plays the customer. Highest quality, about 3x the cost.
 * economy   Haiku 5.5 for load tests and the test bench.
 *
 * The Coach runs on Opus 5.5 in fast mode so a full review fits a 60-second serverless call;
 * certification exams use Fable 5.1.
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
    perceive: { model: 'claude-haiku-5-5', effort: 'low', thinking: { type: 'disabled' }, maxTokens: 900 },
    write: { model: 'claude-sonnet-5-5', effort: 'low', thinking: { type: 'between_tools' }, maxTokens: 300 },
    coach: { model: 'claude-opus-5-5', effort: 'medium', speed: 'fast', maxTokens: 10000 },
    exam: { model: 'claude-fable-5-1', effort: 'medium', maxTokens: 12000 },
  },
  max: {
    perceive: { model: 'claude-sonnet-5-5', effort: 'low', thinking: { type: 'between_tools' }, maxTokens: 900 },
    write: { model: 'claude-opus-5-5', effort: 'low', speed: 'fast', maxTokens: 800 },
    coach: { model: 'claude-opus-5-5', effort: 'high', speed: 'fast', maxTokens: 12000 },
    exam: { model: 'claude-fable-5-1', effort: 'medium', maxTokens: 12000 },
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
