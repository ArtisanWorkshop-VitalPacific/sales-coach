import {
  AudioTag,
  BEHAVIORS,
  type BehaviorId,
  type ContentIndex,
  type SessionRecord,
} from '@sales-coach/engine';
import type { RunResult } from './runner';

export interface Violation {
  /** Hard violations fail the bench (exit code 1). Soft ones are reported. */
  severity: 'hard' | 'soft';
  rule: string;
  run?: string;
  detail: string;
}

export const runLabel = (r: RunResult) =>
  `${r.spec.drillId ? `drill:${r.spec.drillId}` : r.spec.scenarioId} d${r.spec.difficulty} ${r.spec.level}` +
  `${r.spec.variant === 'standard' ? '' : `/${r.spec.variant}`} seed ${r.spec.seed}`;

const AI_MENTION_CI =
  /\b(artificial intelligence|simulat(ion|ed|or|ing)|practice (call|session|run)|training (call|session|exercise)|role ?play|chat ?bot|language model|scripted|this is (just )?a (test|drill)|inteligencia artificial|simulaci[oó]n|entrenamiento)\b/i;
const EM_DASH = String.fromCharCode(0x2014);
const AI_WORD = /\b(AI|A\.I\.|IA)\b/;
const PRACTICE = /\bpractic(e|ing)\b/i;

/** Checks that need only one call. */
export function checkRun(r: RunResult, index: ContentIndex): Violation[] {
  const out: Violation[] = [];
  const run = runLabel(r);
  const rec = r.record;
  const v = (severity: Violation['severity'], rule: string, detail: string) =>
    out.push({ severity, rule, run, detail });

  if (r.error) v('hard', 'no-crash', r.error.split('\n').slice(0, 3).join(' | '));

  // 1. State numbers stay in 0..100.
  const inRange = (n: number) => Number.isFinite(n) && n >= 0 && n <= 100;
  for (const p of rec.timeline) {
    for (const [k, n] of [
      ['trust', p.trust],
      ['understanding', p.understanding],
      ['engagement', p.engagement],
    ] as const) {
      if (!inRange(n)) v('hard', 'state-in-range', `turn ${p.turn}: ${k} = ${n}`);
    }
    for (const o of p.objections)
      if (!inRange(o.strength))
        v('hard', 'state-in-range', `turn ${p.turn}: ${o.moveId} strength ${o.strength}`);
  }
  const s = rec.finalState;
  for (const [k, n] of [
    ['trust', s.trust],
    ['understanding', s.understanding],
    ['engagement', s.engagement],
    ['urgency', s.urgency],
  ] as const) {
    if (!inRange(n)) v('hard', 'state-in-range', `final ${k} = ${n}`);
  }
  for (const o of s.objections)
    if (!inRange(o.strength))
      v('hard', 'state-in-range', `final ${o.moveId} strength ${o.strength}`);

  // 2. Forced moves fire once their trigger could have been met.
  for (const id of r.forcedMoves) {
    const fired = rec.moves.some((m) => m.moveId === id);
    if (fired) continue;
    const why = forcedEligible(rec, index, id);
    if (!why) continue;
    // A novice call that collapsed into a flat "no" is reported, but does not fail the bench.
    const collapsed = r.spec.level === 'novice' && rec.decision === 'no';
    v(
      collapsed ? 'soft' : 'hard',
      collapsed ? 'forced-move-fires-collapsed-call' : 'forced-move-fires',
      `${id} never fired, though ${why}`,
    );
  }

  // 3. Persistence without progress never turns into a yes.
  for (const bad of bareAsksAnsweredYes(rec)) v('hard', 'persistence-no-yes', bad);

  // 4. Recommending unneeded work never ends in yes and lowers trust.
  if (r.upsoldItem) {
    const turn = rec.transcript.find(
      (t) => t.speaker === 'tech' && t.behaviors?.includes('recommended_unneeded_work'),
    );
    if (!turn) {
      v(
        'soft',
        'unneeded-work-perceived',
        `"${r.upsoldItem}" was recommended but not perceived as unneeded work`,
      );
    } else {
      const at = turn.endMs ?? turn.atMs;
      const before = [...rec.timeline].reverse().find((p) => p.atMs < at);
      const after = rec.timeline.find((p) => p.atMs >= at);
      if (before && after && !(after.trust < before.trust)) {
        v(
          'hard',
          'unneeded-work-lowers-trust',
          `trust ${before.trust} -> ${after.trust} after "${r.upsoldItem}"`,
        );
      }
      if (rec.decision === 'yes')
        v('hard', 'unneeded-work-no-yes', `customer said yes after "${r.upsoldItem}"`);
    }
  }

  // Perception diagnostics: honest lines read as upselling, monthly numbers not heard.
  for (const t of rec.transcript) {
    if (t.speaker !== 'tech') continue;
    const upsellLine = r.upsoldItem && t.text.toLowerCase().includes(r.upsoldItem.toLowerCase());
    if (
      r.spec.level !== 'novice' &&
      !upsellLine &&
      t.behaviors?.includes('recommended_unneeded_work')
    ) {
      const items = rec.perceptions
        .find((p) => p.turnId === t.id)
        ?.perception.unneededWork.join('; ');
      v(
        'soft',
        'perceiver-false-unneeded-work',
        `"${t.text.slice(0, 110)}" read as unneeded work: ${items}`,
      );
    }
    if (/\$\d{2,3} a month/.test(t.text) && !t.behaviors?.includes('framed_monthly')) {
      v(
        'soft',
        'perceiver-missed-monthly',
        `"${t.text.match(/[^.]*\$\d{2,3} a month[^.]*/)?.[0]?.trim()}" not read as framed_monthly`,
      );
    }
  }

  // 5. Calls end within the turn cap.
  if (!r.ended) v('hard', 'call-ends', `not ended after ${r.techTurns} tech turns`);

  // 6. Customer lines: no em dashes, nothing about AI or practice, only allowed tags.
  for (const t of rec.transcript) {
    if (t.speaker === 'tech') continue;
    if (t.text.includes(EM_DASH)) v('hard', 'no-em-dash', `"${t.text}"`);
    if (AI_MENTION_CI.test(t.text) || AI_WORD.test(t.text) || PRACTICE.test(t.text)) {
      v('hard', 'no-ai-mention', `"${t.text}"`);
    }
    for (const m of t.text.matchAll(/\[([^\]]+)\]/g)) {
      if (!(AudioTag.options as readonly string[]).includes(m[1]!.toLowerCase())) {
        v('soft', 'audio-tags-allowed', `unknown tag [${m[1]}] in "${t.text}" (act ${t.act})`);
      }
    }
    if (!t.text.trim() && t.act !== 'silence')
      v('soft', 'customer-line-not-empty', `empty ${t.act} line`);
  }
  return out;
}

/**
 * Why a forced move could have fired in this call, or null when its trigger never came up.
 * Forced moves skip the random chance, not the trigger, so the trigger has to be met at some
 * point in the call: right phase, trust and the other state conditions.
 */
function forcedEligible(rec: SessionRecord, index: ContentIndex, id: string): string | null {
  const m = index.move(id);
  if (!m) return null;
  const t = m.trigger;
  const w = t.when;
  if (m.delivery.speaker === 'secondary' && !index.personas.get(rec.personaId)?.secondary)
    return null;
  const fs = rec.finalState;
  if (w.secondaryPresent === true && !fs.secondaryPresent) return null;
  if (w.membershipOffered === true && !fs.membershipOffered) return null;
  if (w.financingOffered === true && !fs.financingOffered) return null;
  if (w.minTurn !== undefined && fs.turn < w.minTurn) return null;
  if (
    w.objectionAnswered &&
    fs.objections.find((o) => o.moveId === w.objectionAnswered)?.answeredTurn === undefined
  ) {
    return null;
  }
  const order = [
    'door',
    'discovery',
    'findings',
    'options',
    'price',
    'objections',
    'close',
    'wrapup',
  ];
  const at = (p: string) => order.indexOf(p);
  const points = rec.timeline.filter(
    (p) =>
      (t.phases.length === 0 || t.phases.includes(p.phase)) &&
      (w.trustBelow === undefined || p.trust < w.trustBelow) &&
      (w.trustAbove === undefined || p.trust > w.trustAbove) &&
      (w.engagementBelow === undefined || p.engagement < w.engagementBelow) &&
      (w.understandingBelow === undefined || p.understanding < w.understandingBelow) &&
      (w.priceStated !== true || at(p.phase) >= at('price')) &&
      (w.priceStated !== false || at(p.phase) < at('price')) &&
      (w.optionsPresented !== true || at(p.phase) >= at('options')),
  );
  if (points.length === 0) return null;
  if (w.decisionAsked === true) {
    // Decision-time objections can only come up while the customer is weighing a yes.
    // A call that collapsed straight into "no" never gets there.
    const weighed = rec.directives.some(
      (d) => d.directive.decision === 'yes' || d.directive.decision === 'later',
    );
    if (!weighed) return null;
  }
  if (t.afterBehaviors.length > 0) {
    const hit = rec.transcript.find(
      (x) => x.speaker === 'tech' && x.behaviors?.some((b) => t.afterBehaviors.includes(b)),
    );
    if (!hit) return null;
    return `the tech did ${t.afterBehaviors.join('/')} ("${hit.text.slice(0, 60)}")`;
  }
  const phases = [...new Set(points.map((p) => p.phase))].join(', ');
  return `its trigger was met in ${points.length} state point(s) (${phases})`;
}

const isProgress = (b: BehaviorId) =>
  BEHAVIORS[b]?.polarity === 'positive' && b !== 'asked_for_decision';

/**
 * Walks the call in order. An ask is "bare" when the previous ask got a non-yes and the
 * tech added nothing of value since (no positive behavior, no addressed concern, no held
 * silence). A bare ask must never be answered with yes.
 */
export function bareAsksAnsweredYes(rec: SessionRecord): string[] & { tested?: number } {
  const bad: string[] & { tested?: number } = [];
  bad.tested = 0;
  const perceptionOf = new Map(rec.perceptions.map((p) => [p.turnId, p.perception]));
  const decisionOf = new Map(rec.directives.map((d) => [d.turnId, d.directive.decision]));
  let prevAsk: 'yes' | 'later' | 'no' | null | undefined;
  let progress = false;
  let pendingBare: string | null = null;
  let awaiting = false;
  for (const t of rec.transcript) {
    if (t.speaker === 'tech') {
      const p = perceptionOf.get(t.id);
      const behaviors = (t.behaviors ?? []) as BehaviorId[];
      const valued = behaviors.some(isProgress) || (p?.addressed.length ?? 0) > 0;
      if (behaviors.includes('asked_for_decision')) {
        if (prevAsk !== undefined && prevAsk !== 'yes' && !progress && !valued) {
          pendingBare = t.text;
          bad.tested = (bad.tested ?? 0) + 1;
        } else pendingBare = null;
        awaiting = true;
        progress = false;
      } else if (valued) progress = true;
      continue;
    }
    // A held silence recorded against this customer turn counts as progress.
    if (perceptionOf.get(t.id)?.behaviors.some((b) => isProgress(b.id))) progress = true;
    if (awaiting) {
      const d = decisionOf.get(t.id) ?? null;
      if (pendingBare && d === 'yes')
        bad.push(`bare repeat ask "${pendingBare}" was answered yes: "${t.text}"`);
      prevAsk = d;
      awaiting = false;
      pendingBare = null;
    }
  }
  return bad;
}

export interface GroupStats {
  n: number;
  yes: number;
  later: number;
  no: number;
  none: number;
  meanScore: number;
  meanTrust: number;
  moves: Map<string, number>;
  violations: number;
}

export function stats(results: RunResult[], violationsByRun: Map<string, Violation[]>): GroupStats {
  const n = results.length || 1;
  const moves = new Map<string, number>();
  for (const r of results)
    for (const m of r.record.moves) moves.set(m.moveId, (moves.get(m.moveId) ?? 0) + 1);
  return {
    n: results.length,
    yes: results.filter((r) => r.decision === 'yes').length / n,
    later: results.filter((r) => r.decision === 'later').length / n,
    no: results.filter((r) => r.decision === 'no').length / n,
    none: results.filter((r) => r.decision === null).length / n,
    meanScore: results.reduce((a, r) => a + r.score, 0) / n,
    meanTrust: results.reduce((a, r) => a + r.finalTrust, 0) / n,
    moves,
    violations: results.reduce((a, r) => a + (violationsByRun.get(runLabel(r))?.length ?? 0), 0),
  };
}

/** Checks across calls: the customer rewards skill. */
export function checkAggregate(results: RunResult[]): Violation[] {
  const out: Violation[] = [];
  const std = results.filter((r) => r.spec.variant === 'standard' && !r.spec.drillId);
  const by = (level: string, pred: (r: RunResult) => boolean = () => true) =>
    std.filter((r) => r.spec.level === level && pred(r));
  const yesRate = (rs: RunResult[]) =>
    rs.length ? rs.filter((r) => r.decision === 'yes').length / rs.length : 0;
  const mean = (rs: RunResult[]) =>
    rs.length ? rs.reduce((a, r) => a + r.score, 0) / rs.length : 0;

  const ey = yesRate(by('expert'));
  const ny = yesRate(by('novice'));
  if (!(ey - ny >= 0.3)) {
    out.push({
      severity: 'hard',
      rule: 'expert-closes-more',
      detail: `expert yes ${pct(ey)} vs novice yes ${pct(ny)} overall (needs a gap of 30 points or more)`,
    });
  }
  const groups = new Set(std.map((r) => `${r.spec.scenarioId}|${r.spec.difficulty}`));
  for (const g of groups) {
    const [sid, d] = g.split('|');
    const pred = (r: RunResult) => r.spec.scenarioId === sid && String(r.spec.difficulty) === d;
    const e = by('expert', pred);
    const s = by('solid', pred);
    const n = by('novice', pred);
    if (!(mean(e) > mean(n) + 5)) {
      out.push({
        severity: 'hard',
        rule: 'expert-scores-higher',
        run: `${sid} d${d}`,
        detail: `expert mean ${mean(e).toFixed(1)} vs novice mean ${mean(n).toFixed(1)}`,
      });
    }
    if (!(yesRate(e) > yesRate(n))) {
      out.push({
        severity: 'soft',
        rule: 'expert-closes-more-per-scenario',
        run: `${sid} d${d}`,
        detail: `expert yes ${pct(yesRate(e))} vs novice yes ${pct(yesRate(n))}`,
      });
    }
    if (!(mean(s) <= mean(e) + 2 && mean(s) >= mean(n) - 2)) {
      out.push({
        severity: 'soft',
        rule: 'solid-in-between',
        run: `${sid} d${d}`,
        detail: `solid ${mean(s).toFixed(1)} not between novice ${mean(n).toFixed(1)} and expert ${mean(e).toFixed(1)}`,
      });
    }
  }
  return out;
}

export const pct = (x: number) => `${Math.round(x * 100)}%`;
