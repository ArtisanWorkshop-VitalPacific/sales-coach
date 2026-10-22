import type Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import type { Perceiver, PerceptionInput } from '../../adapters';
import { type BehaviorId, PERCEPTION_BEHAVIORS, Topic } from '../../schema';
import type { Perception } from '../../state';
import { resilient } from './client';
import type { CallConfig } from './config';
import { perceiverSystem, perceiverUser } from './prompts';

const PerceptionOut = z.object({
  summary: z.string().describe('One short sentence: what the technician just did.'),
  behaviors: z.array(
    z.object({
      id: z.enum(PERCEPTION_BEHAVIORS as unknown as [BehaviorId, ...BehaviorId[]]),
      evidence: z.string(),
    }),
  ),
  addressed: z.array(z.object({ concernId: z.string(), quality: z.enum(['partial', 'full']) })),
  usedFactIds: z.array(z.string()),
  topics: z.array(Topic),
  priceStated: z.number().nullable(),
  monthlyStated: z.number().nullable(),
  optionsCount: z.number().int().nullable(),
  unneededWork: z.array(z.string()),
  askedQuestion: z.boolean(),
  saidGoodbye: z.boolean(),
});
type PerceptionOut = z.infer<typeof PerceptionOut>;

const FORMAT = zodOutputFormat(PerceptionOut);
let SYSTEM: string | null = null;

/** Claude reads the tech's words and reports behaviors as structured data. */
export class ClaudePerceiver implements Perceiver {
  readonly name: string;
  constructor(
    private readonly client: Anthropic,
    private readonly config: CallConfig,
  ) {
    this.name = `claude:${config.model}${config.speed === 'fast' ? ':fast' : ''}`;
  }

  async perceive(input: PerceptionInput, signal?: AbortSignal): Promise<Perception> {
    SYSTEM ??= perceiverSystem();
    const c = this.config;
    const params: Record<string, unknown> = {
      model: c.model,
      max_tokens: c.maxTokens,
      ...(c.speed ? { speed: c.speed } : {}),
      ...(c.thinking ? { thinking: c.thinking } : {}),
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: perceiverUser(input) }],
      output_config: { ...(c.effort ? { effort: c.effort } : {}), format: FORMAT },
    };
    const message = await resilient(params, (p) =>
      this.client.messages.parse(p as unknown as Parameters<Anthropic['messages']['parse']>[0], { signal }),
    );
    const out = (message as unknown as { parsed_output: PerceptionOut | null }).parsed_output;
    if (!out) throw new Error(`perception returned no parsed output (stop: ${message.stop_reason})`);
    return toPerception(out, input);
  }
}

/** Keep only ids that exist, collapse duplicates, and sanity-check numbers. */
export function toPerception(out: PerceptionOut, input: PerceptionInput): Perception {
  const concernIds = new Set(input.concerns.map((c) => c.id));
  const factIds = new Set(input.revealedFacts.map((f) => f.id));
  const seen = new Set<string>();
  const behaviors = out.behaviors.filter((b) => (seen.has(b.id) ? false : (seen.add(b.id), true)));
  const addressed = new Map<string, 'partial' | 'full'>();
  for (const a of out.addressed) {
    if (!concernIds.has(a.concernId)) continue;
    if (addressed.get(a.concernId) !== 'full') addressed.set(a.concernId, a.quality);
  }
  const money = (n: number | null) => (n !== null && Number.isFinite(n) && n > 0 && n < 1_000_000 ? Math.round(n) : null);
  return {
    behaviors,
    addressed: [...addressed].map(([concernId, quality]) => ({ concernId, quality })),
    usedFactIds: [...new Set(out.usedFactIds.filter((id) => factIds.has(id)))],
    topics: [...new Set(out.topics)],
    priceStated: money(out.priceStated),
    monthlyStated: money(out.monthlyStated),
    optionsCount: out.optionsCount !== null && out.optionsCount > 0 && out.optionsCount < 10 ? out.optionsCount : null,
    unneededWork: out.unneededWork.filter((w) => w.trim().length > 0).slice(0, 3),
    askedQuestion: out.askedQuestion,
    saidGoodbye: out.saidGoodbye,
    summary: out.summary,
  };
}
