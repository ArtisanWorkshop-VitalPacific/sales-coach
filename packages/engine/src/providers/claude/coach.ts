import type Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { passedFor, scoreRecord, tryAgainFor } from '../../coach/score';
import type { Debrief, SkillScore } from '../../coach/types';
import type { ContentIndex } from '../../content';
import type { SessionRecord } from '../../record';
import { SkillId } from '../../schema';
import { clamp, planPrice } from '../../util';
import { COACH_REQUEST, resilient } from './client';
import type { CallConfig } from './config';
import { coachSystem } from './prompts';

// Enum-like fields are plain strings (the API treats enum lists as guidance); values are
// checked in mergeDebrief so one stray value cannot discard the whole review.
const SKILLS = new Set<string>(SkillId.options);
const CoachOut = z.object({
  skills: z.array(
    z.object({
      skillId: z.string().describe(`One of: ${SkillId.options.join(', ')}`),
      score: z.number().nullable(),
      summary: z.string().describe('One or two sentences, second person, specific to this call.'),
      evidence: z.array(
        z.object({
          turnId: z.string(),
          quote: z.string(),
          note: z.string(),
          polarity: z.string().describe('positive or negative'),
        }),
      ),
    }),
  ),
  moves: z.array(
    z.object({
      moveId: z.string(),
      turnId: z.string(),
      result: z.string().describe('pass, fail, or unclear'),
      reason: z.string(),
    }),
  ),
  win: z.object({ skillId: z.string(), turnId: z.string(), text: z.string() }),
  fix: z.object({
    skillId: z.string(),
    turnId: z.string(),
    text: z.string(),
    modelResponse: z.string(),
  }),
  spoken: z.string(),
  managerNote: z.string(),
});
type CoachOut = z.infer<typeof CoachOut>;
const FORMAT = zodOutputFormat(CoachOut);

/** Opus reviews the whole call, starting from the deterministic rubric score. */
export class ClaudeCoach {
  readonly name: string;
  constructor(
    private readonly client: Anthropic,
    private readonly config: CallConfig,
  ) {
    this.name = `claude:${config.model}`;
  }

  async debrief(
    record: SessionRecord,
    index: ContentIndex,
    signal?: AbortSignal,
  ): Promise<Debrief> {
    const base = scoreRecord(record, index);
    const c = this.config;
    const params = {
      model: c.model,
      max_tokens: c.maxTokens,
      ...(c.speed ? { speed: c.speed } : {}),
      ...(c.thinking ? { thinking: c.thinking } : {}),
      system: coachSystem(),
      messages: [{ role: 'user' as const, content: coachUser(record, index, base) }],
      output_config: { ...(c.effort ? { effort: c.effort } : {}), format: FORMAT },
    };
    const message = await resilient(params as unknown as Record<string, unknown>, (p) =>
      this.client.messages.parse(p as unknown as Parameters<Anthropic['messages']['parse']>[0], {
        signal,
        ...COACH_REQUEST,
      }),
    );
    const out = (message as unknown as { parsed_output: CoachOut | null }).parsed_output;
    if (!out) throw new Error(`coach returned no parsed output (stop: ${message.stop_reason})`);
    return mergeDebrief(base, out, record, index, c.model);
  }
}

export function mergeDebrief(
  base: Debrief,
  out: CoachOut,
  record: SessionRecord,
  index: ContentIndex,
  model: string,
): Debrief {
  const turnIds = new Set(record.transcript.map((t) => t.id));
  const validTurn = (id?: string) => (id && turnIds.has(id) ? id : undefined);
  const skills: SkillScore[] = base.skills.map((b) => {
    const o = out.skills.find((s) => s.skillId === b.skillId);
    if (!o) return b;
    const score =
      o.score === null ? (b.score === null ? null : b.score) : Math.round(clamp(o.score));
    const level: SkillScore['level'] =
      score === null ? null : score >= 80 ? 'excellent' : score >= 60 ? 'solid' : 'developing';
    const evidence = o.evidence
      .filter((e) => turnIds.has(e.turnId))
      .map((e) => ({
        turnId: e.turnId,
        quote: e.quote,
        note: e.note,
        polarity: (/neg/i.test(e.polarity) ? 'negative' : 'positive') as 'positive' | 'negative',
      }));
    return {
      ...b,
      score,
      level,
      summary: o.summary || b.summary,
      evidence: evidence.length ? evidence : b.evidence,
    };
  });
  const weightOf = (id: string) => index.rubric.skills.find((s) => s.id === id)?.weight ?? 1;
  const scored = skills.filter((s) => s.score !== null);
  const totalW = scored.reduce((s, x) => s + weightOf(x.skillId), 0) || 1;
  const overall = Math.round(
    scored.reduce((s, x) => s + (x.score ?? 0) * weightOf(x.skillId), 0) / totalW,
  );
  const moves = base.moves.map((m) => {
    const o = out.moves.find(
      (x) => x.moveId === m.moveId && (x.turnId === m.turnId || !validTurn(x.turnId)),
    );
    const result: 'pass' | 'fail' | 'unclear' | null = o
      ? /pass/i.test(o.result)
        ? 'pass'
        : /fail/i.test(o.result)
          ? 'fail'
          : /unclear/i.test(o.result)
            ? 'unclear'
            : null
      : null;
    return o && result ? { ...m, result, reason: o.reason } : m;
  });
  const winSkill = SKILLS.has(out.win.skillId)
    ? (out.win.skillId as Debrief['win']['skillId'])
    : base.win.skillId;
  const fixSkill = SKILLS.has(out.fix.skillId)
    ? (out.fix.skillId as Debrief['fix']['skillId'])
    : base.fix.skillId;
  const fixMove = moves.find(
    (m) => m.result === 'fail' && index.move(m.moveId)?.skill === fixSkill,
  )?.moveId;
  return {
    ...base,
    overall,
    passed: passedFor(record, index, overall, base.passBar, moves),
    skills,
    moves,
    win: {
      skillId: winSkill,
      turnId: validTurn(out.win.turnId),
      text: out.win.text || base.win.text,
    },
    fix: {
      skillId: fixSkill,
      turnId: validTurn(out.fix.turnId),
      text: out.fix.text || base.fix.text,
      modelResponse: out.fix.modelResponse || base.fix.modelResponse,
      tryAgain: tryAgainFor(record, index, fixSkill, validTurn(out.fix.turnId), fixMove),
    },
    spoken: out.spoken.replace(/\s*—\s*/g, ', '),
    managerNote: out.managerNote,
    scoredBy: 'claude',
    model,
    createdAt: new Date().toISOString(),
  };
}

export function coachUser(record: SessionRecord, index: ContentIndex, base: Debrief): string {
  const s = index.scenario(record.scenarioId);
  const p = index.persona(record.personaId);
  const company = record.companyId ? index.company(record.companyId) : undefined;
  const L: string[] = [];
  L.push('JOB', `${s.title}. ${s.briefing}`, `Situation (hidden): ${s.situation}`, 'Findings:');
  for (const f of s.findings) L.push(`- ${f.text} (${f.severity})`);
  L.push('Justified work:');
  for (const w of s.justifiedWork) L.push(`- ${w.label}: ${w.rationale}`);
  if (s.unjustifiedWork.length) {
    L.push('Not justified:');
    for (const w of s.unjustifiedWork) L.push(`- ${w.label}: ${w.why}`);
  }
  L.push('Options:');
  for (const o of s.options) {
    L.push(
      `- ${o.label}: $${o.price}${o.monthly ? ` or about $${o.monthly}/mo` : ''}${o.recommended ? ' (the honest recommendation)' : ''}`,
    );
  }
  L.push('', 'CUSTOMER (hidden profile)', `${p.name}, ${p.age}. ${p.archetype}. ${p.background}`);
  L.push(`Real concern: ${p.hidden.realConcern.description}`);
  L.push(`What resolves it: ${p.hidden.realConcern.resolvedBy.join('; ')}`);
  L.push(
    `Budget ceiling: $${p.hidden.budgetCeiling}${p.hidden.monthlyCeiling ? `, or $${p.hidden.monthlyCeiling}/mo` : ''}. Decision maker: ${p.hidden.decisionMaker}.`,
  );
  if (company) {
    L.push('', `COMPANY: ${company.name}`, 'Their process:');
    for (const step of company.process) L.push(`- ${step.name}: ${step.description}`);
    if (company.memberships.length) {
      L.push(
        'Memberships they sell (lead plan first; judge whether the tech named the right plan and price):',
      );
      for (const m of company.memberships) L.push(`- ${m.name}: ${planPrice(m)}. ${m.summary}`);
    }
    if (company.scripts.banned.length)
      L.push(`Phrases they never use: ${company.scripts.banned.join('; ')}`);
  }
  L.push('', 'RUBRIC');
  for (const k of index.rubric.skills)
    L.push(`- ${k.id} (${k.name}, weight ${k.weight}): ${k.description}`);
  L.push('', 'TRANSCRIPT (turn ids in brackets)');
  for (const t of record.transcript) {
    const who =
      t.speaker === 'tech'
        ? 'TECH'
        : t.speaker === 'secondary'
          ? (p.secondary?.name.split(' ')[0] ?? 'PARTNER').toUpperCase()
          : p.shortName.toUpperCase();
    const secs = Math.round(t.atMs / 1000);
    const extra = t.act === 'silence' ? ` (silent ${Math.round((t.silenceMs ?? 0) / 1000)}s)` : '';
    const tags = t.behaviors?.length ? `  {detected: ${t.behaviors.join(', ')}}` : '';
    L.push(`[${t.id}] ${secs}s ${who}: ${t.text}${extra}${t.speaker === 'tech' ? tags : ''}`);
  }
  if (record.moves.length) {
    L.push('', 'CUSTOMER MOVES THE SIMULATOR RAN');
    for (const m of record.moves) {
      const mv = index.move(m.moveId);
      if (!mv) continue;
      L.push(
        `- ${m.moveId} at [${m.turnId}] (${mv.name}, skill ${mv.skill}). Auto result: ${m.result}${m.reason ? ` (${m.reason})` : ''}.`,
      );
      L.push(`  Pass means: ${mv.evaluate.pass}`, `  Fail means: ${mv.evaluate.fail}`);
    }
  }
  L.push('', 'PRELIMINARY SCORES');
  for (const k of base.skills)
    L.push(`- ${k.skillId}: ${k.score === null ? 'not observed' : k.score}`);
  const st = record.finalState;
  L.push(
    '',
    `OUTCOME: decision ${record.decision ?? 'none'}. Ending trust ${Math.round(st.trust)}, understanding ${Math.round(st.understanding)}. Real concern ${st.realConcern.revealed ? 'revealed' : 'never revealed'}${st.realConcern.resolved ? ' and resolved' : ''}.`,
  );
  L.push(`Difficulty ${record.difficulty} of 5. Pass bar ${base.passBar}.`);
  return L.join('\n');
}
