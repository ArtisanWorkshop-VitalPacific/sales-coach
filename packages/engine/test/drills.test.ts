import { describe, expect, it } from 'vitest';
import raw from '../../content/generated/bundle.json';
import { type ContentBundle, ContentIndex, CustomerSession, HeuristicPerceiver, ScriptedWriter, scoreRecord } from '../src';

const index = new ContentIndex(raw as unknown as ContentBundle);

describe('drills', () => {
  it('hold-the-silence ends after the moment and passes when the tech holds', async () => {
    const s = new CustomerSession({ drillId: 'hold-the-silence', seed: 4 }, { index, perceiver: new HeuristicPerceiver(), writer: new ScriptedWriter(4) });
    await s.start();
    let t = await s.techTurn({ text: 'For the standard option, everything included, it comes to eighteen ninety.' });
    expect(t.holdSilenceMs ?? 0).toBeGreaterThan(0);
    const after = await s.holdElapsed();
    expect(after).not.toBeNull();
    t = after!;
    // The drill may need one more exchange to judge; it must end within a few turns.
    for (let i = 0; i < 4 && !t.ended; i++) t = await s.techTurn({ text: 'Take your time. What questions do you have?' });
    expect(t.ended).toBe(true);
    const record = s.end();
    const d = scoreRecord(record, index);
    expect(record.kind).toBe('drill');
    expect(d.passed).toBe(true);
  });

  it('drills only force their own moves', () => {
    for (const d of index.drills.values()) {
      const s = new CustomerSession({ drillId: d.id, seed: 1 }, { index, perceiver: new HeuristicPerceiver(), writer: new ScriptedWriter(1) });
      expect(s.spec.forcedMoves.every((m) => d.forcedMoves.includes(m))).toBe(true);
    }
  });
});
