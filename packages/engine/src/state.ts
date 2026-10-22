import type { ContentIndex, SessionSpec } from './content';
import { BEHAVIORS, type BehaviorId, PHASE_ORDER, type Phase, type Tone } from './schema';
import { clamp } from './util';

export type Mood =
  | 'warm'
  | 'friendly'
  | 'neutral'
  | 'guarded'
  | 'irritated'
  | 'cold'
  | 'embarrassed';

export interface ObjectionInstance {
  moveId: string;
  group: string;
  strength: number;
  status: 'latent' | 'voiced' | 'answered' | 'resolved';
  voicedTurn?: number;
  answeredTurn?: number;
  /** The tech answered this before the customer raised it. */
  preemptedTurn?: number;
  timesRaised: number;
}

/** Everything the customer knows and feels. Never shown to the tech. Serializable. */
export interface CustomerState {
  phase: Phase;
  trust: number;
  understanding: number;
  engagement: number;
  urgency: number;
  mood: Mood;
  objections: ObjectionInstance[];
  realConcern: { id: string; revealed: boolean; resolved: boolean; progress: number };
  revealedFacts: string[];
  pendingFacts: string[];
  usedFacts: string[];
  priceHeard: number | null;
  monthlyHeard: number | null;
  optionsPresented: number;
  financingOffered: boolean;
  monthlyFramed: boolean;
  membershipOffered: boolean;
  decisionAsks: number;
  lastAskTurn: number;
  progressSinceLastAsk: boolean;
  decision: 'yes' | 'later' | 'no' | null;
  secondaryPresent: boolean;
  secondaryIncluded: boolean;
  flags: { unneededWork: string[]; bluffed: boolean; pressured: boolean; condescended: boolean };
  turn: number;
  behaviorCounts: Partial<Record<BehaviorId, number>>;
  movesUsed: Record<string, number>;
  movesFired: number;
  lastMoveTurn: number;
  ended: boolean;
}

export function initState(spec: SessionSpec, index: ContentIndex): CustomerState {
  const p = spec.persona;
  const diffAdj = (spec.difficulty - 3) * 5;
  let trust = p.hidden.startingTrust - diffAdj;
  if (spec.job?.isMember) trust += 10;
  if (spec.job?.priorDeclinedEstimates.length) trust -= 5;
  const understanding = { low: 15, medium: 30, high: 50 }[p.knowledge];
  const objections: ObjectionInstance[] = [];
  const addObjection = (moveId: string, strength: number) => {
    const move = index.move(moveId);
    if (!move || move.kind !== 'objection') return;
    if (objections.some((o) => o.moveId === moveId)) return;
    objections.push({
      moveId,
      group: move.group,
      strength: clamp(strength + diffAdj),
      status: 'latent',
      timesRaised: 0,
    });
  };
  for (const o of p.hidden.objections) addObjection(o.moveId, o.strength);
  for (const id of spec.forcedMoves) {
    const m = index.move(id);
    if (m?.kind === 'objection') addObjection(id, m.resolution?.defaultStrength ?? 50);
  }
  const state: CustomerState = {
    phase: spec.startPhase,
    trust: clamp(trust),
    understanding,
    engagement: 70,
    urgency: p.hidden.urgency,
    mood: 'neutral',
    objections,
    realConcern: { id: p.hidden.realConcern.id, revealed: false, resolved: false, progress: 0 },
    revealedFacts: [],
    pendingFacts: [],
    usedFacts: [],
    priceHeard: null,
    monthlyHeard: null,
    optionsPresented: 0,
    financingOffered: false,
    monthlyFramed: false,
    membershipOffered: false,
    decisionAsks: 0,
    lastAskTurn: -1,
    progressSinceLastAsk: true,
    decision: null,
    secondaryPresent: false,
    secondaryIncluded: false,
    flags: { unneededWork: [], bluffed: false, pressured: false, condescended: false },
    turn: 0,
    behaviorCounts: {},
    movesUsed: {},
    movesFired: 0,
    lastMoveTurn: -99,
    ended: false,
  };
  // Drills that start mid-call assume a good opening already happened.
  const startIdx = PHASE_ORDER.indexOf(spec.startPhase);
  if (startIdx >= PHASE_ORDER.indexOf('findings')) {
    state.trust = clamp(state.trust + 8);
    state.understanding = clamp(state.understanding + 25);
  }
  if (startIdx >= PHASE_ORDER.indexOf('options')) state.optionsPresented = 2;
  if (startIdx >= PHASE_ORDER.indexOf('price')) {
    const rec = spec.scenario.options.find((o) => o.recommended) ?? spec.scenario.options[0];
    if (startIdx > PHASE_ORDER.indexOf('price')) state.priceHeard = rec?.price ?? null;
  }
  state.mood = moodFor(state);
  return state;
}

export function moodFor(s: CustomerState, recent: BehaviorId[] = []): Mood {
  if (recent.includes('condescended') || recent.includes('argued')) return 'irritated';
  if (recent.includes('pressured') || recent.includes('recommended_unneeded_work')) return 'cold';
  if (s.trust < 25) return 'cold';
  if (s.trust < 42) return 'guarded';
  if (s.trust < 62) return 'neutral';
  if (s.trust < 78) return 'warm';
  return 'friendly';
}

export function toneFor(mood: Mood): Tone {
  switch (mood) {
    case 'warm':
      return 'warm';
    case 'friendly':
      return 'friendly';
    case 'guarded':
      return 'guarded';
    case 'irritated':
      return 'irritated';
    case 'cold':
      return 'cold';
    case 'embarrassed':
      return 'embarrassed';
    default:
      return 'neutral';
  }
}

export const phaseIndex = (p: Phase) => PHASE_ORDER.indexOf(p);
export const advancePhase = (s: CustomerState, to: Phase) => {
  if (phaseIndex(to) > phaseIndex(s.phase)) s.phase = to;
};

/** One tech turn as the engine understands it. */
export interface Perception {
  behaviors: { id: BehaviorId; evidence: string }[];
  /** Concern ids the tech addressed: objection move ids, or 'real' for the hidden concern. */
  addressed: { concernId: string; quality: 'partial' | 'full' }[];
  usedFactIds: string[];
  topics: string[];
  priceStated: number | null;
  monthlyStated: number | null;
  optionsCount: number | null;
  unneededWork: string[];
  askedQuestion: boolean;
  saidGoodbye: boolean;
  summary: string;
}

export const emptyPerception = (): Perception => ({
  behaviors: [],
  addressed: [],
  usedFactIds: [],
  topics: [],
  priceStated: null,
  monthlyStated: null,
  optionsCount: null,
  unneededWork: [],
  askedQuestion: false,
  saidGoodbye: false,
  summary: '',
});

export interface StateDelta {
  trust: number;
  understanding: number;
  engagement: number;
  notes: string[];
}

/**
 * Applies one tech turn to the hidden state. Pure rules, no model calls.
 * This is where "the customer does not cave to persistence" is enforced.
 */
export function applyPerception(
  s: CustomerState,
  perception: Perception,
  spec: SessionSpec,
  index: ContentIndex,
): StateDelta {
  const before = { trust: s.trust, understanding: s.understanding, engagement: s.engagement };
  const notes: string[] = [];
  s.turn += 1;
  const p = spec.persona;
  const ids = new Set(perception.behaviors.map((b) => b.id));

  // Derived behaviors the perceiver may have missed.
  if (perception.usedFactIds.some((f) => s.revealedFacts.includes(f)))
    ids.add('used_customer_detail');
  if (perception.unneededWork.length > 0) ids.add('recommended_unneeded_work');

  // Persistence rule: asking again with nothing new is pressure.
  if (ids.has('asked_for_decision')) {
    if (s.decisionAsks >= 1 && !s.progressSinceLastAsk) {
      ids.add('pressured');
      notes.push('Asked again without addressing anything new: counted as pressure.');
    }
  }

  const resolving = new Set<BehaviorId>();
  for (const id of ids) {
    const def = BEHAVIORS[id];
    const count = (s.behaviorCounts[id] ?? 0) + 1;
    s.behaviorCounts[id] = count;
    const mult = p.sensitivity[id] ?? 1;
    const decay = def.polarity === 'positive' ? def.decay ** (count - 1) : 1;
    const k = mult * decay;
    const e = def.effect;
    if (e.trust) s.trust = clamp(s.trust + e.trust * k);
    if (e.understanding) s.understanding = clamp(s.understanding + e.understanding * k);
    if (e.engagement) s.engagement = clamp(s.engagement + e.engagement * k);
    if (e.urgency) s.urgency = clamp(s.urgency + e.urgency * k);
    for (const o of s.objections) {
      if (o.status === 'resolved') continue;
      let d = 0;
      if (e.objections) d += e.objections;
      const g = e.objectionGroups?.[o.group];
      if (g) d += g;
      const move = index.move(o.moveId);
      if (o.status !== 'latent' && move?.resolution) {
        if (move.resolution.resolvingBehaviors.includes(id)) {
          d -= 12;
          resolving.add(id);
        }
        if (move.resolution.hardenedBy.includes(id)) d += 10;
      }
      if (d) o.strength = clamp(o.strength + d * mult);
    }
    if (def.polarity === 'positive' && id !== 'asked_for_decision') s.progressSinceLastAsk = true;
  }

  // Concerns addressed.
  for (const a of perception.addressed) {
    if (a.concernId === 'real' || a.concernId === s.realConcern.id) {
      s.realConcern.progress += a.quality === 'full' ? 1 : 0.5;
      if (s.realConcern.progress >= 1 && !s.realConcern.resolved) {
        s.realConcern.resolved = true;
        s.trust = clamp(s.trust + 10);
        notes.push('The real concern was resolved.');
        // The stated objections that sat on top of it soften.
        for (const o of s.objections)
          if (o.status !== 'resolved') o.strength = clamp(o.strength - 20);
      } else if (!s.realConcern.resolved) {
        s.trust = clamp(s.trust + 4);
      }
      s.progressSinceLastAsk = true;
      continue;
    }
    const o = s.objections.find((x) => x.moveId === a.concernId);
    if (!o || o.status === 'resolved') continue;
    if (o.status === 'latent') {
      // Answered before she raised it. A full answer settles it. A forced objection (a drill's
      // target, a scenario's must-have) still comes up, as a follow-up to what the tech said.
      o.strength = clamp(o.strength - (a.quality === 'full' ? 45 : 20));
      o.preemptedTurn ??= s.turn;
      if (o.strength <= 20 && !spec.forcedMoves.includes(o.moveId)) o.status = 'resolved';
      s.progressSinceLastAsk = true;
      notes.push(
        `${o.moveId} answered before it came up (${o.status === 'resolved' ? 'settled' : Math.round(o.strength)}).`,
      );
      continue;
    }
    o.strength = clamp(o.strength - (a.quality === 'full' ? 45 : 20));
    o.answeredTurn = s.turn;
    o.status = o.strength <= 20 ? 'resolved' : 'answered';
    s.progressSinceLastAsk = true;
    notes.push(
      `${o.moveId} ${o.status === 'resolved' ? 'resolved' : 'softened'} (${Math.round(o.strength)}).`,
    );
  }
  for (const o of s.objections) {
    if ((o.status === 'voiced' || o.status === 'answered') && o.strength <= 20)
      o.status = 'resolved';
  }

  // Facts.
  for (const f of perception.usedFactIds) {
    if (s.revealedFacts.includes(f) && !s.usedFacts.includes(f)) s.usedFacts.push(f);
  }
  for (const fact of p.hidden.facts) {
    if (s.revealedFacts.includes(fact.id) || s.pendingFacts.includes(fact.id)) continue;
    const rw = fact.revealWhen;
    const topicHit = rw.topics.some((t) => perception.topics.includes(t));
    const turnHit = rw.afterTurn !== undefined && s.turn >= rw.afterTurn;
    const trustOk = rw.minTrust === undefined || s.trust >= rw.minTrust;
    if ((topicHit || turnHit) && trustOk) s.pendingFacts.push(fact.id);
  }

  // Facts about the offer.
  if (perception.priceStated !== null) {
    s.priceHeard = perception.priceStated;
    advancePhase(s, 'price');
  }
  if (perception.monthlyStated !== null) s.monthlyHeard = perception.monthlyStated;
  if (perception.optionsCount !== null && perception.optionsCount >= 2) {
    s.optionsPresented = Math.max(s.optionsPresented, perception.optionsCount);
    advancePhase(s, 'options');
  }
  for (const w of perception.unneededWork)
    if (!s.flags.unneededWork.includes(w)) s.flags.unneededWork.push(w);
  if (ids.has('offered_financing')) s.financingOffered = true;
  if (ids.has('framed_monthly')) {
    s.financingOffered = true;
    s.monthlyFramed = true;
  }
  if (ids.has('offered_membership') || ids.has('explained_membership_value'))
    s.membershipOffered = true;
  if (ids.has('bluffed')) s.flags.bluffed = true;
  if (ids.has('pressured')) s.flags.pressured = true;
  if (ids.has('condescended')) s.flags.condescended = true;
  if (ids.has('included_second_person')) s.secondaryIncluded = true;

  // Phase from behavior.
  if (ids.has('set_frame') || ids.has('asked_open_question')) advancePhase(s, 'discovery');
  if (ids.has('explained_plainly') || ids.has('showed_evidence')) advancePhase(s, 'findings');
  if (ids.has('presented_options')) advancePhase(s, 'options');
  if (ids.has('stated_price')) advancePhase(s, 'price');
  if (ids.has('asked_for_decision')) {
    advancePhase(s, 'close');
    s.decisionAsks += 1;
    s.lastAskTurn = s.turn;
    s.progressSinceLastAsk = false;
  }

  s.mood = moodFor(s, [...ids]);
  // Keep the behavior list in the perception in sync with derived ones.
  for (const id of ids) {
    if (!perception.behaviors.some((b) => b.id === id))
      perception.behaviors.push({ id, evidence: '(derived)' });
  }
  return {
    trust: s.trust - before.trust,
    understanding: s.understanding - before.understanding,
    engagement: s.engagement - before.engagement,
    notes,
  };
}

export interface DecisionResult {
  outcome: 'yes' | 'later' | 'no';
  readiness: number;
  threshold: number;
  blocker?:
    | { kind: 'objection'; objection: ObjectionInstance }
    | { kind: 'budget' }
    | { kind: 'real-concern' };
}

/** What the customer decides when asked. Deterministic and explainable. */
export function evaluateDecision(s: CustomerState, spec: SessionSpec): DecisionResult {
  const p = spec.persona;
  let readiness = 0.5 * s.trust + 0.25 * s.understanding + 0.1 * s.engagement + 0.15 * s.urgency;
  if (!s.realConcern.resolved) readiness -= 12;
  const threshold = p.hidden.decisionThreshold + (spec.difficulty - 3) * 5;

  const open = s.objections
    .filter((o) => o.status !== 'resolved' && o.strength > 35)
    .sort((a, b) => b.strength - a.strength);

  // Budget: a price over the ceiling needs a monthly number they can live with.
  const overBudget = s.priceHeard !== null && s.priceHeard > p.hidden.budgetCeiling;
  const monthlyOk =
    s.monthlyFramed &&
    p.hidden.monthlyCeiling !== undefined &&
    (s.monthlyHeard === null || s.monthlyHeard <= p.hidden.monthlyCeiling);
  const budgetBlock = overBudget && !monthlyOk;

  if (s.trust < 18 || s.decisionAsks >= 4 || s.flags.unneededWork.length > 1) {
    return { outcome: 'no', readiness, threshold };
  }
  // Recommending work the job does not need costs the sale: they want a second opinion.
  if (s.flags.unneededWork.length > 0) {
    const trustObjection = open.find((o) => o.group === 'trust');
    return trustObjection
      ? {
          outcome: 'later',
          readiness,
          threshold,
          blocker: { kind: 'objection', objection: trustObjection },
        }
      : { outcome: 'later', readiness, threshold };
  }
  if (budgetBlock) {
    const money = open.find((o) => o.group === 'price' || o.group === 'financing');
    if (money)
      return {
        outcome: 'later',
        readiness,
        threshold,
        blocker: { kind: 'objection', objection: money },
      };
    return { outcome: 'later', readiness, threshold, blocker: { kind: 'budget' } };
  }
  if (open[0]) {
    return {
      outcome: 'later',
      readiness,
      threshold,
      blocker: { kind: 'objection', objection: open[0] },
    };
  }
  if (
    (p.hidden.decisionMaker === 'joint' || p.hidden.decisionMaker === 'spouse') &&
    !s.secondaryIncluded &&
    readiness < threshold + 15
  ) {
    const stall = s.objections.find((o) => o.group === 'timing' && o.status !== 'resolved');
    if (stall)
      return {
        outcome: 'later',
        readiness,
        threshold,
        blocker: { kind: 'objection', objection: stall },
      };
  }
  if (readiness >= threshold) return { outcome: 'yes', readiness, threshold };
  if (!s.realConcern.resolved)
    return { outcome: 'later', readiness, threshold, blocker: { kind: 'real-concern' } };
  return { outcome: 'later', readiness, threshold };
}
