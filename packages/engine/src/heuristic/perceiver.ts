import type { Perceiver, PerceptionInput } from '../adapters';
import type { BehaviorId, Topic } from '../schema';
import { emptyPerception, type Perception } from '../state';
import { extractDollarAmounts, similarity, wordCount } from '../util';

/**
 * Rule-based perception for demo mode and the test bench. It is deliberately simple:
 * good enough to make the customer respond to what a tech actually does, with no API key.
 * Claude replaces it in production.
 */
export class HeuristicPerceiver implements Perceiver {
  readonly name = 'heuristic';

  async perceive(input: PerceptionInput): Promise<Perception> {
    return perceiveText(input);
  }
}

const R = {
  intro: /\b(my name is|i'?m \w+ (from|with)|this is \w+ (from|with)|me llamo|soy \w+ de)\b/i,
  plan: /\b(i'?ll (take a look|check|inspect|show you|walk you|explain)|what i'?ll do|before (i|we) (do|start) anything|show you (some |a few )?options|give you (some |a few )?options|take (about|maybe) \d+|le voy a (explicar|mostrar)|opciones antes)\b/i,
  openQ: /\b(what|how|when|why|which|tell me|walk me through|describe|talk me through|qué|cómo|cuándo|cuénteme|dígame)\b/i,
  reflect: /\b(so it sounds like|it sounds like|sounds like you|what i'?m hearing|if i understand|you mentioned|you said|so you'?re saying|entonces usted)\b/i,
  feeling: /\b(i understand|that makes (total |complete )?sense|i hear you|i get (it|that)|that'?s (frustrating|stressful|a lot|tough|no fun)|i'?m sorry (to hear|you)|no wonder|totally fair|fair question|great question|good question|lo entiendo|entiendo)\b/i,
  plain: /\b(basically|in other words|what that means|think of it|simple version|which means|that means|what'?s happening is|what happened is|in plain english|the short version|o sea|es decir|lo que pasa es)\b/i,
  jargon: /\b(anode( rod)?|t&p|tpr|sediment|thermocouple|flue|draft hood|expansion tank|prv|pressure reducing|btus?|gpm|first.hour rating|combustion chamber|dielectric|galvanic|flex line|cleanout|p.?trap|wax ring|flapper|backflow|hydro.?jet(ting)?|belly|offset joint|lateral|vent stack|pilot assembly|gas valve|igniter)\b/i,
  check: /\b(does that make sense|make sense\?|any questions|is that clear|what questions do you have|did i explain that|tiene (alguna )?pregunta|me explico)\b/i,
  evidence: /\b(let me show you|i can show you|take a look at (this|that)|come (take a )?look|here'?s a (photo|picture|video)|i took a (photo|picture|video)|you can see|see (the|this) (rust|leak|corrosion|crack|water)|look at (this|that)|mire|le enseño)\b/i,
  options: /\b(options?|choices?|good,? better,? best|first one|second one|two ways|three ways|a few ways|alternativas?|opciones?)\b/i,
  tiedNeeds: /\b(you mentioned|since you|because you said|for you|your (budget|family|plans|kids|daughter|son|tenant|guests)|with (the|your) (kids|family)|como usted dijo)\b/i,
  single: /\b(only (option|choice|thing)|you have to (replace|get)|have no choice|no other option)\b/i,
  hedge: /\b(i know (it'?s|that'?s) (a lot|expensive|not cheap)|unfortunately|i'?m sorry,? but|it'?s not cheap|bad news|brace yourself|sticker shock)\b/i,
  discount: /\b(knock (some(thing)? )?(off|it down)|discount|take \$?\d+ off|best i can do|i can do it for|work with you on (the )?price|special (price|deal)|cut you a deal|throw in)\b/i,
  value: /\b(includes|including|comes with|warranty|permit|haul(ing)? away|labor|guarantee|code|that covers|parts and labor|incluye|garantía)\b/i,
  askConcern: /\b(what('?s| is) (your|the) (biggest |main )?(concern|worry|hesitation)|what'?s holding you back|what would you (want|need) to (know|see)|can i ask what|what are you (comparing|looking for)|what('?s| is) on your mind|what worries you|qué le preocupa)\b/i,
  impatience: /\b(as i (said|told you|mentioned)|like i (said|told you)|i already (told|explained)|look,|ok(ay)?,? again)\b/i,
  argue: /\b(that'?s (not true|wrong|not how)|you'?re wrong|that'?s ridiculous|no,? no,? no)\b/i,
  agreeWrong: /\b(you'?re (right|probably right)|yeah,? (that|you) could be right|good point,? we can skip|we don'?t (really )?need (it|that)|tiene razón)\b/i,
  correct: /\b(a lot of people (think|hear)|that used to be true|in this case|here'?s the thing|common (myth|question|misconception)|it'?s a fair (thought|question),? but|actually)\b/i,
  condescend: /\b(obviously|everyone knows|it'?s simple|you should (know|have known)|not rocket science|calm down|as i already)\b/i,
  ask: /\b(would you like (me )?to (go ahead|get started|move forward|schedule|book|get (that|this|it|you) (scheduled|booked|started|on the schedule))|(want|like) me to (book|schedule|set (that|it|this) up|take care of (that|it|this)|get (that|this|it|you) (scheduled|booked|started))|should (i|we) (go ahead|get (that|it|this) (scheduled|booked|started)|book (it|that|this)|schedule (it|that|this))|are you ready to|can i get (you|that|this|it) (on the schedule|scheduled|booked)|do you want to (do|go with|book|schedule)|want me to (go ahead|get started|start|schedule)|which (option|one) (works|would you like|do you want|sounds)|shall (i|we) (get started|go ahead)|ready to (go ahead|move forward|get started)|do you want to (go ahead|move forward)|what would you like to do|how would you like to (proceed|move forward)|can we get (you|this) (on the schedule|scheduled)|quiere que (empiece|lo haga)|cuál opción)\b/i,
  recap: /\b(so to (recap|sum up)|just to recap|so what we('?ve)? (found|got)|to summarize|here'?s what i recommend|my recommendation is)\b/i,
  pressure: /\b(today only|only (good|valid) (today|until)|(could|might|will) (flood|explode|burst|kill)|if you don'?t do it (now|today)|price goes up|last chance|i can only hold|need (an answer|to know) (now|today)|before i leave today)\b/i,
  financing: /\b(financ(e|ing)|payment plans?|pay (it )?over time|monthly payments?|0 ?% |zero percent|financiamiento|pagos mensuales)\b/i,
  monthly: /(\$?\d{2,4}|[a-z-]+(?: [a-z-]+)?)\s*(dollars?\s*)?(a|per|\/)\s*month|al mes/i,
  membership: /\b(membership|member|maintenance plan|club|shield|care plan|service agreement|membresía)\b/i,
  membershipValue: /\b(priority|discount|flush|tune.?up|no overtime|percent off|% off|annual (inspection|maintenance|visit)|first in line|front of the line)\b/i,
  honest: /\b(i don'?t know|i'?m not sure,? (but|let me)|let me (check|find out)|honestly|to be honest|the honest answer|be straight with you|i won'?t lie|in my own house,? i'?d|if it were my house|no le voy a mentir)\b/i,
  reengage: /\b(no (problem|worries)|where were we|we were (talking|looking)|to pick (back )?up|so,? like i was saying|to catch you up|just to recap)\b/i,
  includeSecond: /\b(nice to meet you|to catch you up|filling you in|catching you up|what do you think|both of you|you two|mucho gusto)\b/i,
  leaveWell: /\b(no (problem|pressure)|take your time|here'?s my (card|number)|i'?ll (leave|send|email|text) (you )?(the|a|my)? ?(estimate|quote|card|options)|call (me|us) (anytime|if)|i'?ll follow up|feel free to|whenever you'?re ready)\b/i,
  goodbye: /\b(have a (good|great|nice|wonderful) (day|night|one|evening|weekend)|take care|goodbye|bye now|see you|que le vaya bien|adiós)\b/i,
  recommend: /\b(recommend|should|need|you'?ll want|i'?d (do|add|go with|suggest)|have to|must|required|recomiendo|necesita)\b/i,
};

const TOPIC_PATTERNS: [Topic, RegExp][] = [
  ['household', /\b(who (lives|else)|family|kids|people in the (house|home)|how many (people|of you)|live here|quién vive)\b/i],
  ['usage', /\b(how (much|often) do you use|showers?|laundry|baths?|dishwasher|use a lot of|hot water (do you|usage))\b/i],
  ['history', /\b(how long has|when did (it|this|you)|how old|first notice|ever had|happen(ed)? before|start(ed)? (doing|happening)|desde cuándo)\b/i],
  ['previous-work', /\b(anyone (out|else)|(other|last|another) (company|plumber|guy)|had work done|replaced (it )?before|who installed)\b/i],
  ['budget', /\b(budget|spend|afford|price range|cost in mind|presupuesto)\b/i],
  ['plans', /\b(how long (are you|do you) plan|staying|selling|plans for the (house|home)|future|stay in the (house|home))\b/i],
  ['pets', /\b(dog|cat|pets?|kitty|perro|gato)\b/i],
  ['timeline', /\b(when do you need|how soon|timeline|by when|need it done)\b/i],
  ['home', /\b(how long have you (lived|been in|owned)|the house|the home|this house)\b/i],
  ['priorities', /\b(most important|matters (most )?to you|priority|what('?s| is) important|looking for in|care about most)\b/i],
  ['work', /\b(what do you do|for work|working from home|your job)\b/i],
];

const STOP = new Set(
  'the a an and or but so to of in on at for with my your our their this that it is was are be been have has had just like really very about from they them she he his her we you i me'.split(' '),
);
function keyWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP.has(w));
}
function names(text: string): string[] {
  return [...text.matchAll(/(?<!^|[.!?]\s)\b([A-Z][a-z]{2,})\b/g)].map((m) => m[1]!.toLowerCase());
}

export function perceiveText(input: PerceptionInput): Perception {
  const t = input.techText;
  const p = emptyPerception();
  const add = (id: BehaviorId, evidence = '') => {
    if (!p.behaviors.some((b) => b.id === id)) p.behaviors.push({ id, evidence: evidence || t.slice(0, 80) });
  };
  const turn = input.state.turn + 1;
  const isQuestion = /\?/.test(t) || /^(what|how|when|why|which|who|is|are|do|does|did|can|could|would|tell me|walk me)\b/i.test(t.trim());
  p.askedQuestion = isQuestion;

  if (turn <= 3 && (R.intro.test(t) || R.plan.test(t))) add('set_frame');
  if (isQuestion && R.openQ.test(t)) add('asked_open_question');
  else if (/\btell me (about|more)\b/i.test(t)) add('asked_open_question');
  if (isQuestion && input.lastCustomerTurn && similarity(t, input.lastCustomerTurn.text) >= 0.2) add('asked_follow_up');
  if (R.reflect.test(t)) add('reflected_back');
  if (R.feeling.test(t)) add('acknowledged_feeling');
  const plain = R.plain.test(t);
  if (plain) add('explained_plainly');
  if (R.jargon.test(t) && !plain && !/\b(which is|that'?s the|that part|means)\b/i.test(t)) add('used_jargon');
  if (R.check.test(t)) add('checked_understanding');
  if (R.evidence.test(t)) add('showed_evidence');

  const prices = extractDollarAmounts(t).filter((n) => n >= 100);
  const monthlyMatch = t.match(R.monthly);
  if (monthlyMatch) {
    const amounts = extractDollarAmounts(`$${monthlyMatch[1]}`).concat(extractDollarAmounts(monthlyMatch[0]));
    const m = amounts.find((n) => n >= 10 && n < 1000);
    if (m) {
      p.monthlyStated = m;
      add('framed_monthly', monthlyMatch[0]);
    }
  }
  const bigPrices = prices.filter((n) => n !== p.monthlyStated && n >= 150);
  const optionWords = R.options.test(t);
  if (bigPrices.length > 0) {
    p.priceStated = bigPrices[bigPrices.length - 1]!;
    add('stated_price', `$${p.priceStated}`);
  }
  const countMatch = t.match(/\b(two|three|four|2|3|4) (options|choices|ways)\b/i);
  const count = countMatch ? ({ two: 2, three: 3, four: 4 } as Record<string, number>)[countMatch[1]!.toLowerCase()] ?? Number(countMatch[1]) : 0;
  if (optionWords && (count >= 2 || bigPrices.length >= 2 || /\bor\b/i.test(t))) {
    p.optionsCount = Math.max(count, bigPrices.length, 2);
    add('presented_options');
  } else if (bigPrices.length >= 2) {
    p.optionsCount = bigPrices.length;
    add('presented_options');
  }
  if (p.optionsCount && R.tiedNeeds.test(t)) add('tied_options_to_needs');
  if (R.single.test(t)) add('single_option_only');
  if (R.hedge.test(t)) add('hedged_price');
  if (R.discount.test(t)) add('discounted_unprompted');
  if (R.value.test(t) && (p.priceStated || input.state.priceHeard)) add('justified_value');
  if (R.askConcern.test(t)) add('asked_about_concern');
  if (R.impatience.test(t)) add('showed_impatience');
  if (R.argue.test(t)) add('argued');
  if (R.condescend.test(t)) add('condescended');

  const misplaced = input.lastCustomerMoveGroup === 'misplaced-confidence';
  if (misplaced && R.agreeWrong.test(t)) add('caved');
  else if (misplaced && R.correct.test(t) && !R.condescend.test(t)) add('corrected_respectfully');

  if (R.ask.test(t)) add('asked_for_decision');
  if (R.recap.test(t)) add('recapped_value');
  if (R.pressure.test(t)) add('pressured');
  if (R.financing.test(t)) add('offered_financing');
  if (R.membership.test(t)) {
    add('offered_membership');
    if (R.membershipValue.test(t)) add('explained_membership_value');
  }
  if (R.honest.test(t)) add('honest_answer');
  if (input.lastCustomerTurn?.act === 'return' && R.reengage.test(t)) add('re_engaged');
  if (input.state.secondaryPresent && (R.includeSecond.test(t) || (input.spec.persona.secondary && new RegExp(`\\b${input.spec.persona.secondary.name.split(' ')[0]}\\b`, 'i').test(t)))) {
    add('included_second_person');
  }
  if ((input.state.decision === 'later' || input.state.decision === 'no') && R.leaveWell.test(t)) add('left_well');
  p.saidGoodbye = R.goodbye.test(t);

  // Repeats: same answer twice versus a new angle.
  const last = input.lastCustomerTurn;
  if (last?.moveId && input.transcript.length > 2) {
    const prevTech = [...input.transcript].reverse().filter((x) => x.speaker === 'tech')[0];
    if (prevTech && input.concerns.some((c) => c.id === last.moveId && c.voiced)) {
      const sim = similarity(t, prevTech.text);
      if (sim >= 0.6) add('repeated_same_answer');
      else if (sim < 0.35 && (R.feeling.test(t) || R.askConcern.test(t) || R.value.test(t))) add('new_angle');
    }
  }

  // Topics asked about.
  if (isQuestion || /\btell me\b/i.test(t)) {
    for (const [topic, re] of TOPIC_PATTERNS) if (re.test(t)) p.topics.push(topic);
  }

  // Facts brought back.
  for (const f of input.revealedFacts) {
    const fNames = names(f.text);
    const words = new Set(t.toLowerCase().split(/\W+/));
    const nameHit = fNames.some((n) => words.has(n));
    const kw = keyWords(f.text).filter((w) => words.has(w));
    if (nameHit || kw.length >= 2) {
      p.usedFactIds.push(f.id);
      add('used_customer_detail', f.id);
    }
  }

  // Unneeded work: a keyword from an unjustified item plus a recommending verb.
  if (R.recommend.test(t)) {
    for (const u of input.spec.scenario.unjustifiedWork) {
      const kws = keyWords(u.label).filter((w) => !['saying', 'required', 'whole', 'house', 'water', 'unit', 'system', 'replacement', 'full', 'entire', 'new'].includes(w));
      if (kws.length > 0 && kws.some((k) => t.toLowerCase().includes(k))) {
        p.unneededWork.push(u.label);
        add('recommended_unneeded_work', u.label);
      }
    }
  }

  // Concerns addressed: a voiced objection's resolving behaviors showing up.
  const ids = new Set(p.behaviors.map((b) => b.id));
  for (const c of input.concerns.filter((x) => x.voiced && x.id !== 'real')) {
    const hits = c.resolvers.filter((b) => ids.has(b)).length;
    if (hits >= 2) p.addressed.push({ concernId: c.id, quality: 'full' });
    else if (hits === 1) p.addressed.push({ concernId: c.id, quality: 'partial' });
  }
  const real = input.concerns.find((c) => c.id === 'real');
  if (real) {
    const supportive = ['acknowledged_feeling', 'tied_options_to_needs', 'framed_monthly', 'showed_evidence', 'honest_answer', 'asked_about_concern'] as BehaviorId[];
    const hits = supportive.filter((b) => ids.has(b)).length;
    const kwHits = keyWords(real.concern).filter((w) => t.toLowerCase().includes(w)).length;
    if (hits >= 2 || (hits >= 1 && kwHits >= 1)) {
      p.addressed.push({ concernId: 'real', quality: hits >= 3 ? 'full' : 'partial' });
    }
  }
  if (p.addressed.length > 0) add('addressed_concern');

  p.summary = t.length > 140 ? `${t.slice(0, 137)}...` : t;
  if (wordCount(t) === 0) p.summary = '(silence)';
  return p;
}
