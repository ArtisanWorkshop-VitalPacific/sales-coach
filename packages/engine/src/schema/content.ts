import { z } from 'zod';
import { BehaviorId } from './behaviors';
import {
  Act,
  AudioTag,
  Id,
  Percent,
  Phase,
  Review,
  SkillId,
  SoundCue,
  Tone,
  Topic,
  Trade,
} from './primitives';

/* ---------------------------------------------------------------- Personas */

export const RevealWhen = z.strictObject({
  /** Revealed when the tech asks about one of these topics. */
  topics: z.array(Topic).default([]),
  /** Revealed on its own once the call reaches this tech turn. */
  afterTurn: z.number().int().min(1).optional(),
  /** Only revealed once trust reaches this level. */
  minTrust: Percent.optional(),
});
export type RevealWhen = z.infer<typeof RevealWhen>;

export const PersonaFact = z.strictObject({
  id: Id,
  /** How the customer says it, in their voice. */
  text: z.string().min(10),
  revealWhen: RevealWhen,
  /** Why it matters: how a good tech would use it later. Used by perception and the Coach. */
  useValue: z.string().min(10),
});
export type PersonaFact = z.infer<typeof PersonaFact>;

export const PersonaObjection = z.strictObject({
  moveId: Id,
  /** Starting strength, 0 to 100. Above 35 blocks a yes. */
  strength: Percent,
});

export const VoiceSpec = z.strictObject({
  gender: z.enum(['female', 'male']),
  ageRange: z.string(),
  accent: z.string(),
  /** Filled in once a voice is picked in ElevenLabs. Empty means the default voice for the gender. */
  elevenlabsVoiceId: z.string().optional(),
  /** Prompt for ElevenLabs Voice Design. One to three sentences. */
  voiceDesignPrompt: z.string().min(20),
  /** Substrings matched against browser speechSynthesis voice names, in order of preference. */
  browserVoiceHints: z.array(z.string()).default([]),
  /** Browser speech rate, 0.7 to 1.3. */
  rate: z.number().min(0.6).max(1.4).default(1),
  pitch: z.number().min(0.5).max(1.5).default(1),
});
export type VoiceSpec = z.infer<typeof VoiceSpec>;

export const SpeechStyle = z.strictObject({
  pace: z.enum(['slow', 'medium', 'fast']),
  register: z.string().min(5),
  fillers: z.array(z.string()).min(2),
  habits: z.array(z.string()).min(1),
  sampleLines: z.array(z.string()).min(4),
  audioTags: z.array(AudioTag).default([]),
});

export const Persona = z.strictObject({
  id: Id,
  version: z.number().int().min(1),
  name: z.string(),
  shortName: z.string(),
  age: z.number().int().min(18).max(99),
  archetype: z.string(),
  /** Shown to the tech before a session. Never reveals hidden state. */
  card: z.string().min(20),
  /** Full backstory for the model. Hidden from the tech. */
  background: z.string().min(80),
  home: z.strictObject({
    type: z.string(),
    yearBuilt: z.number().int().optional(),
    notes: z.array(z.string()).default([]),
  }),
  household: z.array(z.string()).default([]),
  language: z.enum(['en', 'es']).default('en'),
  speech: SpeechStyle,
  voice: VoiceSpec,
  knowledge: z.enum(['low', 'medium', 'high']),
  values: z.array(z.string()).min(2),
  hidden: z.strictObject({
    realConcern: z.strictObject({
      id: Id,
      description: z.string().min(20),
      /** What they say once they trust the tech enough to admit it. */
      revealLine: z.string().min(10),
      revealAtTrust: Percent,
      /** Plain-language list of what genuinely resolves it. */
      resolvedBy: z.array(z.string()).min(1),
    }),
    /** Most they will pay up front, in dollars. */
    budgetCeiling: z.number().int().min(0),
    /** Most they will pay per month when financing is framed well. */
    monthlyCeiling: z.number().int().min(0).optional(),
    startingTrust: Percent,
    urgency: Percent,
    decisionMaker: z.enum(['self', 'spouse', 'joint', 'landlord', 'other']),
    /** Readiness needed to say yes, before difficulty adjustment. */
    decisionThreshold: Percent.default(55),
    objections: z.array(PersonaObjection).default([]),
    facts: z.array(PersonaFact).default([]),
  }),
  /** Multipliers on behavior effects for this person. 2 means twice as strong. */
  sensitivity: z.partialRecord(BehaviorId, z.number().min(0).max(4)).default({}),
  /** Weights for behavior moves. 0 disables a move for this persona. Missing means 1. */
  movePreferences: z.record(z.string(), z.number().min(0).max(5)).default({}),
  openingLines: z.array(z.string()).min(2),
  /** A second person in the home (spouse, partner, parent) who can enter the call. */
  secondary: z
    .strictObject({
      name: z.string(),
      relation: z.string(),
      stance: z.string().min(10),
      speech: SpeechStyle,
      voice: VoiceSpec,
      enterLines: z.array(z.string()).min(2),
    })
    .optional(),
  review: Review,
});
export type Persona = z.infer<typeof Persona>;

/* ------------------------------------------------------------------- Moves */

export const ObjectionGroup = z.enum([
  'price',
  'timing',
  'trust',
  'competition',
  'scope',
  'financing',
  'membership',
]);
export type ObjectionGroup = z.infer<typeof ObjectionGroup>;

export const BehaviorGroup = z.enum([
  'silence',
  'disruption',
  'confusion',
  'misplaced-confidence',
  'intensity',
  'probe',
]);
export type BehaviorGroup = z.infer<typeof BehaviorGroup>;

export const MoveGroup = z.union([ObjectionGroup, BehaviorGroup]);
export type MoveGroup = z.infer<typeof MoveGroup>;

export const MoveTrigger = z.strictObject({
  /** Phases the move can fire in. Empty means any phase. */
  phases: z.array(Phase).default([]),
  /** Fires right after the tech does one of these. Empty means not reactive. */
  afterBehaviors: z.array(BehaviorId).default([]),
  when: z
    .strictObject({
      trustBelow: Percent.optional(),
      trustAbove: Percent.optional(),
      engagementBelow: Percent.optional(),
      understandingBelow: Percent.optional(),
      priceStated: z.boolean().optional(),
      priceAboveBudget: z.boolean().optional(),
      decisionAsked: z.boolean().optional(),
      optionsPresented: z.boolean().optional(),
      financingOffered: z.boolean().optional(),
      membershipOffered: z.boolean().optional(),
      secondaryPresent: z.boolean().optional(),
      /** Fires only after this objection was voiced and answered (for repeats). */
      objectionAnswered: Id.optional(),
      minTurn: z.number().int().min(0).optional(),
    })
    .default({}),
  /** Chance it fires when eligible, 0 to 1. Forced moves ignore this. */
  chance: z.number().min(0).max(1).default(1),
});
export type MoveTrigger = z.infer<typeof MoveTrigger>;

export const MoveDelivery = z.strictObject({
  act: Act,
  /** Instruction to the voice writer, in plain language. */
  intent: z.string().min(15),
  /** Ways a customer says it. The scripted voice uses these; Claude uses them as style, not script. */
  lines: z.array(z.string()).min(3),
  /** Said if the tech's answer is weak and the customer presses. */
  followUps: z.array(z.string()).default([]),
  tone: Tone,
  /** Pause before the customer speaks, in milliseconds. */
  delayMs: z.number().int().min(0).max(8000).default(600),
  /** For silence moves: how long the customer stays quiet. */
  holdSilenceMs: z.number().int().min(0).max(15000).optional(),
  /** For interrupt moves: cut in once the tech has talked this long. */
  interruptAfterMs: z.number().int().min(1000).max(30000).optional(),
  soundCue: SoundCue.optional(),
  audioTags: z.array(AudioTag).default([]),
  speaker: z.enum(['primary', 'secondary']).default('primary'),
});
export type MoveDelivery = z.infer<typeof MoveDelivery>;

export const MoveEvaluation = z.strictObject({
  /** How many tech turns after the move count toward judging it. */
  windowTurns: z.number().int().min(1).max(4).default(1),
  passIf: z
    .strictObject({
      anyBehaviors: z.array(BehaviorId).default([]),
      allBehaviors: z.array(BehaviorId).default([]),
      addressedConcern: z.boolean().optional(),
      /** The tech stayed quiet at least this long. */
      minSilenceMs: z.number().int().optional(),
    })
    .default({ anyBehaviors: [], allBehaviors: [] }),
  failIf: z
    .strictObject({
      anyBehaviors: z.array(BehaviorId).default([]),
    })
    .default({ anyBehaviors: [] }),
  pass: z.string().min(10),
  fail: z.string().min(10),
});
export type MoveEvaluation = z.infer<typeof MoveEvaluation>;

export const Move = z.strictObject({
  id: Id,
  version: z.number().int().min(1),
  name: z.string(),
  kind: z.enum(['objection', 'behavior']),
  group: MoveGroup,
  skill: SkillId,
  summary: z.string().min(10),
  difficultyMin: z.number().int().min(1).max(5).default(1),
  /** 'any' or a list of persona ids that use this move. */
  personas: z.union([z.literal('any'), z.array(Id)]).default('any'),
  trigger: MoveTrigger,
  /** Higher fires first when several moves are eligible. Reactive moves sit around 80. */
  priority: z.number().int().min(0).max(100).default(50),
  maxUses: z.number().int().min(1).max(3).default(1),
  delivery: MoveDelivery,
  /** Objections only: the concern behind it and what resolves it. */
  resolution: z
    .strictObject({
      /** What the customer is actually worried about when they say this. */
      concern: z.string().min(10),
      resolvedBy: z.array(z.string()).min(1),
      resolvingBehaviors: z.array(BehaviorId).default([]),
      hardenedBy: z.array(BehaviorId).default([]),
      defaultStrength: Percent.default(50),
    })
    .optional(),
  evaluate: MoveEvaluation,
  coaching: z.strictObject({
    why: z.string().min(20),
    /** What a strong tech says. Company-neutral; company scripts can override. */
    modelResponse: z.string().min(20),
    commonMistakes: z.array(z.string()).min(1),
  }),
  tags: z.array(z.string()).default([]),
  review: Review,
});
export type Move = z.infer<typeof Move>;

/* --------------------------------------------------------------- Scenarios */

export const ScenarioOption = z.strictObject({
  id: Id,
  label: z.string(),
  price: z.number().int().min(0),
  monthly: z.number().int().min(0).optional(),
  includes: z.array(z.string()).min(1),
  /** True when this option is the honest recommendation for this home. */
  recommended: z.boolean().default(false),
});
export type ScenarioOption = z.infer<typeof ScenarioOption>;

export const Scenario = z.strictObject({
  id: Id,
  version: z.number().int().min(1),
  title: z.string(),
  trade: Trade,
  jobType: Id,
  difficulty: z.number().int().min(1).max(5),
  personaId: Id,
  alternatePersonas: z.array(Id).default([]),
  /** What the tech knows walking in. Shown on screen. */
  briefing: z.string().min(20),
  /** Hidden context for the models. */
  situation: z.string().min(40),
  equipment: z
    .array(
      z.strictObject({
        item: z.string(),
        ageYears: z.number().int().min(0).optional(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
  findings: z
    .array(
      z.strictObject({
        id: Id,
        text: z.string(),
        severity: z.enum(['info', 'minor', 'major', 'urgent']),
      }),
    )
    .min(1),
  justifiedWork: z.array(z.strictObject({ id: Id, label: z.string(), rationale: z.string() })).min(1),
  unjustifiedWork: z.array(z.strictObject({ id: Id, label: z.string(), why: z.string() })).default([]),
  options: z.array(ScenarioOption).min(1),
  startPhase: Phase.default('door'),
  /** For scenarios that start mid-call: what has already happened. */
  priorContext: z.string().optional(),
  moves: z
    .strictObject({
      allowed: z.union([z.literal('*'), z.array(Id)]).default('*'),
      forced: z.array(Id).default([]),
      excluded: z.array(Id).default([]),
      /** Behavior moves per five minutes. */
      density: z.number().min(0).max(8).default(2),
    })
    .default({ allowed: '*', forced: [], excluded: [], density: 2 }),
  goal: z.string().min(10),
  passBar: Percent.default(70),
  tags: z.array(z.string()).default([]),
  review: Review,
});
export type Scenario = z.infer<typeof Scenario>;

/* ------------------------------------------------------------------ Rubric */

export const RubricSkill = z.strictObject({
  id: SkillId,
  name: z.string(),
  description: z.string().min(20),
  weight: z.number().min(0).max(3),
  /** Starting score before behaviors are counted. Integrity starts high; most start near 40. */
  base: Percent,
  positive: z.array(
    z.strictObject({ behavior: BehaviorId, points: z.number().min(0), cap: z.number().min(0) }),
  ),
  negative: z.array(z.strictObject({ behavior: BehaviorId, points: z.number().min(0) })),
  /** Phase that has to happen for this skill to be scored. */
  requiresPhase: Phase.optional(),
  levels: z.strictObject({
    excellent: z.string(),
    solid: z.string(),
    developing: z.string(),
  }),
});
export type RubricSkill = z.infer<typeof RubricSkill>;

export const Rubric = z.strictObject({
  id: Id,
  version: z.number().int().min(1),
  name: z.string(),
  passBar: Percent,
  skills: z.array(RubricSkill).length(10),
  levels: z
    .array(
      z.strictObject({
        id: z.enum(['apprentice', 'advisor', 'senior-advisor', 'master']),
        name: z.string(),
        requirement: z.string(),
        examDifficulty: z.number().int().min(1).max(5),
        examPassBar: Percent,
      }),
    )
    .length(4),
  review: Review,
});
export type Rubric = z.infer<typeof Rubric>;

/* ------------------------------------------------------------------ Drills */

export const DrillStage = z.enum([
  'door',
  'discovery',
  'findings',
  'options',
  'price',
  'objections',
  'close',
  'recovery',
]);

export const Drill = z.strictObject({
  id: Id,
  version: z.number().int().min(1),
  order: z.number().int().min(1),
  title: z.string(),
  stage: DrillStage,
  skill: SkillId,
  durationSec: z.number().int().min(30).max(600),
  /** A spoken 60-second lesson: why the moment matters. About 130 to 170 words. */
  why: z.string().min(400),
  /** A short exchange that shows it done right. */
  demo: z
    .array(z.strictObject({ speaker: z.enum(['tech', 'customer']), text: z.string() }))
    .min(2),
  scenarioId: Id,
  personaId: Id,
  startPhase: Phase,
  /** What already happened before the drill begins, so the customer can pick up mid-call. */
  priorContext: z.string().min(20),
  forcedMoves: z.array(Id).default([]),
  /** The customer's first line in the drill. Empty means the tech speaks first. */
  customerOpener: z.string().optional(),
  /** Instruction on screen. */
  techPrompt: z.string().min(10),
  passCriteria: z.array(z.string()).min(1),
  review: Review,
});
export type Drill = z.infer<typeof Drill>;

/* --------------------------------------------------------------- Companies */

export const Company = z.strictObject({
  id: Id,
  version: z.number().int().min(1),
  name: z.string(),
  shortName: z.string(),
  trades: z.array(Trade).min(1),
  serviceArea: z.array(z.string()).default([]),
  about: z.string().min(20),
  brandVoice: z.array(z.string()).min(1),
  promises: z.array(z.strictObject({ id: Id, label: z.string(), detail: z.string() })).default([]),
  process: z
    .array(
      z.strictObject({
        id: Id,
        name: z.string(),
        description: z.string(),
        required: z.boolean().default(true),
      }),
    )
    .min(3),
  membership: z
    .strictObject({
      name: z.string(),
      summary: z.string(),
      benefits: z.array(z.string()).default([]),
      monthlyPrice: z.number().int().optional(),
      annualPrice: z.number().int().optional(),
      verified: z.boolean().default(false),
    })
    .optional(),
  financing: z.strictObject({
    available: z.boolean(),
    summary: z.string(),
    verified: z.boolean().default(false),
  }),
  priceRanges: z
    .array(
      z.strictObject({
        id: Id,
        item: z.string(),
        low: z.number().int(),
        high: z.number().int(),
        source: z.string(),
      }),
    )
    .default([]),
  differentiators: z.array(z.string()).default([]),
  scripts: z
    .strictObject({
      preferred: z.array(z.strictObject({ moment: z.string(), line: z.string() })).default([]),
      banned: z.array(z.string()).default([]),
    })
    .default({ preferred: [], banned: [] }),
  /** Company-specific answers to base objections. */
  objectionAnswers: z.array(z.strictObject({ moveId: Id, answer: z.string() })).default([]),
  facts: z.array(z.string()).default([]),
  sources: z.array(z.strictObject({ url: z.string(), retrieved: z.string() })).default([]),
  review: Review,
});
export type Company = z.infer<typeof Company>;

/* ------------------------------------------------------------------ Bundle */

export const ContentBundle = z.strictObject({
  version: z.string(),
  hash: z.string(),
  builtAt: z.string(),
  personas: z.array(Persona),
  moves: z.array(Move),
  scenarios: z.array(Scenario),
  rubric: Rubric,
  drills: z.array(Drill),
  companies: z.array(Company),
});
export type ContentBundle = z.infer<typeof ContentBundle>;

/** Job context pulled from ServiceTitan (or typed by the tech). First name only, by design. */
export const JobContext = z.strictObject({
  source: z.enum(['servicetitan', 'manual', 'demo']),
  jobId: z.string().optional(),
  customerFirstName: z.string().optional(),
  jobType: z.string(),
  scheduledFor: z.string().optional(),
  summary: z.string(),
  equipment: z
    .array(z.strictObject({ item: z.string(), ageYears: z.number().int().optional() }))
    .default([]),
  isMember: z.boolean().default(false),
  priorDeclinedEstimates: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
});
export type JobContext = z.infer<typeof JobContext>;
