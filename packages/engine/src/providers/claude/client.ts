import Anthropic from '@anthropic-ai/sdk';

export type ClaudeClient = Anthropic;

export function createClaudeClient(apiKey?: string): Anthropic {
  return new Anthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 60_000 });
}

/**
 * Fast mode has its own rate limit. When it is exhausted, fall back to standard speed
 * instead of waiting, because a customer who goes silent breaks the practice.
 */
export async function withFastFallback<T>(
  params: Record<string, unknown>,
  call: (p: Record<string, unknown>) => Promise<T>,
): Promise<T> {
  try {
    return await call(params);
  } catch (e) {
    if (params.speed === 'fast' && e instanceof Anthropic.RateLimitError) {
      const { speed: _drop, ...rest } = params;
      return call(rest);
    }
    throw e;
  }
}

/** Collect the text blocks of a response, skipping thinking blocks. */
export function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

const MODEL_FALLBACK: Record<string, string> = {
  'claude-fable-5-1': 'claude-opus-5-5',
  'claude-opus-5-5': 'claude-sonnet-5-5',
  'claude-haiku-5-5': 'claude-sonnet-5-5',
};

/** Drop optional tuning fields the API rejected, keeping the output format. */
export function stripTuning(params: Record<string, unknown>): Record<string, unknown> {
  const { thinking: _t, speed: _s, ...rest } = params;
  const oc = rest.output_config as Record<string, unknown> | undefined;
  if (oc) {
    const { effort: _e, ...keep } = oc;
    if (Object.keys(keep).length) rest.output_config = keep;
    else delete rest.output_config;
  }
  return rest;
}

/**
 * Recover from the request-shape problems a new deployment can hit: fast mode rate limits,
 * a tuning field a model does not accept, or a model id this account cannot use yet.
 */
export function recoverable(e: unknown, params: Record<string, unknown>): Record<string, unknown> | null {
  if (e instanceof Anthropic.RateLimitError && params.speed === 'fast') {
    const { speed: _drop, ...rest } = params;
    return rest;
  }
  if (e instanceof Anthropic.BadRequestError && /thinking|effort|speed|output_config/i.test(e.message)) {
    const next = stripTuning(params);
    return JSON.stringify(next) === JSON.stringify(params) ? null : next;
  }
  if (e instanceof Anthropic.NotFoundError || (e instanceof Anthropic.BadRequestError && /model/i.test(e.message))) {
    const fallback = MODEL_FALLBACK[String(params.model)];
    return fallback ? stripTuning({ ...params, model: fallback }) : null;
  }
  return null;
}

/** Call once; on a recoverable error, adjust and retry (at most twice). */
export async function resilient<T>(
  params: Record<string, unknown>,
  call: (p: Record<string, unknown>) => Promise<T>,
): Promise<T> {
  let p = params;
  for (let attempt = 0; ; attempt++) {
    try {
      return await call(p);
    } catch (e) {
      const next = attempt < 2 ? recoverable(e, p) : null;
      if (!next) throw e;
      console.warn('[sales-coach] Claude request adjusted after error:', (e as Error).message.slice(0, 160));
      p = next;
    }
  }
}
