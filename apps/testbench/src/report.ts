import { type ContentIndex, stripTags } from '@sales-coach/engine';
import { type GroupStats, pct, runLabel, stats, type Violation } from './checks';
import type { RunResult } from './runner';

export interface ReportInput {
  index: ContentIndex;
  results: RunResult[];
  violations: Violation[];
  mode: 'scripted' | 'claude';
  seeds: number[];
  difficulties: number[];
  ms: number;
}

const LEVELS = ['expert', 'solid', 'novice'] as const;

function row(label: string[], s: GroupStats): string {
  const moves = [...s.moves.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => `${id} ×${n}`)
    .join(', ');
  return `| ${label.join(' | ')} | ${s.n} | ${pct(s.yes)} | ${pct(s.later)} | ${pct(s.no)} | ${s.meanScore.toFixed(1)} | ${s.meanTrust.toFixed(1)} | ${moves || 'none'} | ${s.violations} |`;
}

export function renderReport(input: ReportInput): string {
  const { index, results, violations, mode } = input;
  const byRun = new Map<string, Violation[]>();
  for (const v of violations) if (v.run) byRun.set(v.run, [...(byRun.get(v.run) ?? []), v]);
  const hard = violations.filter((v) => v.severity === 'hard');
  const soft = violations.filter((v) => v.severity === 'soft');
  const lines: string[] = [];
  const now = new Date().toISOString();

  lines.push(`# Test bench: ${mode} customers`);
  lines.push('');
  lines.push(
    `Content ${index.bundle.version}, ${index.scenarios.size} scenario(s), ${index.drills.size} drill(s). ` +
      `Difficulties ${input.difficulties.join(', ')}, seeds ${input.seeds.join(', ')}. ` +
      `${results.length} calls in ${(input.ms / 1000).toFixed(1)}s. Generated ${now}.`,
  );
  lines.push('');
  lines.push(hard.length === 0 ? '**Result: PASS.** No hard invariant failed.' : `**Result: FAIL.** ${hard.length} hard violation(s).`);
  lines.push('');

  // Headline: experts versus novices across everything.
  const std = results.filter((r) => r.spec.variant === 'standard' && !r.spec.drillId);
  lines.push('## Headline');
  lines.push('');
  lines.push('| Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const level of LEVELS) lines.push(row([level], stats(std.filter((r) => r.spec.level === level), byRun)));
  lines.push('');

  // Per scenario, difficulty, level.
  lines.push('## Scenarios');
  lines.push('');
  lines.push('| Scenario | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const sid of [...new Set(std.map((r) => r.spec.scenarioId!))]) {
    for (const d of input.difficulties) {
      for (const level of LEVELS) {
        const rs = std.filter((r) => r.spec.scenarioId === sid && r.spec.difficulty === d && r.spec.level === level);
        if (rs.length) lines.push(row([sid, String(d), level], stats(rs, byRun)));
      }
    }
  }
  lines.push('');

  // Probes.
  const probes = results.filter((r) => r.spec.variant !== 'standard');
  if (probes.length) {
    lines.push('## Probes');
    lines.push('');
    lines.push('`upsell`: an expert who also recommends one unjustified item. Must lower trust and never end in yes.');
    lines.push('`pushy`: an expert who asks for the decision again and again with nothing new. Must never flip to yes.');
    lines.push('');
    lines.push('| Scenario | Difficulty | Probe | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const sid of [...new Set(probes.map((r) => r.spec.scenarioId!))]) {
      for (const d of input.difficulties) {
        for (const variant of ['upsell', 'pushy'] as const) {
          const rs = probes.filter((r) => r.spec.scenarioId === sid && r.spec.difficulty === d && r.spec.variant === variant);
          if (rs.length) lines.push(row([sid, String(d), variant], stats(rs, byRun)));
        }
      }
    }
    lines.push('');
  }

  // Drills.
  const drills = results.filter((r) => r.spec.drillId);
  if (drills.length) {
    lines.push('## Drills');
    lines.push('');
    lines.push('| Drill | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const did of [...new Set(drills.map((r) => r.spec.drillId!))]) {
      for (const d of input.difficulties) {
        for (const level of LEVELS) {
          const rs = drills.filter((r) => r.spec.drillId === did && r.spec.difficulty === d && r.spec.level === level);
          if (rs.length) lines.push(row([did, String(d), level], stats(rs, byRun)));
        }
      }
    }
    lines.push('');
  }

  // Violations.
  lines.push('## Violations');
  lines.push('');
  if (violations.length === 0) lines.push('None.');
  const grouped = new Map<string, Violation[]>();
  for (const v of violations) grouped.set(`${v.severity}: ${v.rule}`, [...(grouped.get(`${v.severity}: ${v.rule}`) ?? []), v]);
  for (const [key, vs] of [...grouped.entries()].sort()) {
    lines.push(`### ${key} (${vs.length})`);
    lines.push('');
    for (const v of vs.slice(0, 12)) lines.push(`- ${v.run ? `\`${v.run}\` ` : ''}${v.detail}`);
    if (vs.length > 12) lines.push(`- ...and ${vs.length - 12} more`);
    lines.push('');
  }
  lines.push(`Hard: ${hard.length}. Soft: ${soft.length}.`);
  lines.push('');

  // One sample transcript per level for the first scenario, plus the first failing call.
  lines.push('## Sample calls');
  lines.push('');
  const samples: RunResult[] = [];
  for (const level of LEVELS) {
    const r = std.find((x) => x.spec.level === level && x.spec.difficulty === input.difficulties[0]);
    if (r) samples.push(r);
  }
  const failing = results.find((r) => byRun.get(runLabel(r))?.some((v) => v.severity === 'hard'));
  if (failing && !samples.includes(failing)) samples.push(failing);
  for (const r of samples) {
    lines.push(`### ${runLabel(r)}: ${r.decision ?? 'no decision'}, score ${r.score}, trust ${r.finalTrust}`);
    lines.push('');
    for (const t of r.record.transcript) {
      const who = t.speaker === 'tech' ? 'TECH' : t.speaker === 'secondary' ? 'SPOUSE' : 'CUSTOMER';
      const meta =
        t.speaker === 'tech'
          ? t.behaviors?.length
            ? ` _(${t.behaviors.join(', ')})_`
            : ''
          : ` _(${t.act}${t.moveId ? `: ${t.moveId}` : ''}${t.silenceMs ? `, holds ${t.silenceMs}ms` : ''})_`;
      lines.push(`- **${who}:** ${stripTags(t.text) || '(silence)'}${meta}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
