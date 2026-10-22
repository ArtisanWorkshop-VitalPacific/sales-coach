/**
 * Customer test bench.
 *
 *   pnpm testbench                 scripted customers, every scenario and drill, no keys needed
 *   pnpm testbench -- --claude     Claude perceiver and writer (economy preset), if ANTHROPIC_API_KEY is set
 *   pnpm testbench -- --seeds 8    more seeds per level
 *   pnpm testbench -- --scenario wh-tank-no-hot-water
 *
 * A scripted technician at three levels (novice, solid, expert) plus two probes (upsell, pushy)
 * runs every scenario at difficulty 2 and 4. Each call is checked against the customer's
 * invariants. The report goes to reports/latest-<mode>.md. Exit code 1 on any hard violation.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentIndex } from '@sales-coach/content';
import { checkAggregate, checkRun, pct, runLabel, type Violation } from './checks';
import { renderReport } from './report';
import { type Adapters, type RunResult, type RunSpec, runCall, scriptedAdapters } from './runner';
import type { Level } from './tech';

const DIFFICULTIES = [2, 4];
const LEVELS: Level[] = ['novice', 'solid', 'expert'];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function adaptersFor(useClaude: boolean): Promise<{ adapters: Adapters; mode: 'scripted' | 'claude' }> {
  if (!useClaude) return { adapters: scriptedAdapters, mode: 'scripted' };
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('--claude needs ANTHROPIC_API_KEY. Running scripted customers instead.');
    return { adapters: scriptedAdapters, mode: 'scripted' };
  }
  // Loaded lazily so the scripted bench never touches the SDK.
  const { claudeAdapters } = await import('@sales-coach/engine/claude');
  const claude = claudeAdapters({ preset: 'economy' });
  return { adapters: { perceiver: () => claude.perceiver, writer: () => claude.writer }, mode: 'claude' };
}

async function main() {
  const started = Date.now();
  const useClaude = process.argv.includes('--claude');
  const { adapters, mode } = await adaptersFor(useClaude);
  const seedCount = Number(arg('seeds') ?? (mode === 'claude' ? 1 : 6));
  const seeds = Array.from({ length: seedCount }, (_, i) => 101 + i * 37);
  const only = arg('scenario');
  const index = contentIndex();
  const scenarios = [...index.scenarios.values()].filter((s) => !only || s.id === only);
  const drills = [...index.drills.values()].filter((d) => !only || d.scenarioId === only);

  const specs: RunSpec[] = [];
  for (const s of scenarios) {
    for (const difficulty of DIFFICULTIES) {
      for (const level of LEVELS) for (const seed of seeds) specs.push({ scenarioId: s.id, difficulty, level, variant: 'standard', seed });
      // Probes: fewer seeds, one per unjustified item in rotation.
      const probeSeeds = seeds.slice(0, Math.max(1, Math.ceil(seeds.length / 2)));
      probeSeeds.forEach((seed, i) => {
        if (s.unjustifiedWork.length > 0) {
          specs.push({ scenarioId: s.id, difficulty, level: 'expert', variant: 'upsell', seed, upsellIndex: i });
        }
        specs.push({ scenarioId: s.id, difficulty, level: 'expert', variant: 'pushy', seed });
      });
    }
  }
  for (const d of drills) {
    for (const difficulty of DIFFICULTIES) {
      for (const level of LEVELS) for (const seed of seeds.slice(0, 2)) specs.push({ drillId: d.id, difficulty, level, variant: 'standard', seed });
    }
  }

  const results: RunResult[] = [];
  const violations: Violation[] = [];
  for (const spec of specs) {
    const r = await runCall(index, spec, adapters);
    results.push(r);
    violations.push(...checkRun(r, index));
    if (mode === 'claude') process.stdout.write('.');
  }
  if (mode === 'claude') process.stdout.write('\n');
  violations.push(...checkAggregate(results));

  const report = renderReport({ index, results, violations, mode, seeds, difficulties: DIFFICULTIES, ms: Date.now() - started });
  const here = dirname(fileURLToPath(import.meta.url));
  const out = resolve(here, '..', 'reports', `latest-${mode}.md`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, report);

  // Short console summary.
  const std = results.filter((r) => r.spec.variant === 'standard' && !r.spec.drillId);
  const hard = violations.filter((v) => v.severity === 'hard');
  console.log(`Sales Coach test bench (${mode}): ${results.length} calls, ${scenarios.length} scenario(s), ${drills.length} drill(s)`);
  for (const level of [...LEVELS].reverse()) {
    const rs = std.filter((r) => r.spec.level === level);
    const yes = rs.filter((r) => r.decision === 'yes').length / (rs.length || 1);
    const score = rs.reduce((a, r) => a + r.score, 0) / (rs.length || 1);
    const trust = rs.reduce((a, r) => a + r.finalTrust, 0) / (rs.length || 1);
    console.log(`  ${level.padEnd(7)} yes ${pct(yes).padStart(4)}  score ${score.toFixed(1).padStart(5)}  trust ${trust.toFixed(1).padStart(5)}  (${rs.length} calls)`);
  }
  const rules = new Map<string, number>();
  for (const v of violations) rules.set(`${v.severity} ${v.rule}`, (rules.get(`${v.severity} ${v.rule}`) ?? 0) + 1);
  for (const [k, n] of [...rules.entries()].sort()) console.log(`  ${k}: ${n}`);
  for (const v of hard.slice(0, 5)) console.log(`  ! ${v.rule}${v.run ? ` [${v.run}]` : ''}: ${v.detail.slice(0, 160)}`);
  console.log(hard.length ? `FAIL: ${hard.length} hard violation(s). Report: ${out}` : `PASS. Report: ${out}`);
  if (results.some((r) => r.error)) console.log(`  first error in ${runLabel(results.find((r) => r.error)!)}`);
  process.exitCode = hard.length ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
