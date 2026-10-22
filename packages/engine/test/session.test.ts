import { describe, expect, it } from 'vitest';
import raw from '../../content/generated/bundle.json';
import {
  type ContentBundle,
  ContentIndex,
  CustomerSession,
  HeuristicPerceiver,
  type Perceiver,
  ScriptedWriter,
  scoreRecord,
  type TurnDirective,
} from '../src';

const index = new ContentIndex(raw as unknown as ContentBundle);
const scenarioId = [...index.scenarios.keys()][0]!;

function session(seed = 7) {
  return new CustomerSession(
    { scenarioId, difficulty: 3, seed },
    { index, perceiver: new HeuristicPerceiver(), writer: new ScriptedWriter(seed) },
  );
}

const STRONG = [
  "Hi, I'm Alex with the plumbing company. Before I touch anything, here's how I like to work: I'll take a look, show you what I find, and give you a few options. Sound good?",
  'Can you tell me what has been going on with the water heater, and how long it has been like this?',
  'So it sounds like the hot water went out yesterday morning and you have been boiling water. That must be frustrating.',
  "Here's what I found. The tank is leaking from the bottom, which means the inside has rusted through. I can show you the photo.",
  'You have three options. The standard tank is $1,890, or about $49 a month. The premium is $2,490. Tankless is $4,650.',
  'Based on what you told me about living alone and wanting something simple, I would recommend the standard tank.',
  'That is a fair question. Getting more than one bid makes sense. What matters most to you in choosing who does the work?',
  'Would you like me to get that scheduled for today?',
];

describe('CustomerSession (heuristic + scripted)', () => {
  it('runs a full call and scores it', async () => {
    const s = session();
    const opening = await s.start();
    expect(s.transcriptTurns.length).toBeGreaterThanOrEqual(opening ? 1 : 0);
    for (const text of STRONG) {
      let turn = await s.techTurn({ text });
      expect(typeof turn.text).toBe('string');
      // Resolve holds so the next tech turn lands on a live customer.
      let guard = 0;
      while ((turn.holdSilenceMs ?? 0) > 0 && guard++ < 3) {
        const next = await s.holdElapsed();
        if (!next) break;
        turn = next;
      }
      if (turn.ended) break;
    }
    const record = s.end();
    expect(record.transcript.length).toBeGreaterThan(6);
    const debrief = scoreRecord(record, index);
    expect(debrief.overall).toBeGreaterThanOrEqual(0);
    expect(debrief.overall).toBeLessThanOrEqual(100);
    expect(debrief.skills).toHaveLength(10);
    expect(debrief.spoken.length).toBeGreaterThan(40);
  });

  it('snapshots and restores mid-call', async () => {
    const s = session(11);
    await s.start();
    await s.techTurn({ text: STRONG[0]! });
    const snap = s.snapshot();
    const json = JSON.parse(JSON.stringify(snap));
    const r = CustomerSession.restore(json, {
      index,
      perceiver: new HeuristicPerceiver(),
      writer: new ScriptedWriter(11),
    });
    const t = await r.techTurn({ text: STRONG[1]! });
    expect(t.text.length).toBeGreaterThan(0);
    expect(r.transcriptTurns.length).toBe(s.transcriptTurns.length + 2);
  });

  it('lets the rules read a turn when the perceiver runs past its budget', async () => {
    let aborted = false;
    const slow: Perceiver = {
      name: 'slow',
      perceive: (_input, signal) =>
        new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () => {
            aborted = true;
            reject(new Error('aborted'));
          });
        }),
    };
    const s = new CustomerSession(
      { scenarioId, difficulty: 3, seed: 5 },
      { index, perceiver: slow, writer: new ScriptedWriter(5), perceiveBudgetMs: 30 },
    );
    await s.start();
    const t = await s.techTurn({ text: STRONG[1]! });
    expect(t.text.length).toBeGreaterThan(0);
    expect(t.degraded).toBeUndefined();
    expect(aborted).toBe(true);
    expect(s.record().perceptions.at(-1)!.perception.summary).toMatch(/^\(rules, over 30ms\)/);
  });
});

describe('Objections the tech answers before the customer raises them', () => {
  /** Rules perception, plus the tech fully answering one concern on one chosen turn. */
  function answering(concernId: string, onTurn: number): Perceiver {
    const rules = new HeuristicPerceiver();
    let n = 0;
    return {
      name: 'answering',
      async perceive(input) {
        const p = await rules.perceive(input);
        n += 1;
        if (n === onTurn) p.addressed = [{ concernId, quality: 'full' }];
        return p;
      },
    };
  }

  const WARRANTY = 'home-warranty-covers-it';
  const EARLY =
    'Before we talk price: if your home warranty covers toilets, calling them may cost you less than me. Your call.';

  it('a forced objection still comes up, as a follow-up to what the tech said', async () => {
    const seen: TurnDirective[] = [];
    const s = new CustomerSession(
      { scenarioId: 'toilet-running-old', seed: 4 },
      {
        index,
        perceiver: answering(WARRANTY, 1),
        writer: new ScriptedWriter(4),
        onDirective: (d) => seen.push(d),
      },
    );
    await s.start();
    await s.techTurn({ text: EARLY });
    const o = s.state.objections.find((x) => x.moveId === WARRANTY)!;
    expect(o.preemptedTurn).toBe(1);
    expect(o.status).toBe('latent');
    expect(o.strength).toBeLessThan(30);
    await s.techTurn({ text: 'The rebuild is $245. A new toilet is $795.' });
    await s.techTurn({ text: 'Would you like me to go ahead with the rebuild today?' });
    const d = seen.find((x) => x.moveId === WARRANTY);
    expect(d).toBeTruthy();
    expect(d!.intent).toMatch(/already/i);
    expect(d!.intent).not.toMatch(/do not know about them/i);
  });

  it('an objection answered in full that is not forced never comes up and counts as a pass', async () => {
    const seen: TurnDirective[] = [];
    const s = new CustomerSession(
      { scenarioId: 'toilet-running-old', seed: 4 },
      {
        index,
        perceiver: answering(WARRANTY, 1),
        writer: new ScriptedWriter(4),
        onDirective: (d) => seen.push(d),
      },
    );
    s.spec.forcedMoves.length = 0; // this check needs a call where nothing is forced
    await s.start();
    await s.techTurn({ text: EARLY });
    const o = s.state.objections.find((x) => x.moveId === WARRANTY)!;
    expect(o.status).toBe('resolved');
    const ev = s.record().moves.find((m) => m.moveId === WARRANTY);
    expect(ev?.result).toBe('pass');
    for (const text of [
      'The rebuild is $245. A new toilet is $795.',
      'Would you like me to go ahead with the rebuild today?',
    ])
      await s.techTurn({ text });
    expect(seen.some((x) => x.moveId === WARRANTY)).toBe(false);
  });
});
