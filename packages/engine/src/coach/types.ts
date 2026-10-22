import { z } from 'zod';
import { BehaviorId, Phase, SkillId } from '../schema';

export const Evidence = z.object({
  turnId: z.string(),
  quote: z.string(),
  note: z.string(),
  behavior: BehaviorId.optional(),
  polarity: z.enum(['positive', 'negative']),
});
export type Evidence = z.infer<typeof Evidence>;

export const SkillScore = z.object({
  skillId: SkillId,
  name: z.string(),
  score: z.number().nullable(),
  level: z.enum(['excellent', 'solid', 'developing']).nullable(),
  evidence: z.array(Evidence),
  summary: z.string(),
});
export type SkillScore = z.infer<typeof SkillScore>;

export const Debrief = z.object({
  sessionId: z.string(),
  overall: z.number(),
  passBar: z.number(),
  passed: z.boolean(),
  skills: z.array(SkillScore),
  win: z.object({ skillId: SkillId, turnId: z.string().optional(), text: z.string() }),
  fix: z.object({
    skillId: SkillId,
    turnId: z.string().optional(),
    text: z.string(),
    modelResponse: z.string().optional(),
    tryAgain: z
      .object({
        phase: Phase,
        moveId: z.string().optional(),
        drillId: z.string().optional(),
        prompt: z.string(),
      })
      .optional(),
  }),
  moves: z.array(
    z.object({
      moveId: z.string(),
      name: z.string(),
      result: z.enum(['pending', 'pass', 'fail', 'unclear']),
      reason: z.string().optional(),
      turnId: z.string(),
    }),
  ),
  /** About 60 seconds of spoken coaching: a win, one fix, an offer to run it again. */
  spoken: z.string(),
  managerNote: z.string(),
  decision: z.enum(['yes', 'later', 'no']).nullable(),
  scoredBy: z.enum(['rubric', 'claude']),
  model: z.string().optional(),
  createdAt: z.string(),
});
export type Debrief = z.infer<typeof Debrief>;
