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
