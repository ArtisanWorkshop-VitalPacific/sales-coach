import { contentIndex } from '@sales-coach/content';
import { runCall, scriptedAdapters } from './runner';
import type { Level, Variant } from './tech';

const [scenarioId, level, seed, difficulty, variant] = process.argv.slice(2);
const index = contentIndex();
const r = await runCall(index, { scenarioId, difficulty: Number(difficulty ?? 2), level: (level ?? 'expert') as Level, variant: (variant ?? 'standard') as Variant, seed: Number(seed ?? 101) }, scriptedAdapters);
const dirs = new Map(r.record.directives.map((d) => [d.turnId, d.directive]));
for (const t of r.record.transcript) {
  const d = dirs.get(t.id);
  const pt = r.record.timeline;
  console.log(`${t.speaker.toUpperCase().padEnd(8)} ${t.text}${t.speaker === 'tech' ? `  {${t.behaviors?.join(',')}}` : `  <${t.act}${t.moveId ? ':' + t.moveId : ''}${d?.decision ? ' decision=' + d.decision : ''} why=${d?.why}>`}`);
}
console.log('decision', r.decision, 'score', r.score, 'final', JSON.stringify({ trust: r.record.finalState.trust, und: r.record.finalState.understanding, eng: r.record.finalState.engagement, urg: r.record.finalState.urgency, asks: r.record.finalState.decisionAsks, unneeded: r.record.finalState.flags.unneededWork, real: r.record.finalState.realConcern, objections: r.record.finalState.objections.map((o) => `${o.moveId}:${o.status}:${Math.round(o.strength)}`) }));
