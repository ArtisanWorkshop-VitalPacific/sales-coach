import Anthropic from '@anthropic-ai/sdk';

export type ClaudeClient = Anthropic;

export function createClaudeClient(apiKey?: string): Anthropic {
  return new Anthropic({
    apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY,
    maxRetries: 0,
    timeout: 60_000,
  });
}

/**
 * Per-request limits. A live turn has to answer inside one 60-second serverless call that runs
 * listening and speaking back to back, so each of those gets a short leash and no SDK retries.
 * The coach runs alone and gets most of a 300-second function.
 */
export const TURN_REQUEST = { timeout: 12_000, maxRetries: 0 } as const;
export const COACH_REQUEST = { timeout: 270_000, maxRetries: 1 } as const;

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

/**
 * Drop optional tuning fields the API rejected, keeping the output format. Without a thinking
 * setting a model may think by default, so make room for it: a 300-token line budget could
 * otherwise be spent before any words come out.
 */
export function stripTuning(params: Record<string, unknown>): Record<string, unknown> {
  const { thinking: _t, speed: _s, ...rest } = params;
  const oc = rest.output_config as Record<string, unknown> | undefined;
  if (oc) {
    const { effort: _e, ...keep } = oc;
    if (Object.keys(keep).length) rest.output_config = keep;
    else delete rest.output_config;
  }
  if (typeof rest.max_tokens === 'number' && rest.max_tokens < 2000) rest.max_tokens = 2000;
  return rest;
}

/**
 * Recover from the request-shape problems a new deployment can hit: fast mode rate limits or
 * access, a tuning field a model does not accept, or a model id this account cannot use yet.
 */
export function recoverable(
  e: unknown,
  params: Record<string, unknown>,
): Record<string, unknown> | null {
  const fastRefused =
    e instanceof Anthropic.RateLimitError ||
    e instanceof Anthropic.PermissionDeniedError ||
    (e instanceof Anthropic.BadRequestError && /speed|fast/i.test(e.message));
  if (params.speed === 'fast' && fastRefused) {
    const { speed: _drop, ...rest } = params;
    return rest;
  }
  if (
    e instanceof Anthropic.BadRequestError &&
    /thinking|effort|speed|output_config/i.test(e.message)
  ) {
    const next = stripTuning(params);
    return JSON.stringify(next) === JSON.stringify(params) ? null : next;
  }
  if (
    e instanceof Anthropic.NotFoundError ||
    (e instanceof Anthropic.BadRequestError && /model/i.test(e.message))
  ) {
    const fallback = MODEL_FALLBACK[String(params.model)];
    return fallback ? stripTuning({ ...params, model: fallback }) : null;
  }
  return null;
}

/**
 * What worked last time, per configured model, so a rejected field or model costs one failed
 * request per server instance instead of one per turn.
 */
interface Learned {
  model?: string;
  stripped: boolean;
  noFast: boolean;
}
const learned = new Map<string, Learned>();

export function applyLearned(params: Record<string, unknown>): Record<string, unknown> {
  const l = learned.get(String(params.model));
  if (!l) return params;
  let p: Record<string, unknown> = { ...params };
  if (l.noFast) delete p.speed;
  if (l.stripped) p = stripTuning(p);
  if (l.model) p.model = l.model;
  return p;
}

export function remember(original: Record<string, unknown>, used: Record<string, unknown>) {
  if (original === used) return;
  const changedModel = used.model !== original.model ? String(used.model) : undefined;
  const stripped = 'thinking' in original && !('thinking' in used);
  const noFast = original.speed === 'fast' && used.speed !== 'fast';
  if (changedModel || stripped || noFast)
    learned.set(String(original.model), { model: changedModel, stripped, noFast });
}

/** Call once; on a recoverable error, adjust and retry. Remembers what worked. */
export async function resilient<T>(
  params: Record<string, unknown>,
  call: (p: Record<string, unknown>) => Promise<T>,
  attempts = 2,
): Promise<T> {
  let p = applyLearned(params);
  for (let attempt = 0; ; attempt++) {
    try {
      const result = await call(p);
      remember(params, p);
      return result;
    } catch (e) {
      const next = attempt < attempts - 1 ? recoverable(e, p) : null;
      if (!next) throw e;
      console.warn(
        '[sales-coach] Claude request adjusted after error:',
        (e as Error).message.slice(0, 160),
      );
      p = next;
    }
  }
}
