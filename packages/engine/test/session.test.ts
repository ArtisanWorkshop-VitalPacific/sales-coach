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
});
