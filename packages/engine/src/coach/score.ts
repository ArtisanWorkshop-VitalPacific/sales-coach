import type { ContentIndex } from '../content';
import type { SessionRecord } from '../record';
import { BEHAVIORS, type BehaviorId, PHASE_ORDER, type Phase, type SkillId } from '../schema';
import { clamp } from '../util';
import type { Debrief, Evidence, SkillScore } from './types';

const level = (n: number | null): SkillScore['level'] =>
  n === null ? null : n >= 80 ? 'excellent' : n >= 60 ? 'solid' : 'developing';

const quoteOf = (text: string) => (text.length > 140 ? `${text.slice(0, 137)}...` : text);

/**
 * Deterministic scoring from the rubric: counts behaviors, applies caps, adjusts for
 * move results. The Claude Coach starts from these numbers and the evidence behind them.
 */
export function scoreRecord(record: SessionRecord, index: ContentIndex): Debrief {
  const rubric = index.rubric;
  const scenario = index.scenarios.get(record.scenarioId);
  const passBar = scenario?.passBar ?? rubric.passBar;
  const techTurns = record.transcript.filter((t) => t.speaker === 'tech');
  const counts = new Map<BehaviorId, number>();
  const firstTurn = new Map<BehaviorId, string[]>();
  for (const t of techTurns) {
    for (const b of t.behaviors ?? []) {
      counts.set(b, (counts.get(b) ?? 0) + 1);
      firstTurn.set(b, [...(firstTurn.get(b) ?? []), t.id]);
    }
  }
  const reached = record.timeline.reduce((max, p) => Math.max(max, PHASE_ORDER.indexOf(p.phase)), 0);
  const reachedPhase = (p: Phase) => reached >= PHASE_ORDER.indexOf(p);
  const turnText = new Map(record.transcript.map((t) => [t.id, t.text]));
  const objectionVoiced = record.moves.some((m) => m.kind === 'objection');

  const skills: SkillScore[] = rubric.skills.map((skill) => {
    const required = skill.requiresPhase;
    const observed =
      skill.id === 'objections'
        ? objectionVoiced || reachedPhase('objections')
        : required
          ? reachedPhase(required)
          : techTurns.length > 0;
    if (!observed) {
      return {
        skillId: skill.id,
        name: skill.name,
        score: null,
        level: null,
        evidence: [],
        summary: 'This part of the call did not happen.',
      };
    }
    let score = skill.base;
    const evidence: Evidence[] = [];
    for (const pos of skill.positive) {
      const n = counts.get(pos.behavior) ?? 0;
      if (n === 0) continue;
      score += Math.min(n * pos.points, pos.cap);
      const tid = firstTurn.get(pos.behavior)?.[0];
      if (tid) {
        evidence.push({
          turnId: tid,
          quote: quoteOf(turnText.get(tid) ?? ''),
          note: BEHAVIORS[pos.behavior].label,
          behavior: pos.behavior,
          polarity: 'positive',
        });
      }
    }
    for (const neg of skill.negative) {
      const n = counts.get(neg.behavior) ?? 0;
      if (n === 0) continue;
      score -= n * neg.points;
      for (const tid of (firstTurn.get(neg.behavior) ?? []).slice(0, 2)) {
        evidence.push({
          turnId: tid,
          quote: quoteOf(turnText.get(tid) ?? ''),
          note: BEHAVIORS[neg.behavior].label,
          behavior: neg.behavior,
          polarity: 'negative',
        });
      }
    }
    // Move results for moves that test this skill.
    let adj = 0;
    for (const ev of record.moves) {
      const m = index.move(ev.moveId);
      if (!m || m.skill !== skill.id) continue;
      if (ev.result === 'pass') adj += 6;
      if (ev.result === 'fail') adj -= 8;
    }
    score += Math.max(-20, Math.min(20, adj));
    score = Math.round(clamp(score));
    return {
      skillId: skill.id,
      name: skill.name,
      score,
      level: level(score),
      evidence,
      summary: skill.levels[level(score) ?? 'developing'],
    };
  });

  const scored = skills.filter((s) => s.score !== null);
  const weightOf = (id: SkillId) => rubric.skills.find((s) => s.id === id)?.weight ?? 1;
  const totalW = scored.reduce((s, x) => s + weightOf(x.skillId), 0) || 1;
  const overall = Math.round(scored.reduce((s, x) => s + (x.score ?? 0) * weightOf(x.skillId), 0) / totalW);

  const { win, fix } = pickWinAndFix(record, index, skills);
  const persona = index.personas.get(record.personaId);
  const spoken = spokenDebrief(persona?.shortName ?? 'the customer', win, fix, overall, passBar);
  return {
    sessionId: record.id,
    overall,
    passBar,
    passed: overall >= passBar,
    skills,
    win,
    fix,
    moves: record.moves.map((m) => ({
      moveId: m.moveId,
      name: index.move(m.moveId)?.name ?? m.moveId,
      result: m.result,
      reason: m.reason,
      turnId: m.turnId,
    })),
    spoken,
    managerNote: `Scored ${overall}. Strongest: ${skills.find((s) => s.skillId === win.skillId)?.name}. Work on: ${skills.find((s) => s.skillId === fix.skillId)?.name}.`,
    decision: record.decision,
    scoredBy: 'rubric',
    createdAt: new Date().toISOString(),
  };
}

const WIN_TEXT: Partial<Record<SkillId, string>> = {
  frame: 'You opened well. The customer knew what was going to happen before you touched anything.',
  discovery: 'You asked real questions and listened to the answers.',
  findings: 'You explained what you found in words a homeowner understands.',
  options: 'You gave real choices instead of one take-it-or-leave-it number.',
  price: 'You said the price cleanly and let it land.',
  objections: 'When they pushed back, you stayed calm and went after the real worry.',
  listening: 'You caught a detail they mentioned and used it later. That builds trust fast.',
  close: 'You asked for the decision clearly.',
  'membership-financing': 'You made the money part easier with a clear monthly number.',
  integrity: 'You were honest the whole way. No pressure, nothing they did not need.',
};

function pickWinAndFix(record: SessionRecord, index: ContentIndex, skills: SkillScore[]) {
  const scored = skills.filter((s) => s.score !== null) as (SkillScore & { score: number })[];
  const passedMove = record.moves.find((m) => m.result === 'pass');
  const failedMove = record.moves.find((m) => m.result === 'fail');
  const passedSkill = passedMove ? index.move(passedMove.moveId)?.skill : undefined;
  const failedSkill = failedMove ? index.move(failedMove.moveId)?.skill : undefined;

  const bestSkill =
    (passedSkill && scored.find((s) => s.skillId === passedSkill && s.score >= 60)) ??
    [...scored].sort((a, b) => b.score - a.score)[0];
  const winSkill = bestSkill?.skillId ?? 'integrity';
  const winEvidence = bestSkill?.evidence.find((e) => e.polarity === 'positive');
  const win = {
    skillId: winSkill,
    turnId: winEvidence?.turnId ?? passedMove?.turnId,
    text: WIN_TEXT[winSkill] ?? 'You kept the conversation going.',
  };

  const worst = [...scored].filter((s) => s.skillId !== winSkill).sort((a, b) => a.score - b.score)[0];
  const fixSkill = (failedSkill && failedSkill !== winSkill ? failedSkill : worst?.skillId) ?? 'discovery';
  const failedMoveForSkill = record.moves.find(
    (m) => m.result === 'fail' && index.move(m.moveId)?.skill === fixSkill,
  );
  const move = failedMoveForSkill ? index.move(failedMoveForSkill.moveId) : undefined;
  const rubricSkill = index.rubric.skills.find((s) => s.id === fixSkill);
  const negEvidence = skills.find((s) => s.skillId === fixSkill)?.evidence.find((e) => e.polarity === 'negative');
  const fixTurn = failedMoveForSkill?.turnId ?? negEvidence?.turnId;
  const fix = {
    skillId: fixSkill,
    turnId: fixTurn,
    text: move
      ? `${move.name}. ${move.coaching.why}`
      : `${rubricSkill?.name ?? 'This skill'}: ${rubricSkill?.levels.excellent ?? ''}`,
    modelResponse: move?.coaching.modelResponse,
    tryAgain: tryAgainFor(record, index, fixSkill, fixTurn, move?.id),
  };
  return { win, fix };
}

/** The phase the call was in at a given turn. */
export function phaseAtTurn(record: SessionRecord, turnId?: string): Phase {
  if (!turnId) return 'discovery';
  const at = record.transcript.find((t) => t.id === turnId)?.atMs ?? 0;
  const point = [...record.timeline].reverse().find((p) => p.atMs <= at);
  return point?.phase ?? 'discovery';
}

/** Where "try again" drops the tech: the same moment, with a matching drill if one exists. */
export function tryAgainFor(
  record: SessionRecord,
  index: ContentIndex,
  skillId: SkillId,
  turnId?: string,
  moveId?: string,
) {
  const move = moveId ? index.move(moveId) : undefined;
  const skillName = index.rubric.skills.find((s) => s.id === skillId)?.name ?? 'it';
  const drill =
    [...index.drills.values()].find((d) => move && d.forcedMoves.includes(move.id)) ??
    [...index.drills.values()].find((d) => d.skill === skillId);
  return {
    phase: phaseAtTurn(record, turnId),
    moveId: move?.id,
    drillId: drill?.id,
    prompt: move ? `Run "${move.name}" again.` : `Practice ${skillName.toLowerCase()} again.`,
  };
}

function spokenDebrief(
  customer: string,
  win: { text: string },
  fix: { text: string; modelResponse?: string },
  overall: number,
  passBar: number,
): string {
  const verdict =
    overall >= passBar + 15
      ? 'That was a strong call.'
      : overall >= passBar
        ? 'Good call. You passed.'
        : 'Good effort. Not a pass yet, and that is fine. This is what practice is for.';
  const said = fix.modelResponse?.replace(/\([^)]*\)\s*/g, '').trim();
  const model = said ? ` Here is one way it can sound: ${said}` : '';
  return `${verdict} ${win.text} One thing to work on with ${customer}: ${fix.text}${model} Want to run that moment again?`;
}
