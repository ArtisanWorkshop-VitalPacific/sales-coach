import type Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import type { Perceiver, PerceptionInput } from '../../adapters';
import { type BehaviorId, PERCEPTION_BEHAVIORS, Topic } from '../../schema';
import type { Perception } from '../../state';
import { resilient, TURN_REQUEST } from './client';
import type { CallConfig } from './config';
import { perceiverSystem, perceiverUser } from './prompts';

// Enum-like fields are plain strings: the API treats enum lists as guidance only, so an
// off-list value must be filtered here, not allowed to fail the whole parse.
const BEHAVIOR_SET = new Set<string>(PERCEPTION_BEHAVIORS);
const TOPIC_SET = new Set<string>(Topic.options);

const PerceptionOut = z.object({
  summary: z.string().describe('One short sentence: what the technician just did.'),
  behaviors: z.array(
    z.object({
      id: z.string().describe('A behavior id from the definitions in the system prompt.'),
      evidence: z.string(),
    }),
  ),
  addressed: z.array(
    z.object({ concernId: z.string(), quality: z.string().describe('partial or full') }),
  ),
  usedFactIds: z.array(z.string()),
  topics: z.array(z.string().describe(`One of: ${Topic.options.join(', ')}`)),
  priceStated: z.number().nullable(),
  monthlyStated: z.number().nullable(),
  optionsCount: z.number().nullable(),
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
      this.client.messages.parse(p as unknown as Parameters<Anthropic['messages']['parse']>[0], {
        signal,
        ...TURN_REQUEST,
      }),
    );
    const out = (message as unknown as { parsed_output: PerceptionOut | null }).parsed_output;
    if (!out)
      throw new Error(`perception returned no parsed output (stop: ${message.stop_reason})`);
    return toPerception(out, input);
  }
}

/** Keep only ids that exist, collapse duplicates, and sanity-check numbers. */
export function toPerception(out: PerceptionOut, input: PerceptionInput): Perception {
  const concernIds = new Set(input.concerns.map((c) => c.id));
  const factIds = new Set(input.revealedFacts.map((f) => f.id));
  const seen = new Set<string>();
  const behaviors: Perception['behaviors'] = [];
  for (const b of out.behaviors) {
    const id = b.id.trim();
    if (!BEHAVIOR_SET.has(id) || seen.has(id)) continue;
    seen.add(id);
    behaviors.push({ id: id as BehaviorId, evidence: b.evidence });
  }
  const addressed = new Map<string, 'partial' | 'full'>();
  for (const a of out.addressed) {
    if (!concernIds.has(a.concernId)) continue;
    const quality = /full/i.test(a.quality) ? 'full' : 'partial';
    if (addressed.get(a.concernId) !== 'full') addressed.set(a.concernId, quality);
  }
  const money = (n: number | null) =>
    n !== null && Number.isFinite(n) && n > 0 && n < 1_000_000 ? Math.round(n) : null;
  return {
    behaviors,
    addressed: [...addressed].map(([concernId, quality]) => ({ concernId, quality })),
    usedFactIds: [...new Set(out.usedFactIds.filter((id) => factIds.has(id)))],
    topics: [...new Set(out.topics.map((t) => t.trim()).filter((t) => TOPIC_SET.has(t)))],
    priceStated: money(out.priceStated),
    monthlyStated: money(out.monthlyStated),
    optionsCount:
      out.optionsCount !== null && out.optionsCount > 0 && out.optionsCount < 10
        ? Math.round(out.optionsCount)
        : null,
    unneededWork: out.unneededWork.filter((w) => w.trim().length > 0).slice(0, 3),
    askedQuestion: out.askedQuestion,
    saidGoodbye: out.saidGoodbye,
    summary: out.summary,
  };
}
