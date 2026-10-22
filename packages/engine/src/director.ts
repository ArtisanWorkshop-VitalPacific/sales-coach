import type { ContentIndex, SessionSpec } from './content';
import {
  type Act,
  type AudioTag,
  type BehaviorId,
  type Move,
  PHASE_ORDER,
  type Phase,
  type SoundCue,
  type Tone,
} from './schema';
import {
  type CustomerState,
  type DecisionResult,
  evaluateDecision,
  type ObjectionInstance,
  type Perception,
  phaseIndex,
  toneFor,
} from './state';
import type { Rng } from './util';

/** What the customer does next. The voice writer turns this into words. */
export interface TurnDirective {
  speaker: 'primary' | 'secondary';
  act: Act;
  intent: string;
  mustSay: string[];
  mayMention: string[];
  mustNot: string[];
  tone: Tone;
  audioTags: AudioTag[];
  delayMs: number;
  /** Stay silent this long after the line (or instead of it, when the line is empty). */
  holdSilenceMs?: number;
  holdKind?: 'think' | 'away';
  /** Cut into the tech's next utterance once it runs this long. */
  armInterrupt?: { afterMs: number; moveId: string; lines: string[] };
  soundCue?: SoundCue;
  moveId?: string;
  objectionId?: string;
  decision?: 'yes' | 'later' | 'no';
  /** Candidate lines. The scripted writer picks one; Claude uses them as style, not script. */
  scriptedLines: string[];
  /** The line must be spoken exactly as given (drill openers). */
  verbatim?: boolean;
  maxWords: number;
  end?: boolean;
  /** Plain-language reason, kept in the session log for debugging and the Coach. */
  why: string;
}

export interface DirectorContext {
  spec: SessionSpec;
  index: ContentIndex;
  state: CustomerState;
  perception: Perception;
  rng: Rng;
  elapsedMs: number;
  lastCustomerMoveId?: string;
  lastCustomerObjectionId?: string;
}

const NEVER = [
  'Never mention being an AI, a simulation, a script, or training.',
  'Never coach the tech or tell them what they should have said.',
];

const YES_LINES = [
  'Okay. Let’s do it.',
  'All right, that makes sense. Go ahead with that one.',
  'Okay, you’ve made it easy. When can you start?',
  'Yeah, let’s go with that.',
];
const YES_LINES_ES = [
  'Bueno, está bien. Hágalo.',
  'Okay, vamos con esa opción.',
  'Está bien. ¿Cuándo puede empezar?',
];
const NO_LINES = [
  'I don’t think so. Not today, thank you.',
  'I’m going to pass. Thanks for coming out.',
  'No, I think I’m done for today.',
];
const NO_LINES_ES = ['No, gracias. Hoy no.', 'Mejor no. Gracias por venir.'];
const UNNEEDED_LINES = [
  'Wait, why would I need that? Nobody’s ever told me that before.',
  'Hm. I just want what I actually need, okay?',
  'That sounds like extra. Is that really necessary?',
];
const BYE_LINES = ['Okay, thank you.', 'All right. Thanks for coming by.', 'Okay. Take care.'];

const isEs = (spec: SessionSpec) => spec.language === 'es';

export function openingDirective(spec: SessionSpec): TurnDirective | null {
  const p = spec.persona;
  if (spec.drill) {
    if (!spec.drill.customerOpener) return null;
    return {
      ...base(spec, 'react', 'Say the opener exactly as written.'),
      scriptedLines: [spec.drill.customerOpener],
      verbatim: true,
      maxWords: 40,
      why: 'Drill opener',
    };
  }
  if (phaseIndex(spec.startPhase) > 0) return null;
  return {
    ...base(
      spec,
      'open',
      'Open the door, greet the tech, and say in a few words what the problem is.',
    ),
    scriptedLines: p.openingLines,
    tone: p.hidden.startingTrust < 40 ? 'guarded' : 'friendly',
    maxWords: 30,
    why: 'Opening',
  };
}

function base(spec: SessionSpec, act: Act, intent: string): TurnDirective {
  return {
    speaker: 'primary',
    act,
    intent,
    mustSay: [],
    mayMention: [],
    mustNot: [...NEVER],
    tone: 'neutral',
    audioTags: [],
    delayMs: 450,
    scriptedLines: [],
    maxWords: 35,
    why: '',
  };
}

function moveAllowed(m: Move, ctx: DirectorContext, forced: boolean): boolean {
  const { spec, state } = ctx;
  const allowed = spec.scenario.moves.allowed;
  if (!forced) {
    if (allowed !== '*' && !allowed.includes(m.id)) return false;
    if (spec.scenario.moves.excluded.includes(m.id)) return false;
    if (m.difficultyMin > spec.difficulty) return false;
    if (Array.isArray(m.personas) && !m.personas.includes(spec.persona.id)) return false;
    const weight = spec.persona.movePreferences[m.id];
    if (weight === 0) return false;
  }
  if ((state.movesUsed[m.id] ?? 0) >= m.maxUses) return false;
  if (m.delivery.speaker === 'secondary' && !spec.persona.secondary) return false;
  return true;
}

function triggerMet(
  m: Move,
  ctx: DirectorContext,
  turnBehaviors: Set<BehaviorId>,
  forced = false,
): boolean {
  const { state, spec } = ctx;
  const t = m.trigger;
  if (t.phases.length > 0 && !t.phases.includes(state.phase)) {
    // A forced move whose moment passed while something else was happening stays due until
    // the call wraps up, so scenario and drill authors can count on it firing.
    const earliest = Math.min(...t.phases.map((ph) => PHASE_ORDER.indexOf(ph)));
    const late = forced && PHASE_ORDER.indexOf(state.phase) > earliest && state.phase !== 'wrapup';
    if (!late) return false;
  }
  if (t.afterBehaviors.length > 0 && !t.afterBehaviors.some((b) => turnBehaviors.has(b)))
    return false;
  const w = t.when;
  // Mood conditions describe when a move usually comes up. A forced move comes up anyway.
  if (!forced) {
    if (w.trustBelow !== undefined && !(state.trust < w.trustBelow)) return false;
    if (w.trustAbove !== undefined && !(state.trust > w.trustAbove)) return false;
    if (w.engagementBelow !== undefined && !(state.engagement < w.engagementBelow)) return false;
    if (w.understandingBelow !== undefined && !(state.understanding < w.understandingBelow))
      return false;
  }
  if (w.priceStated !== undefined && w.priceStated !== (state.priceHeard !== null)) return false;
  if (w.priceAboveBudget !== undefined) {
    const above = state.priceHeard !== null && state.priceHeard > spec.persona.hidden.budgetCeiling;
    if (w.priceAboveBudget !== above) return false;
  }
  if (w.decisionAsked !== undefined && w.decisionAsked !== state.decisionAsks > 0) return false;
  if (w.optionsPresented !== undefined && w.optionsPresented !== state.optionsPresented >= 2)
    return false;
  if (w.financingOffered !== undefined && w.financingOffered !== state.financingOffered)
    return false;
  if (w.membershipOffered !== undefined && w.membershipOffered !== state.membershipOffered)
    return false;
  if (w.secondaryPresent !== undefined && w.secondaryPresent !== state.secondaryPresent)
    return false;
  if (w.objectionAnswered) {
    const o = state.objections.find((x) => x.moveId === w.objectionAnswered);
    if (!o || o.answeredTurn === undefined) return false;
  }
  if (w.minTurn !== undefined && state.turn < w.minTurn) return false;
  return true;
}

function fromMove(spec: SessionSpec, m: Move, why: string): TurnDirective {
  const d = m.delivery;
  return {
    ...base(spec, d.act, d.intent),
    speaker: d.speaker,
    tone: d.tone,
    audioTags: d.audioTags,
    delayMs: d.delayMs,
    holdSilenceMs: d.holdSilenceMs,
    holdKind: d.holdSilenceMs ? (d.act === 'distracted' ? 'away' : 'think') : undefined,
    soundCue: d.soundCue,
    moveId: m.id,
    scriptedLines: d.act === 'silence' ? [] : d.lines,
    maxWords: d.act === 'silence' ? 0 : 30,
    why,
  };
}

function voiceObjection(
  ctx: DirectorContext,
  o: ObjectionInstance,
  why: string,
): TurnDirective | null {
  const m = ctx.index.move(o.moveId);
  if (!m) return null;
  const pressing = o.status !== 'latent';
  o.status = 'voiced';
  o.timesRaised += 1;
  o.voicedTurn = o.voicedTurn ?? ctx.state.turn;
  ctx.state.movesUsed[m.id] = (ctx.state.movesUsed[m.id] ?? 0) + 1;
  ctx.state.lastMoveTurn = ctx.state.turn;
  ctx.state.movesFired += 1;
  if (
    phaseIndex(ctx.state.phase) < phaseIndex('objections') &&
    phaseIndex(ctx.state.phase) >= phaseIndex('price')
  ) {
    ctx.state.phase = 'objections';
  }
  const d = fromMove(ctx.spec, m, why);
  if (pressing && m.delivery.followUps.length > 0) {
    d.intent = `You raised this already and the answer did not settle it. Press on it again in different words. ${m.delivery.intent}`;
    d.scriptedLines = m.delivery.followUps;
  }
  d.objectionId = o.moveId;
  d.mustNot.push('Do not agree to buy in this line.');
  if (!ctx.state.realConcern.revealed) d.mustNot.push('Do not reveal your deeper worry yet.');
  return d;
}

function revealDirective(ctx: DirectorContext): TurnDirective {
  const rc = ctx.spec.persona.hidden.realConcern;
  ctx.state.realConcern.revealed = true;
  return {
    ...base(
      ctx.spec,
      'reveal',
      'You trust this tech enough now to say what is really worrying you. Say it simply and honestly.',
    ),
    mustSay: [rc.description],
    scriptedLines: [rc.revealLine],
    tone: 'thoughtful',
    audioTags: ['hesitates'],
    delayMs: 900,
    maxWords: 50,
    why: 'Trust crossed the reveal threshold after a good question',
  };
}

function decisionDirective(ctx: DirectorContext, result: DecisionResult): TurnDirective | null {
  const { spec, state } = ctx;
  if (result.outcome === 'yes') {
    state.decision = 'yes';
    state.phase = 'wrapup';
    const rec = spec.scenario.options.find((o) => o.recommended);
    return {
      ...base(
        spec,
        'agree',
        `Agree to go ahead${rec ? `, most likely with "${rec.label}" unless the tech recommended another option` : ''}. Sound settled, not thrilled. Ask one practical next-step question.`,
      ),
      decision: 'yes',
      tone: 'relieved',
      scriptedLines: isEs(spec) ? YES_LINES_ES : YES_LINES,
      maxWords: 30,
      why: `Decision yes: readiness ${Math.round(result.readiness)} vs threshold ${result.threshold}`,
    };
  }
  if (result.outcome === 'no') {
    state.decision = 'no';
    return {
      ...base(spec, 'decline', 'Politely but firmly decline for today. Do not explain at length.'),
      decision: 'no',
      tone: state.trust < 30 ? 'cold' : 'guarded',
      scriptedLines: isEs(spec) ? NO_LINES_ES : NO_LINES,
      maxWords: 25,
      why: `Decision no: trust ${Math.round(state.trust)}, asks ${state.decisionAsks}`,
    };
  }
  state.decision = 'later';
  const b = result.blocker;
  if (b?.kind === 'objection') {
    const d = voiceObjection(
      ctx,
      b.objection,
      `Decision later: ${b.objection.moveId} is still at ${Math.round(b.objection.strength)}`,
    );
    if (d) {
      d.decision = 'later';
      return d;
    }
  }
  if (
    b?.kind === 'real-concern' &&
    state.trust >= spec.persona.hidden.realConcern.revealAtTrust &&
    !state.realConcern.revealed
  ) {
    const d = revealDirective(ctx);
    d.decision = 'later';
    return d;
  }
  return {
    ...base(
      spec,
      'defer',
      b?.kind === 'budget'
        ? 'Say it is more than you can do right now. Do not explain your finances in detail.'
        : 'Say you are not ready to decide yet, without explaining exactly why.',
    ),
    decision: 'later',
    tone: toneFor(state.mood),
    scriptedLines: isEs(spec)
      ? ['No sé. Déjeme pensarlo un poquito.', 'Es más de lo que esperaba.']
      : [
          'I don’t know. That’s more than I can do right now.',
          'I’m just not ready to decide yet.',
          'Let me think about it.',
        ],
    maxWords: 25,
    why: `Decision later: readiness ${Math.round(result.readiness)} vs ${result.threshold}`,
  };
}

/** Answer or react naturally when nothing special is happening. */
function naturalDirective(ctx: DirectorContext): TurnDirective {
  const { spec, state, perception } = ctx;
  const p = spec.persona;
  let intent: string;
  if (perception.askedQuestion) {
    intent =
      'Answer the tech’s question honestly from your situation and what you know. Keep it short and natural.';
  } else {
    switch (state.phase) {
      case 'door':
        intent = 'Respond to their introduction and show them where the problem is.';
        break;
      case 'discovery':
        intent =
          'Respond naturally to what they said. Share what you have noticed about the problem.';
        break;
      case 'findings':
        intent =
          state.understanding < 40
            ? 'You do not fully follow. Ask what that means in plain words.'
            : 'React to what they found. Ask what happens next or what your choices are.';
        break;
      case 'options':
        intent = 'React to the options. Ask about the one that seems to fit you.';
        break;
      case 'price':
        intent =
          state.priceHeard !== null && state.priceHeard > p.hidden.budgetCeiling
            ? 'React honestly to the price. It is more than you were hoping to spend.'
            : 'React to the price. Ask a question about what is included.';
        break;
      case 'objections':
        intent =
          'Respond to their answer. If it settled your concern, say so plainly. If not, say what still bothers you.';
        break;
      case 'close':
        intent = 'Respond to where things stand. Do not commit unless you have decided.';
        break;
      default:
        intent = 'Respond naturally and wrap up the conversation.';
    }
  }
  const d = base(spec, perception.askedQuestion ? 'answer' : 'react', intent);
  d.tone = toneFor(state.mood);
  d.why = perception.askedQuestion ? 'Answering a question' : `Reacting in ${state.phase}`;
  if (state.decision !== 'yes') d.mustNot.push('Do not agree to buy anything in this line.');
  if (!state.realConcern.revealed) d.mustNot.push('Do not reveal your deeper worry yet.');
  d.scriptedLines = [];
  return d;
}

function attachFact(ctx: DirectorContext, d: TurnDirective) {
  if (d.act === 'silence' || d.act === 'object' || d.verbatim) return;
  const id = ctx.state.pendingFacts.shift();
  if (!id) return;
  const fact = ctx.spec.persona.hidden.facts.find((f) => f.id === id);
  if (!fact) return;
  ctx.state.revealedFacts.push(id);
  d.mayMention.push(fact.text);
  d.maxWords = Math.max(d.maxWords, 45);
}

/**
 * Decides the customer's next action after a tech turn.
 * Order matters: safety and integrity reactions, decisions, reactive moves,
 * objections, reveals, ambient moves, then a natural response.
 */
export function decideNext(ctx: DirectorContext): TurnDirective {
  const { spec, state, perception, index, rng } = ctx;
  const behaviors = new Set(perception.behaviors.map((b) => b.id));

  if (
    perception.saidGoodbye ||
    (state.decision === 'yes' && state.turn > 0 && behaviors.has('left_well'))
  ) {
    state.ended = true;
    return {
      ...base(spec, 'end', 'Say a short, natural goodbye that fits how the visit went.'),
      tone: toneFor(state.mood),
      scriptedLines: isEs(spec) ? ['Gracias. Que le vaya bien.', 'Okay, gracias.'] : BYE_LINES,
      maxWords: 20,
      end: true,
      why: 'Tech ended the visit',
    };
  }

  // 1. Unneeded work gets an immediate, specific pushback.
  if (perception.unneededWork.length > 0) {
    const reactive = pickReactive(ctx, behaviors);
    const d =
      reactive && reactive.trigger.afterBehaviors.includes('recommended_unneeded_work')
        ? fireMove(ctx, reactive, 'Reactive to unneeded work')
        : {
            ...base(
              spec,
              'react',
              `Push back on this: ${perception.unneededWork.join(', ')}. You do not see why you would need it, and it makes you wonder about the rest of the quote.`,
            ),
            tone: 'skeptical' as Tone,
            scriptedLines: isEs(spec)
              ? ['¿Y eso para qué? Nadie me había dicho eso.']
              : UNNEEDED_LINES,
            why: 'Tech recommended work the findings do not justify',
          };
    d.mustNot.push('Do not agree to the extra work.');
    return d;
  }

  // 2. The tech asked for the decision. A forced objection still waiting comes out first.
  if (behaviors.has('asked_for_decision') && state.decision !== 'yes') {
    const waiting = state.objections.find(
      (o) =>
        o.status === 'latent' &&
        spec.forcedMoves.includes(o.moveId) &&
        index.move(o.moveId)?.trigger.when.decisionAsked !== false,
    );
    if (waiting) {
      const d = voiceObjection(ctx, waiting, 'Forced objection before the decision');
      if (d) {
        d.intent = `You are not ready to say yes yet. ${d.intent}`;
        return d;
      }
    }
    const d = decisionDirective(ctx, evaluateDecision(state, spec));
    if (d) return d;
  }

  // 3. Reactive moves (silence after price, goes cold after pressure, catches a bluff).
  const reactive = pickReactive(ctx, behaviors);
  if (reactive) return fireMove(ctx, reactive, `Reactive: ${reactive.id}`);

  // 4. The last objection got a weak answer: press once.
  if (ctx.lastCustomerObjectionId) {
    const o = state.objections.find((x) => x.moveId === ctx.lastCustomerObjectionId);
    const addressed = perception.addressed.some((a) => a.concernId === ctx.lastCustomerObjectionId);
    if (
      o &&
      !addressed &&
      o.status === 'voiced' &&
      o.timesRaised < 2 &&
      o.strength > 45 &&
      !perception.askedQuestion
    ) {
      const d = voiceObjection(ctx, o, `Pressing ${o.moveId}: the answer did not address it`);
      if (d) return d;
    }
  }

  // 5. Reveal the real concern when trust is high and the tech asked about it.
  const rc = spec.persona.hidden.realConcern;
  if (
    !state.realConcern.revealed &&
    state.trust >= rc.revealAtTrust &&
    (behaviors.has('asked_about_concern') ||
      (behaviors.has('asked_open_question') && state.objections.some((o) => o.status !== 'latent')))
  ) {
    return revealDirective(ctx);
  }

  // 6. Latent objections whose moment has come (price, financing, membership, scope).
  const due = state.objections
    .filter((o) => o.status === 'latent')
    .map((o) => ({ o, m: index.move(o.moveId) }))
    .filter((x): x is { o: ObjectionInstance; m: Move } => !!x.m)
    .filter((x) => x.m.trigger.when.decisionAsked !== true)
    .filter((x) => triggerMet(x.m, ctx, behaviors, spec.forcedMoves.includes(x.m.id)))
    .sort(
      (a, b) =>
        Number(spec.forcedMoves.includes(b.m.id)) - Number(spec.forcedMoves.includes(a.m.id)) ||
        b.o.strength - a.o.strength,
    );
  for (const { o, m } of due) {
    const forced = spec.forcedMoves.includes(m.id);
    if (forced || rng.chance(m.trigger.chance)) {
      const d = voiceObjection(ctx, o, `Objection due in ${state.phase}`);
      if (d) {
        if (perception.askedQuestion)
          d.intent = `First answer their question in one short sentence. Then: ${d.intent}`;
        return d;
      }
    }
  }

  // 7. Forced behavior moves for drills fire as soon as their trigger is met.
  for (const id of spec.forcedMoves) {
    const m = index.move(id);
    if (!m || m.kind !== 'behavior' || !moveAllowed(m, ctx, true)) continue;
    if (m.trigger.afterBehaviors.length > 0) continue; // handled as reactive
    if (triggerMet(m, ctx, behaviors, true) && m.delivery.act !== 'interrupt')
      return fireMove(ctx, m, `Forced: ${m.id}`);
  }

  // 8. Natural response, possibly carrying an ambient move or an armed interrupt.
  const d = naturalDirective(ctx);
  const ambient = pickAmbient(ctx, behaviors);
  if (ambient) {
    if (ambient.delivery.act === 'interrupt' && ambient.delivery.interruptAfterMs) {
      // Armed, not used: it only counts once the tech talks long enough for it to fire.
      d.armInterrupt = {
        afterMs: ambient.delivery.interruptAfterMs,
        moveId: ambient.id,
        lines: ambient.delivery.lines,
      };
      d.why += `; armed ${ambient.id}`;
    } else {
      const md = fireMove(ctx, ambient, `Ambient: ${ambient.id}`);
      if (perception.askedQuestion && md.act !== 'silence' && md.holdKind !== 'away') {
        md.intent = `Answer their question briefly, then: ${md.intent}`;
      }
      attachFact(ctx, md);
      return md;
    }
  }
  attachFact(ctx, d);
  return d;
}

function markUsed(ctx: DirectorContext, m: Move) {
  ctx.state.movesUsed[m.id] = (ctx.state.movesUsed[m.id] ?? 0) + 1;
  ctx.state.lastMoveTurn = ctx.state.turn;
  ctx.state.movesFired += 1;
}

function fireMove(ctx: DirectorContext, m: Move, why: string): TurnDirective {
  markUsed(ctx, m);
  const d = fromMove(ctx.spec, m, why);
  if (m.id === 'spouse-walks-in' || m.delivery.speaker === 'secondary') {
    ctx.state.secondaryPresent = true;
    d.speaker = 'secondary';
    const sec = ctx.spec.persona.secondary;
    if (sec && d.scriptedLines.length === 0) d.scriptedLines = sec.enterLines;
  }
  if (m.id === 'repeats-answered-objection') {
    const answered = ctx.state.objections
      .filter((o) => o.answeredTurn !== undefined)
      .sort((a, b) => (b.answeredTurn ?? 0) - (a.answeredTurn ?? 0))[0];
    const om = answered ? ctx.index.move(answered.moveId) : undefined;
    if (om) {
      d.intent = `Bring this up again as if it still bothers you, in slightly different words: "${om.name}". The worry behind it: ${om.resolution?.concern ?? om.summary}`;
      d.scriptedLines = om.delivery.followUps.length ? om.delivery.followUps : om.delivery.lines;
      d.objectionId = om.id;
    }
  }
  if (m.id === 'quiet-money-worry') ctx.state.mood = 'embarrassed';
  if (m.kind === 'objection') {
    const o = ctx.state.objections.find((x) => x.moveId === m.id);
    if (o) {
      o.status = 'voiced';
      o.timesRaised += 1;
    }
  }
  return d;
}

function weightFor(ctx: DirectorContext, m: Move): number {
  return ctx.spec.persona.movePreferences[m.id] ?? 1;
}

function pickReactive(ctx: DirectorContext, behaviors: Set<BehaviorId>): Move | undefined {
  const { index, spec, rng } = ctx;
  const candidates = index
    .behaviorMoves()
    .filter((m) => m.trigger.afterBehaviors.length > 0)
    .filter((m) => {
      const forced = spec.forcedMoves.includes(m.id);
      return moveAllowed(m, ctx, forced) && triggerMet(m, ctx, behaviors, forced);
    })
    .sort((a, b) => b.priority - a.priority);
  for (const m of candidates) {
    const forced = spec.forcedMoves.includes(m.id);
    const chance = Math.min(1, m.trigger.chance * Math.max(0.5, weightFor(ctx, m)));
    if (forced || rng.chance(chance)) return m;
  }
  return undefined;
}

function pickAmbient(ctx: DirectorContext, behaviors: Set<BehaviorId>): Move | undefined {
  const { index, spec, state, rng, elapsedMs } = ctx;
  if (state.turn < 2) return undefined;
  if (state.turn - state.lastMoveTurn < 2) return undefined;
  const minutes = elapsedMs / 60000;
  const budget = 1 + (spec.scenario.moves.density * minutes) / 5;
  if (state.movesFired >= budget) return undefined;
  const pool = index
    .behaviorMoves()
    .filter((m) => m.trigger.afterBehaviors.length === 0)
    .filter((m) => moveAllowed(m, ctx, spec.forcedMoves.includes(m.id)))
    .filter((m) => triggerMet(m, ctx, behaviors));
  const chosen = rng.weighted(
    pool.map((m) => ({ item: m, weight: weightFor(ctx, m) * (m.priority / 50) })),
  );
  if (!chosen) return undefined;
  const forced = spec.forcedMoves.includes(chosen.id);
  return forced || rng.chance(chosen.trigger.chance) ? chosen : undefined;
}

/** After a held silence ends without the tech speaking (or a step-away ends). */
export function afterHoldDirective(
  ctx: DirectorContext,
  moveId: string | undefined,
  kind: 'think' | 'away',
): TurnDirective {
  const m = moveId ? ctx.index.move(moveId) : undefined;
  const spec = ctx.spec;
  if (kind === 'away') {
    return {
      ...base(
        spec,
        'return',
        'You are back after stepping away. Apologize briefly and ask where you were.',
      ),
      tone: 'distracted',
      scriptedLines: m?.delivery.followUps.length
        ? m.delivery.followUps.slice(0, 1)
        : isEs(spec)
          ? ['Perdón. ¿En qué estábamos?']
          : ['Sorry about that. Where were we?'],
      moveId,
      delayMs: 0,
      maxWords: 20,
      why: 'Returned from stepping away',
    };
  }
  const lines = m?.delivery.lines ?? [];
  return {
    ...base(
      spec,
      'react',
      m?.delivery.act === 'silence'
        ? 'The silence is over. React honestly, in one short sentence, to what was just said, from your own situation.'
        : 'You finished your thought. Say where you landed, briefly.',
    ),
    tone: m?.delivery.tone ?? toneFor(ctx.state.mood),
    audioTags: m?.delivery.audioTags ?? [],
    scriptedLines: lines.length ? lines : ['Hm. Okay.'],
    moveId,
    delayMs: 0,
    maxWords: 25,
    why: 'Silence held to the end',
  };
}

/** The customer cuts in on a long tech turn. */
export function interruptDirective(
  spec: SessionSpec,
  armed: NonNullable<TurnDirective['armInterrupt']>,
): TurnDirective {
  return {
    ...base(spec, 'interrupt', 'Cut in on the tech mid-sentence. Be direct.'),
    tone: 'rushed',
    scriptedLines: armed.lines,
    moveId: armed.moveId,
    delayMs: 0,
    maxWords: 12,
    why: `Interrupt: ${armed.moveId}`,
  };
}

export type { Phase };
