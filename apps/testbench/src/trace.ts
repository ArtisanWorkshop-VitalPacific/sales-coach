/**
 * Prints one bench call turn by turn, with behaviors, directives, and the final state.
 * For debugging the engine against the scripted technician.
 *
 *   pnpm --filter @sales-coach/testbench exec tsx src/trace.ts <scenarioId> [level] [seed] [difficulty] [variant]
 *   e.g. tsx src/trace.ts wh-tank-no-hot-water expert 101 2
 */
import { contentIndex } from '@sales-coach/content';
import { runCall, scriptedAdapters } from './runner';
import type { Level, Variant } from './tech';

const [scenarioId, level = 'expert', seed = '101', difficulty = '2', variant = 'standard'] =
  process.argv.slice(2);
const index = contentIndex();
if (!scenarioId || !index.scenarios.has(scenarioId)) {
  console.log(
    `Usage: tsx src/trace.ts <scenarioId> [novice|solid|expert] [seed] [difficulty] [standard|upsell|pushy]`,
  );
  console.log(`Scenarios: ${[...index.scenarios.keys()].join(', ')}`);
  process.exit(scenarioId ? 1 : 0);
}
const r = await runCall(
  index,
  {
    scenarioId,
    difficulty: Number(difficulty),
    level: level as Level,
    variant: variant as Variant,
    seed: Number(seed),
  },
  scriptedAdapters,
);
const directives = new Map(r.record.directives.map((d) => [d.turnId, d.directive]));
for (const t of r.record.transcript) {
  if (t.speaker === 'tech') {
    console.log(`TECH      ${t.text}  {${t.behaviors?.join(', ')}}`);
    continue;
  }
  const d = directives.get(t.id);
  const tag = `${t.act}${t.moveId ? `:${t.moveId}` : ''}${d?.decision ? ` decision=${d.decision}` : ''}`;
  console.log(
    `${t.speaker.toUpperCase().padEnd(9)} ${t.text || '(silence)'}  <${tag}; ${d?.why ?? ''}>`,
  );
}
const s = r.record.finalState;
console.log(
  `\ndecision ${r.decision}, score ${r.score}, trust ${Math.round(s.trust)}, understanding ${Math.round(s.understanding)}, ` +
    `asks ${s.decisionAsks}, unneeded [${s.flags.unneededWork.join('; ')}], real concern ${s.realConcern.resolved ? 'resolved' : 'open'}`,
);
console.log(
  `objections: ${s.objections.map((o) => `${o.moveId} ${o.status} ${Math.round(o.strength)}`).join(', ') || 'none'}`,
);
