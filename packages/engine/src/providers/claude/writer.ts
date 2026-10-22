import Anthropic from '@anthropic-ai/sdk';
import type { LineWriter, WriteInput } from '../../adapters';
import type { CallConfig } from './config';
import { writerSystem, writerUser } from './prompts';

/** Claude speaks as the customer. The Director decides what happens; this decides how it sounds. */
export class ClaudeWriter implements LineWriter {
  readonly name: string;
  private readonly systems = new Map<string, string>();

  constructor(
    private readonly client: Anthropic,
    private readonly config: CallConfig,
  ) {
    this.name = `claude:${config.model}${config.speed === 'fast' ? ':fast' : ''}`;
  }

  async write(input: WriteInput, signal?: AbortSignal): Promise<string> {
    let out = '';
    for await (const chunk of this.stream(input, signal)) out += chunk;
    return out.trim();
  }

  async *stream(input: WriteInput, signal?: AbortSignal): AsyncIterable<string> {
    // Verbatim lines (scripted openers, drill openers) skip the model entirely.
    if (input.directive.verbatim && input.directive.scriptedLines[0]) {
      yield input.directive.scriptedLines[0];
      return;
    }
    const secondary = input.directive.speaker === 'secondary';
    const key = `${input.spec.persona.id}:${secondary ? 2 : 1}:${input.spec.language}:${input.spec.scenario.id}`;
    let system = this.systems.get(key);
    if (!system) {
      system = writerSystem(input.spec, secondary);
      this.systems.set(key, system);
    }
    const c = this.config;
    const params: Record<string, unknown> = {
      model: c.model,
      max_tokens: c.maxTokens,
      ...(c.speed ? { speed: c.speed } : {}),
      ...(c.thinking ? { thinking: c.thinking } : {}),
      ...(c.effort ? { output_config: { effort: c.effort } } : {}),
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: writerUser(input) }],
    };
    yield* this.run(params, signal, true);
  }

  private async *run(params: Record<string, unknown>, signal: AbortSignal | undefined, allowFallback: boolean): AsyncIterable<string> {
    const stream = this.client.messages.stream(params as unknown as Anthropic.MessageStreamParams, { signal });
    let yielded = false;
    try {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yielded = true;
          yield event.delta.text;
        }
      }
    } catch (e) {
      // Fast mode has its own rate limit; fall back to standard speed rather than go silent.
      if (!yielded && allowFallback && params.speed === 'fast' && e instanceof Anthropic.RateLimitError) {
        const { speed: _drop, ...rest } = params;
        yield* this.run(rest, signal, false);
        return;
      }
      throw e;
    }
  }
}
