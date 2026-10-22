import { z } from 'zod';
import type { SkillId } from './primitives';

/**
 * Everything the engine can notice a tech doing.
 *
 * Perception (Claude or the scripted heuristic) tags each tech utterance with these ids.
 * Timing behaviors (marked `source: 'timing'`) are measured by the runtime, never by a model.
 * The state engine turns behaviors into hidden-state changes, the Director reacts to them,
 * and the Coach scores them. Add a behavior here first, then everywhere else picks it up.
 */
export const BEHAVIOR_IDS = [
  // Frame
  'set_frame',
  // Discovery
  'asked_open_question',
  'asked_follow_up',
  'reflected_back',
  'acknowledged_feeling',
  // Findings
  'explained_plainly',
  'used_jargon',
  'checked_understanding',
  'showed_evidence',
  // Options
  'presented_options',
  'tied_options_to_needs',
  'single_option_only',
  // Price
  'stated_price',
  'hedged_price',
  'discounted_unprompted',
  'justified_value',
  // Objections
  'addressed_concern',
  'asked_about_concern',
  'new_angle',
  'repeated_same_answer',
  'showed_impatience',
  'argued',
  'caved',
  'corrected_respectfully',
  'condescended',
  // Listening
  'used_customer_detail',
  // Close
  'asked_for_decision',
  'recapped_value',
  'pressured',
  // Membership and financing
  'offered_financing',
  'framed_monthly',
  'offered_membership',
  'explained_membership_value',
  // Integrity
  'recommended_unneeded_work',
  'honest_answer',
  'bluffed',
  // Recovery
  're_engaged',
  'included_second_person',
  'left_well',
  // Timing (runtime-measured)
  'filled_silence',
  'held_silence',
  'interrupted_customer',
  'rambled',
] as const;

export const BehaviorId = z.enum(BEHAVIOR_IDS);
export type BehaviorId = z.infer<typeof BehaviorId>;

export interface BehaviorEffect {
  trust?: number;
  understanding?: number;
  engagement?: number;
  urgency?: number;
  /** Applied to every active objection unless the behavior targets specific concerns. */
  objections?: number;
  /** Applied only to objections in these groups. */
  objectionGroups?: Partial<Record<string, number>>;
}

export interface BehaviorDef {
  id: BehaviorId;
  label: string;
  /** Definition given to the perception model, word for word. Keep it observable. */
  definition: string;
  skill: SkillId;
  polarity: 'positive' | 'negative' | 'neutral';
  source: 'perception' | 'timing';
  effect: BehaviorEffect;
  /** Positive effects shrink with repetition: effect × decay^(count-1). 1 = no decay. */
  decay: number;
}

const def = (d: BehaviorDef) => d;

export const BEHAVIORS: Record<BehaviorId, BehaviorDef> = {
  set_frame: def({
    id: 'set_frame',
    label: 'Set the frame',
    definition:
      'Introduced themselves and told the customer how the visit will go: what they will check, roughly how long, and that they will explain what they find and show options before any work.',
    skill: 'frame',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 5, engagement: 4 },
    decay: 0.3,
  }),
  asked_open_question: def({
    id: 'asked_open_question',
    label: 'Open question',
    definition:
      'Asked an open-ended question about the customer, the home, the history of the problem, how they use the system, or what matters to them. Yes or no questions do not count.',
    skill: 'discovery',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 3, engagement: 3 },
    decay: 0.8,
  }),
  asked_follow_up: def({
    id: 'asked_follow_up',
    label: 'Follow-up question',
    definition: 'Asked a question that builds directly on something the customer just said.',
    skill: 'discovery',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 3, engagement: 2 },
    decay: 0.85,
  }),
  reflected_back: def({
    id: 'reflected_back',
    label: 'Reflected back',
    definition:
      'Summarized or repeated back what the customer said in their own terms, so the customer feels heard.',
    skill: 'discovery',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 4 },
    decay: 0.7,
  }),
  acknowledged_feeling: def({
    id: 'acknowledged_feeling',
    label: 'Acknowledged the feeling',
    definition:
      'Named or acknowledged the customer’s worry, frustration, or embarrassment without arguing or rushing past it.',
    skill: 'discovery',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 4 },
    decay: 0.7,
  }),
  explained_plainly: def({
    id: 'explained_plainly',
    label: 'Explained in plain language',
    definition:
      'Explained a finding, a part, or an option in words a homeowner with no trade knowledge would understand.',
    skill: 'findings',
    polarity: 'positive',
    source: 'perception',
    effect: { understanding: 12, trust: 2 },
    decay: 0.75,
  }),
  used_jargon: def({
    id: 'used_jargon',
    label: 'Unexplained jargon',
    definition:
      'Used a trade term the customer is unlikely to know (for example anode rod, TPR valve, sediment, flue, expansion tank, PRV, BTU) without explaining it.',
    skill: 'findings',
    polarity: 'negative',
    source: 'perception',
    effect: { understanding: -8, trust: -2 },
    decay: 1,
  }),
  checked_understanding: def({
    id: 'checked_understanding',
    label: 'Checked understanding',
    definition:
      'Asked whether the explanation made sense or invited the customer’s questions before moving on.',
    skill: 'findings',
    polarity: 'positive',
    source: 'perception',
    effect: { understanding: 6, trust: 2 },
    decay: 0.6,
  }),
  showed_evidence: def({
    id: 'showed_evidence',
    label: 'Showed the evidence',
    definition:
      'Offered to show or showed the customer what they found: the part, a photo, a video, a reading, the leak.',
    skill: 'findings',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 7, understanding: 6 },
    decay: 0.5,
  }),
  presented_options: def({
    id: 'presented_options',
    label: 'Presented options',
    definition: 'Presented two or more distinct options the customer could choose between.',
    skill: 'options',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 3, understanding: 5 },
    decay: 0.4,
  }),
  tied_options_to_needs: def({
    id: 'tied_options_to_needs',
    label: 'Tied options to their needs',
    definition:
      'Connected an option to something specific the customer said they care about (budget, how long they will stay, household size, worry).',
    skill: 'options',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 6, understanding: 3 },
    decay: 0.7,
  }),
  single_option_only: def({
    id: 'single_option_only',
    label: 'One option only',
    definition: 'Presented a single take-it-or-leave-it recommendation with no alternatives.',
    skill: 'options',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -3 },
    decay: 1,
  }),
  stated_price: def({
    id: 'stated_price',
    label: 'Stated the price',
    definition:
      'Said a specific dollar amount for a repair or option, clearly and without hedging.',
    skill: 'price',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 1 },
    decay: 0.5,
  }),
  hedged_price: def({
    id: 'hedged_price',
    label: 'Hedged the price',
    definition:
      'Apologized for, minimized, or hedged the price (for example "I know it’s a lot, but", "unfortunately it’s going to be"), signaling doubt.',
    skill: 'price',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -4, objectionGroups: { price: 10 } },
    decay: 1,
  }),
  discounted_unprompted: def({
    id: 'discounted_unprompted',
    label: 'Discounted unprompted',
    definition:
      'Lowered the price, offered a discount, or offered to "see what I can do" before the customer asked or before the customer reacted.',
    skill: 'price',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -6, objectionGroups: { price: 8 } },
    decay: 1,
  }),
  justified_value: def({
    id: 'justified_value',
    label: 'Explained the value',
    definition:
      'Explained what the price includes or why it costs what it does (labor, warranty, code requirements, permits, haul-away, guarantee).',
    skill: 'price',
    polarity: 'positive',
    source: 'perception',
    effect: { understanding: 4, objectionGroups: { price: -10 } },
    decay: 0.7,
  }),
  addressed_concern: def({
    id: 'addressed_concern',
    label: 'Addressed the concern',
    definition:
      'Responded directly and specifically to a concern the customer holds. Report which concern ids were addressed and whether fully or partially.',
    skill: 'objections',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 3 },
    decay: 0.9,
  }),
  asked_about_concern: def({
    id: 'asked_about_concern',
    label: 'Asked about the concern',
    definition:
      'Asked a question to understand what is behind an objection or hesitation (for example "What’s your biggest worry about it?") instead of answering right away.',
    skill: 'objections',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 5 },
    decay: 0.8,
  }),
  new_angle: def({
    id: 'new_angle',
    label: 'New angle',
    definition:
      'When the customer raised an objection again, answered it calmly from a different angle instead of repeating the same answer.',
    skill: 'objections',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 3, objections: -12 },
    decay: 0.8,
  }),
  repeated_same_answer: def({
    id: 'repeated_same_answer',
    label: 'Repeated the same answer',
    definition:
      'Answered a repeated objection with the same words or argument, only longer or louder.',
    skill: 'objections',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -3, engagement: -3 },
    decay: 1,
  }),
  showed_impatience: def({
    id: 'showed_impatience',
    label: 'Showed impatience',
    definition:
      'Sounded annoyed, rushed the customer, sighed at them, or said things like "as I said" or "like I told you".',
    skill: 'objections',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -8, engagement: -4 },
    decay: 1,
  }),
  argued: def({
    id: 'argued',
    label: 'Argued',
    definition:
      'Contradicted the customer combatively or tried to win the point instead of understanding it.',
    skill: 'objections',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -10, objections: 10 },
    decay: 1,
  }),
  caved: def({
    id: 'caved',
    label: 'Caved',
    definition:
      'Agreed with something the customer said that is wrong, or dropped a correct recommendation, just to avoid friction.',
    skill: 'integrity',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -6, understanding: -5 },
    decay: 1,
  }),
  corrected_respectfully: def({
    id: 'corrected_respectfully',
    label: 'Corrected respectfully',
    definition:
      'Corrected a customer’s mistaken belief clearly and kindly, without making them feel foolish and without caving.',
    skill: 'objections',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 5, understanding: 8 },
    decay: 0.8,
  }),
  condescended: def({
    id: 'condescended',
    label: 'Condescended',
    definition: 'Talked down to the customer or made them feel stupid for what they said or asked.',
    skill: 'integrity',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -12 },
    decay: 1,
  }),
  used_customer_detail: def({
    id: 'used_customer_detail',
    label: 'Used their detail',
    definition:
      'Brought back a personal detail the customer mentioned earlier (a person, a pet, a plan, a worry) and used it in a recommendation or question. Report which fact ids.',
    skill: 'listening',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 8 },
    decay: 0.8,
  }),
  asked_for_decision: def({
    id: 'asked_for_decision',
    label: 'Asked for the decision',
    definition:
      'Clearly asked the customer to choose or to go ahead (for example "Which option works best for you?" or "Want me to get started?").',
    skill: 'close',
    polarity: 'positive',
    source: 'perception',
    effect: {},
    decay: 1,
  }),
  recapped_value: def({
    id: 'recapped_value',
    label: 'Recapped before asking',
    definition:
      'Briefly summarized what they found, what they recommend, and why, before asking for the decision.',
    skill: 'close',
    polarity: 'positive',
    source: 'perception',
    effect: { understanding: 4, trust: 2 },
    decay: 0.6,
  }),
  pressured: def({
    id: 'pressured',
    label: 'Pressured',
    definition:
      'Used pressure or fear to push a decision: deadlines, "today only" pricing, worst-case scare talk, or repeated asks without new information.',
    skill: 'integrity',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -12, objections: 12 },
    decay: 1,
  }),
  offered_financing: def({
    id: 'offered_financing',
    label: 'Offered financing',
    definition: 'Mentioned that financing or a payment plan is available.',
    skill: 'membership-financing',
    polarity: 'positive',
    source: 'perception',
    effect: { objectionGroups: { financing: -5 } },
    decay: 0.5,
  }),
  framed_monthly: def({
    id: 'framed_monthly',
    label: 'Framed it monthly',
    definition: 'Translated a price into a specific monthly payment.',
    skill: 'membership-financing',
    polarity: 'positive',
    source: 'perception',
    effect: { understanding: 3, objectionGroups: { price: -8, financing: -10 } },
    decay: 0.6,
  }),
  offered_membership: def({
    id: 'offered_membership',
    label: 'Offered the membership',
    definition: 'Offered the company’s maintenance membership or plan.',
    skill: 'membership-financing',
    polarity: 'positive',
    source: 'perception',
    effect: {},
    decay: 0.5,
  }),
  explained_membership_value: def({
    id: 'explained_membership_value',
    label: 'Explained membership value',
    definition:
      'Explained specific membership benefits that matter to this customer, not a generic list.',
    skill: 'membership-financing',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 2, objectionGroups: { membership: -15 } },
    decay: 0.7,
  }),
  recommended_unneeded_work: def({
    id: 'recommended_unneeded_work',
    label: 'Recommended unneeded work',
    definition:
      'Recommended work that the findings do not justify. Compare against the job’s findings and the list of unjustified work.',
    skill: 'integrity',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -25 },
    decay: 1,
  }),
  honest_answer: def({
    id: 'honest_answer',
    label: 'Honest answer',
    definition:
      'Answered a direct question honestly, including saying "I don’t know, I’ll find out" when they did not know.',
    skill: 'integrity',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 8 },
    decay: 0.8,
  }),
  bluffed: def({
    id: 'bluffed',
    label: 'Bluffed',
    definition:
      'Stated something false or made up an answer with confidence (wrong code, wrong efficiency number, invented policy).',
    skill: 'integrity',
    polarity: 'negative',
    source: 'perception',
    effect: { trust: -15 },
    decay: 1,
  }),
  re_engaged: def({
    id: 're_engaged',
    label: 'Re-engaged',
    definition:
      'After an interruption or when the customer drifted, warmly brought them back and recapped where they were.',
    skill: 'listening',
    polarity: 'positive',
    source: 'perception',
    effect: { engagement: 15, trust: 3 },
    decay: 0.8,
  }),
  included_second_person: def({
    id: 'included_second_person',
    label: 'Included the other decision-maker',
    definition:
      'When a second decision-maker joined or was mentioned, recapped for them and invited their questions or input.',
    skill: 'close',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 6, objectionGroups: { timing: -15 } },
    decay: 0.7,
  }),
  left_well: def({
    id: 'left_well',
    label: 'Left well',
    definition:
      'Accepted a no or a not-yet gracefully, left the door open, and set a specific next step.',
    skill: 'close',
    polarity: 'positive',
    source: 'perception',
    effect: { trust: 6 },
    decay: 0.5,
  }),
  filled_silence: def({
    id: 'filled_silence',
    label: 'Filled the silence',
    definition: 'Spoke during a silence the customer was holding to think.',
    skill: 'price',
    polarity: 'negative',
    source: 'timing',
    effect: { trust: -2 },
    decay: 1,
  }),
  held_silence: def({
    id: 'held_silence',
    label: 'Held the silence',
    definition: 'Waited through a deliberate customer silence without speaking.',
    skill: 'price',
    polarity: 'positive',
    source: 'timing',
    effect: { trust: 2, objectionGroups: { price: -5 } },
    decay: 1,
  }),
  interrupted_customer: def({
    id: 'interrupted_customer',
    label: 'Interrupted the customer',
    definition: 'Started talking while the customer was still talking.',
    skill: 'listening',
    polarity: 'negative',
    source: 'timing',
    effect: { trust: -5, engagement: -3 },
    decay: 1,
  }),
  rambled: def({
    id: 'rambled',
    label: 'Rambled',
    definition: 'Talked for a long stretch without checking in with the customer.',
    skill: 'listening',
    polarity: 'negative',
    source: 'timing',
    effect: { engagement: -8, understanding: -3 },
    decay: 1,
  }),
};

export const PERCEPTION_BEHAVIORS = BEHAVIOR_IDS.filter(
  (id) => BEHAVIORS[id].source === 'perception',
);
