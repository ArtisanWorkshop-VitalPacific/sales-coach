import { describe, expect, it } from 'vitest';
import raw from '../../content/generated/bundle.json';
import {
  type ContentBundle,
  ContentIndex,
  CustomerSession,
  HeuristicPerceiver,
  ScriptedWriter,
  scoreRecord,
} from '../src';
import {
  ClaudeCoach,
  ClaudePerceiver,
  ClaudeWriter,
  coachUser,
  PRESETS,
  perceiverSystem,
  writerSystem,
} from '../src/providers/claude';

const index = new ContentIndex(raw as unknown as ContentBundle);
const scenarioId = 'wh-tank-no-hot-water';

/** A stand-in for the Anthropic client that records requests and returns canned output. */
function fakeClient(parsed: unknown, text = 'Oh. [sighs] That is more than I hoped.') {
  const calls: Record<string, unknown>[] = [];
  const client = {
    messages: {
      parse: async (params: Record<string, unknown>) => {
        calls.push(params);
        return { stop_reason: 'end_turn', content: [], parsed_output: parsed };
      },
      stream: (params: Record<string, unknown>) => {
        calls.push(params);
        return (async function* () {
          for (const w of text.split(/(?<= )/))
            yield { type: 'content_block_delta', delta: { type: 'text_delta', text: w } };
        })();
      },
    },
  };
  return { client: client as never, calls };
}

describe('Claude adapters (offline, faked client)', () => {
  it('perceiver sends structured output request and keeps only valid ids', async () => {
    const { client, calls } = fakeClient({
      summary: 'Stated the price.',
      behaviors: [
        { id: 'stated_price', evidence: '$1,890' },
        { id: 'stated_price', evidence: 'dupe' },
      ],
      addressed: [
        { concernId: 'real', quality: 'partial' },
        { concernId: 'not-a-concern', quality: 'full' },
      ],
      usedFactIds: ['nope'],
      topics: ['budget'],
      priceStated: 1890,
      monthlyStated: null,
      optionsCount: 3,
      unneededWork: [],
      askedQuestion: false,
      saidGoodbye: false,
    });
    const p = new ClaudePerceiver(client, PRESETS.standard.perceive);
    const s = new CustomerSession(
      { scenarioId, seed: 3 },
      { index, perceiver: p, writer: new ScriptedWriter(3) },
    );
    await s.start();
    const turn = await s.techTurn({ text: 'The standard tank is $1,890.' });
    expect(turn).toBeTruthy();
    const req = calls[0]!;
    expect(req.model).toBe('claude-haiku-5-5');
    expect((req.output_config as { format?: unknown }).format).toBeTruthy();
    expect(Array.isArray(req.system)).toBe(true);
    const perception = s.record().perceptions.at(-1)!.perception;
    expect(perception.behaviors.map((b) => b.id)).toEqual(['stated_price']);
    expect(perception.addressed.map((a) => a.concernId)).toEqual(['real']);
    expect(perception.usedFactIds).toEqual([]);
    expect(perception.priceStated).toBe(1890);
  });

  it('writer streams text and cleans it', async () => {
    const { client, calls } = fakeClient(null, '"Oh. [sighs] That is more than I hoped."');
    const w = new ClaudeWriter(client, PRESETS.max.write);
    const s = new CustomerSession(
      { scenarioId, seed: 5 },
      { index, perceiver: new HeuristicPerceiver(), writer: w },
    );
    await s.start();
    const t = await s.techTurn({ text: 'Can you tell me what has been going on with it?' });
    expect(t.text).not.toMatch(/^"/);
    expect(calls.some((c) => c.speed === 'fast')).toBe(true);
  });

  it('coach merges Claude output over the rubric score', async () => {
    const s = new CustomerSession(
      { scenarioId, seed: 9 },
      { index, perceiver: new HeuristicPerceiver(), writer: new ScriptedWriter(9) },
    );
    await s.start();
    await s.techTurn({
      text: "Hi, I'm Alex. I'll take a look, show you what I find, and give you options. Sound good?",
    });
    await s.techTurn({ text: 'The standard tank is $1,890, or about $49 a month.' });
    const record = s.end();
    const base = scoreRecord(record, index);
    const techTurn = record.transcript.find((t) => t.speaker === 'tech')!;
    const { client } = fakeClient({
      skills: base.skills.map((k) => ({
        skillId: k.skillId,
        score: k.score === null ? null : 77,
        summary: 'Specific.',
        evidence: [{ turnId: techTurn.id, quote: 'x', note: 'y', polarity: 'positive' }],
      })),
      moves: [],
      win: { skillId: 'frame', turnId: techTurn.id, text: 'Great frame.' },
      fix: {
        skillId: 'discovery',
        turnId: 'bogus',
        text: 'Ask more.',
        modelResponse: 'What has been going on?',
      },
      spoken: 'Nice work — really.',
      managerNote: 'Solid.',
    });
    const coach = new ClaudeCoach(client, PRESETS.standard.coach);
    const d = await coach.debrief(record, index);
    expect(d.scoredBy).toBe('claude');
    expect(d.overall).toBe(77);
    expect(d.fix.turnId).toBeUndefined();
    expect(d.spoken).not.toContain('—');
    expect(coachUser(record, index, base)).toContain('TRANSCRIPT');
  });

  it('prompts render for every persona without undefined', () => {
    expect(perceiverSystem()).not.toContain('undefined');
    for (const sc of index.scenarios.values()) {
      const spec = {
        ...new CustomerSession(
          { scenarioId: sc.id, seed: 1 },
          { index, perceiver: new HeuristicPerceiver(), writer: new ScriptedWriter(1) },
        ).spec,
      };
      const sys = writerSystem(spec);
      expect(sys).not.toContain('undefined');
      if (spec.persona.secondary) expect(writerSystem(spec, true)).not.toContain('undefined');
    }
  });
});
