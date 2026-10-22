import { z } from 'zod';

/** kebab-case identifier used for every content object. */
export const Id = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are lowercase kebab-case, for example "need-three-bids"');
export type Id = z.infer<typeof Id>;

export const Trade = z.enum(['plumbing', 'hvac', 'electrical']);
export type Trade = z.infer<typeof Trade>;

/** Where a call is. Phases advance from what the tech does, never from a timer. */
export const Phase = z.enum([
  'door',
  'discovery',
  'findings',
  'options',
  'price',
  'objections',
  'close',
  'wrapup',
]);
export type Phase = z.infer<typeof Phase>;
export const PHASE_ORDER: Phase[] = Phase.options;

/** The ten skills on the base rubric. */
export const SkillId = z.enum([
  'frame',
  'discovery',
  'findings',
  'options',
  'price',
  'objections',
  'listening',
  'close',
  'membership-financing',
  'integrity',
]);
export type SkillId = z.infer<typeof SkillId>;

/** How the customer sounds on a given line. The voice writer and TTS both read this. */
export const Tone = z.enum([
  'neutral',
  'warm',
  'friendly',
  'guarded',
  'skeptical',
  'irritated',
  'cold',
  'anxious',
  'embarrassed',
  'distracted',
  'thoughtful',
  'relieved',
  'rushed',
  'angry',
  'confused',
  'confident',
]);
export type Tone = z.infer<typeof Tone>;

/**
 * Inline delivery tags passed through to ElevenLabs v3 Conversational.
 * Keep this list short and verified; anything else is stripped before TTS.
 */
export const AudioTag = z.enum([
  'sighs',
  'laughs',
  'chuckles',
  'hesitates',
  'whispers',
  'clears throat',
  'exhales',
  'frustrated',
  'curious',
  'thoughtful',
  'nervous',
  'annoyed',
  'relieved',
  'skeptical',
  'surprised',
]);
export type AudioTag = z.infer<typeof AudioTag>;

/** Ambient sounds the client mixes on a separate track when the Director cues them. */
export const SoundCue = z.enum([
  'phone-ring',
  'doorbell',
  'dog-bark',
  'tv-background',
  'kids-background',
  'door-close',
  'footsteps',
]);
export type SoundCue = z.infer<typeof SoundCue>;

/** What the customer is doing with a line. */
export const Act = z.enum([
  'open',
  'answer',
  'react',
  'object',
  'reveal',
  'probe',
  'agree',
  'decline',
  'defer',
  'smalltalk',
  'silence',
  'distracted',
  'return',
  'interrupt',
  'end',
]);
export type Act = z.infer<typeof Act>;

/** Topics a tech can ask about. Persona facts are revealed when the tech asks about their topic. */
export const Topic = z.enum([
  'household',
  'usage',
  'history',
  'previous-work',
  'budget',
  'plans',
  'pets',
  'timeline',
  'home',
  'priorities',
  'health',
  'work',
]);
export type Topic = z.infer<typeof Topic>;

export const Review = z.strictObject({
  status: z.enum(['draft', 'reviewed', 'approved']).default('draft'),
  author: z.string().default('Claude'),
  notes: z.array(z.string()).default([]),
});
export type Review = z.infer<typeof Review>;

export const Percent = z.number().int().min(0).max(100);
