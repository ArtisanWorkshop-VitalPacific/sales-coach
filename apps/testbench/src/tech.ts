import {
  type ContentIndex,
  type CustomerTurn,
  createRng,
  type Move,
  type Scenario,
  type ScenarioOption,
  type SessionSpec,
} from '@sales-coach/engine';

/**
 * A scripted technician. Three skill levels share one structure: a planned sequence of
 * beats (door, discovery, findings, options, price, close, goodbye) plus reactive handling
 * of whatever the customer just did (objections, reveals, holds, interruptions, spouses).
 *
 * The lines are written for the heuristic perceiver to read the way a person would:
 * the expert does what the rubric rewards, the novice does what it punishes.
 */

export type Level = 'novice' | 'solid' | 'expert';

/**
 * standard  the level's normal call.
 * upsell    an expert who also recommends one unjustified item (scenario.unjustifiedWork).
 * pushy     an expert up to the price who then asks for the decision again and again.
 */
export type Variant = 'standard' | 'upsell' | 'pushy';

export type HoldChoice = { kind: 'wait' } | { kind: 'fill'; text: string; afterMs: number };

type Beat =
  | 'frame'
  | 'discover-history'
  | 'discover-household'
  | 'reflect'
  | 'discover-priorities'
  | 'discover-previous'
  | 'closed-question'
  | 'findings'
  | 'options'
  | 'recommend'
  | 'upsell'
  | 'trial-close'
  | 'ask';

const PLANS: Record<Level, Beat[]> = {
  expert: [
    'frame',
    'discover-history',
    'discover-household',
    'reflect',
    'discover-priorities',
    'discover-previous',
    'findings',
    'options',
    'recommend',
    'trial-close',
    'ask',
  ],
  solid: ['frame', 'discover-history', 'closed-question', 'findings', 'options', 'recommend', 'ask'],
  novice: ['frame', 'closed-question', 'closed-question', 'findings', 'options', 'ask'],
};

/** Where a drill or a mid-call scenario picks up the plan. */
const PHASE_ENTRY: Record<string, Beat> = {
  door: 'frame',
  discovery: 'discover-history',
  findings: 'findings',
  options: 'options',
  price: 'recommend',
  objections: 'trial-close',
  close: 'ask',
  wrapup: 'ask',
};

const MAX_ASKS: Record<Level, number> = { expert: 2, solid: 2, novice: 5 };

/** Phrases the heuristic perceiver reads as each resolving behavior. Two variants each. */
const RESOLVER_PHRASES: Partial<Record<string, (t: Tech) => string[]>> = {
  justified_value: (t) => [
    `That price includes parts and labor, the permit, haul away, and the warranty${t.recWarranty()}.`,
    'Everything is included: parts and labor, the permit, and our workmanship guarantee.',
  ],
  showed_evidence: () => ['I took a photo so you can see exactly what I saw.', 'Come take a look at this with me so you can see it yourself.'],
  honest_answer: () => ['To be honest with you, that is a fair way to look at it.', 'Honestly, I would want the same thing in your shoes.'],
  acknowledged_feeling: () => ['I hear you.', 'That is totally fair.'],
  framed_monthly: (t) => [`If it helps, it works out to about $${t.recMonthly()} a month.`, `Spread out, that is about $${t.recMonthly()} a month.`],
  offered_financing: (t) => [`We do have financing, about $${t.recMonthly()} a month.`, 'We have payment plans if that is easier.'],
  explained_plainly: () => ['In other words, you get it fixed right once, with nothing hidden.', 'The short version: one price, done right, nothing hidden.'],
  tied_options_to_needs: (t) => [`Of the ${t.optionWord()} options, since you mentioned ${t.need()}, the first one fits you.`],
  used_customer_detail: (t) => [`You mentioned ${t.need()}, and I kept that in mind.`],
  included_second_person: (t) => [`${t.secondaryName() ? `${t.secondaryName()}, ` : ''}what do you think?`],
  explained_membership_value: () => ['The membership gets you priority scheduling, a yearly tune-up, and 15 percent off repairs.'],
  offered_membership: () => ['We also have a membership that covers a yearly tune-up and priority service.'],
  corrected_respectfully: () => ['A lot of people hear that, and it is a fair thought, but in this case it works differently.'],
  checked_understanding: () => ['Does that make sense?', 'Is that clear?'],
  recapped_value: (t) => [`So to recap, ${t.recLabel()} fixes the problem and comes with a real warranty.`],
  new_angle: () => ['Let me come at it another way: what would make you feel good about this?'],
  re_engaged: () => ['No problem. Where were we? Just to recap, here is what I found.'],
};

const STOP_REFLECT = /^(oh|well|okay|ok|hi|hello|yeah|so|hm|um|uh|sure|mm-hm)[,.!]?\s+/i;

export interface TechContext {
  spec: SessionSpec;
  index: ContentIndex;
}

export class Tech {
  readonly level: Level;
  readonly variant: Variant;
  private readonly rng: ReturnType<typeof createRng>;
  private readonly spec: SessionSpec;
  private readonly index: ContentIndex;
  private readonly scenario: Scenario;
  private plan: Beat[];
  private lastBeat: Beat | null = null;
  private memory: string[] = [];
  private handled = new Map<string, number>();
  private pendingAddress: string | null = null;
  private asks = 0;
  private progressSinceAsk = true;
  private awaitingDecision = false;
  private lastObjectionAnswer = '';
  private said: string[] = [];
  private upsellIndex: number;
  /** The unjustified item this tech recommended (upsell variant), for the checks. */
  upsoldItem: string | null = null;
  /** Tech turn index (1-based) of the upsell, for the trust check. */
  upsellTurn: number | null = null;
  done = false;

  constructor(level: Level, variant: Variant, seed: number, ctx: TechContext, upsellIndex = 0) {
    this.level = variant === 'standard' ? level : 'expert';
    this.variant = variant;
    this.rng = createRng(seed * 7919 + 17);
    this.spec = ctx.spec;
    this.index = ctx.index;
    this.scenario = ctx.spec.scenario;
    this.upsellIndex = upsellIndex;
    const base = [...PLANS[this.level]];
    if (variant === 'upsell') base.splice(base.indexOf('recommend') + 1, 0, 'upsell');
    if (variant === 'pushy') base.splice(base.indexOf('trial-close'), 1);
    const entry = PHASE_ENTRY[ctx.spec.startPhase] ?? 'frame';
    const at = base.indexOf(entry);
    this.plan = at > 0 ? base.slice(at) : base;
  }

  get maxAsks() {
    return this.variant === 'pushy' ? 5 : MAX_ASKS[this.level];
  }

  /* ------------------------------------------------------------- scenario facts */

  private sortedOptions(): ScenarioOption[] {
    return [...this.scenario.options].sort((a, b) => a.price - b.price);
  }
  private rec(): ScenarioOption {
    return this.scenario.options.find((o) => o.recommended) ?? this.sortedOptions()[0]!;
  }
  recLabel() {
    return `the ${shortLabel(this.rec().label)}`;
  }
  recMonthly() {
    const r = this.rec();
    return r.monthly ?? Math.max(10, Math.round(r.price / 40));
  }
  recWarranty() {
    const m = this.rec().label.match(/(\d+)-year warranty/i);
    return m ? `, ${m[1]} years of it` : '';
  }
  optionWord() {
    return ['zero', 'one', 'two', 'three', 'four'][Math.min(4, this.scenario.options.length)] ?? 'few';
  }
  secondaryName() {
    return this.spec.persona.secondary?.name.split(' ')[0];
  }
  private thing(): string {
    const text = `${this.scenario.jobType} ${this.scenario.title} ${this.scenario.equipment[0]?.item ?? ''}`.toLowerCase();
    const map: [RegExp, string][] = [
      [/water.heater|tankless|\bwh-/, 'water heater'],
      [/sewer|main.line/, 'sewer line'],
      [/drain|clog|snake|jet/, 'drain'],
      [/toilet/, 'toilet'],
      [/faucet/, 'faucet'],
      [/disposal/, 'disposal'],
      [/slab|leak/, 'leak'],
      [/repipe|galvanized|pipe/, 'pipes'],
      [/pressure|prv/, 'water pressure'],
      [/softener|filtration|filter|hard.water/, 'water'],
      [/gas/, 'gas line'],
      [/shutoff|valve/, 'shutoff valve'],
    ];
    return map.find(([re]) => re.test(text))?.[1] ?? 'system';
  }
  /** Something the customer told us, said back in our words. */
  need(): string {
    // Prefer a line with a name in it ("my son Kevin"): the detail a good tech remembers.
    const pick = [...this.memory].reverse().find((l) => /[a-z,]\s+[A-Z][a-z]{2,}/.test(l)) ?? this.memory.at(-1);
    return pick ? echo(pick) : 'you want it done right without surprises';
  }

  /* ---------------------------------------------------------------- the call */

  /** Remember what the customer says, the way a good tech listens. */
  hear(turn: CustomerTurn | null) {
    if (!turn?.text || !['answer', 'reveal', 'open', 'probe'].includes(turn.act)) return;
    const clean = turn.text.replace(/\[[^\]]+\]\s*/g, '').trim();
    if (clean.split(/\s+/).length >= 7) this.memory.push(clean);
  }

  /** The customer went quiet ('think') or stepped away ('away'). */
  duringHold(turn: CustomerTurn): HoldChoice {
    const fill = (text: string): HoldChoice => ({ kind: 'fill', text, afterMs: 800 + Math.floor(this.rng.next() * 900) });
    if (turn.holdKind === 'away') {
      if (this.level === 'novice') return fill(`So anyway, like I was saying, the ${this.thing()} is done.`);
      return { kind: 'wait' };
    }
    if (this.level === 'expert') return { kind: 'wait' };
    if (this.level === 'solid' && this.rng.chance(0.55)) return { kind: 'wait' };
    return fill(
      this.level === 'novice'
        ? this.pick(['So, yeah. It is a really good unit, you will not regret it.', 'I mean, I know it is a lot. It is a good price though.'])
        : this.pick(['And that is everything included.', 'That is the full price, nothing extra.']),
    );
  }

  /** The tech's utterance was cut off by an armed interrupt: say it again later. */
  cutOff() {
    if (this.lastBeat) this.plan.unshift(this.lastBeat);
  }

  /** What the tech says next, given what the customer just did. */
  next(last: CustomerTurn | null): string {
    this.lastBeat = null;
    const text = this.reactTo(last) ?? this.nextBeat();
    this.said.push(text);
    return text;
  }

  private reactTo(last: CustomerTurn | null): string | null {
    if (!last) return null;
    const move = last.moveId ? this.index.move(last.moveId) : undefined;

    // The decision came back.
    if (last.decision === 'yes') return this.bye('yes');
    if (this.awaitingDecision) {
      this.awaitingDecision = false;
      if (last.decision === 'no') return this.bye('no');
      if (this.level === 'novice' || this.variant === 'pushy') return this.pushAgain();
    }

    if (last.act === 'return') return this.reengage();
    if (last.act === 'interrupt') return this.answerHowMuch();
    if (last.speaker === 'secondary') return this.includeSecond();
    if (last.act === 'reveal') return this.addressReveal();

    if (move?.kind === 'objection' || last.act === 'object') {
      return this.handleObjection(move);
    }
    if (move && move.kind === 'behavior') {
      const handled = this.handleBehaviorMove(move, last);
      if (handled) return handled;
    }
    if (last.decision === 'later') return this.afterLater(last);
    if (this.pendingAddress) {
      const id = this.pendingAddress;
      this.pendingAddress = null;
      return this.address(id);
    }
    return null;
  }

  private nextBeat(): string {
    if (this.asks >= this.maxAsks && !this.awaitingDecision && this.plan.length === 0) return this.bye('later');
    const beat = this.plan.shift();
    if (!beat) {
      // Plan done. Ask again only after progress (or always, for pushers), else leave well.
      const pushes = this.level === 'novice' || this.variant === 'pushy';
      if (this.asks < this.maxAsks && (pushes || (this.progressSinceAsk && this.asks > 0))) return this.ask();
      return this.bye(this.asks > 0 ? 'later' : 'no');
    }
    this.lastBeat = beat;
    return this.say(beat);
  }

  private say(beat: Beat): string {
    const L = this.level;
    const thing = this.thing();
    switch (beat) {
      case 'frame':
        if (L === 'novice') return this.pick([`Hey. Where's the ${thing}?`, `Hi. Okay, where is it?`, `Hey there. Show me the ${thing}.`]);
        if (L === 'solid') return this.pick([`Hi, I'm Sam with the plumbing company. Can you show me the ${thing}?`, `Hi, this is Sam from the plumbing company. Where is the ${thing}?`]);
        return this.pick([
          `Hi, I'm Sam with the plumbing company. Before I touch anything, here's how I like to work: I'll take a look, show you what I find, and give you a few options. Sound good?`,
          `Hi, I'm Sam from the plumbing company, thanks for having me. What I'll do is take a look, explain what I find in plain English, and show you some options before we do anything. Okay?`,
        ]);
      case 'discover-history':
        return this.pick([
          `Can you walk me through what's been going on with the ${thing}, and when you first noticed it?`,
          `Tell me about what's been happening. When did it start?`,
        ]);
      case 'discover-household':
        return this.pick([
          `Who lives here with you, and how do you use the ${thing} day to day?`,
          `How many people are in the home, and what does a normal day of usage look like?`,
        ]);
      case 'reflect': {
        const back = this.memory.at(-1);
        const lead = back ? `So it sounds like ${echo(back)}. That must be frustrating.` : 'So it sounds like this has been a real hassle. I hear you.';
        return `${lead} What matters most to you in how we fix this?`;
      }
      case 'discover-priorities':
        return this.pick([
          'How long are you planning to stay in the home?',
          'What are your plans for the house over the next few years?',
        ]);
      case 'discover-previous':
        return this.pick([
          'Has anyone else been out to look at this, or had other work done on the house before?',
          'Has another company been out for this before? How did that go?',
        ]);
      case 'closed-question':
        return this.pick([`Is it gas?`, `Is it leaking?`, `Is this the only one?`, `Did you try turning it off and on?`]);
      case 'findings':
        return this.findings();
      case 'options':
        return this.options();
      case 'recommend':
        return this.recommend();
      case 'upsell':
        return this.upsell();
      case 'trial-close':
        return 'Before you decide anything, what is on your mind about all this? What would you want to know?';
      case 'ask':
        return this.ask();
    }
  }

  private findings(): string {
    const rank = { urgent: 0, major: 1, minor: 2, info: 3 } as const;
    const fs = [...this.scenario.findings].sort((a, b) => rank[a.severity] - rank[b.severity]);
    const top = fs[0]!;
    if (this.level === 'novice') {
      const jargon: Record<string, string> = {
        'water heater': "Your anode rod is shot, there's sediment in the combustion chamber, and the T&P is weeping.",
        drain: 'There is a belly in the lateral past the cleanout, and the p-trap is a mess.',
        'sewer line': 'There is a belly in the lateral past the cleanout, probably an offset joint.',
        toilet: 'The flapper is shot and the wax ring is gone.',
      };
      return `Yeah, so ${lowerFirst(top.text)} ${jargon[this.thing()] ?? 'The PRV is off, you have no expansion tank, and the flex line is galvanic.'}`;
    }
    if (this.level === 'solid') {
      return `Here's what I found. ${top.text} In other words, it needs to be taken care of.`;
    }
    const second = fs[1] ? ` I also noticed this: ${fs[1].text}` : '';
    return `Here's what I found, in plain English. ${top.text} What that means is it won't get better on its own.${second} I took a photo so you can see it. Does that make sense?`;
  }

  private options(): string {
    const opts = this.sortedOptions();
    if (this.level === 'novice') {
      const r = this.rec();
      const price = r.price + 400;
      return `You have to replace it, it's the only option. I know it's a lot, unfortunately it's $${fmt(price)}. But I can knock $200 off if you do it today.`;
    }
    if (opts.length === 1) {
      const o = opts[0]!;
      return `There's one right fix here: ${o.label}. It's $${fmt(o.price)}${o.monthly ? `, or about $${o.monthly} a month` : ''}.`;
    }
    const shown = this.level === 'solid' ? opts.slice(0, 2) : opts.slice(0, 3);
    const n = ['', 'one', 'two', 'three'][shown.length] ?? 'a few';
    const parts = shown.map((o, i) => {
      const ord = ['The first', 'The second', 'The third'][i];
      const monthly = this.level === 'expert' && o.monthly ? `, or about $${o.monthly} a month` : '';
      return `${ord} is ${o.label}, at $${fmt(o.price)}${monthly}.`;
    });
    return `You have ${n} options. ${parts.join(' ')}`;
  }

  private recommend(): string {
    const r = this.rec();
    if (this.level === 'novice') return `So it's $${fmt(r.price + 200)}. That's the best I can do.`;
    if (this.level === 'solid') return `The one most people go with is ${shortLabel(r.label)}. It's $${fmt(r.price)}.`;
    const n = this.optionWord();
    return `Of those ${n} options, since you mentioned ${this.need()}, the first one I'd point you to is ${shortLabel(r.label)}. It's $${fmt(r.price)} total, or about $${this.recMonthly()} a month.`;
  }

  private upsell(): string {
    const items = this.scenario.unjustifiedWork;
    const u = items[this.upsellIndex % Math.max(1, items.length)];
    if (!u) return 'Okay.';
    this.upsoldItem = u.label;
    this.upsellTurn = this.said.length + 1;
    return `While I'm here, I'd also recommend this: ${u.label.toLowerCase()}.`;
  }

  private ask(): string {
    this.asks += 1;
    this.awaitingDecision = true;
    this.progressSinceAsk = false;
    if (this.level === 'novice' || (this.variant === 'pushy' && this.asks > 1)) {
      return this.pick(['So do you want to do it?', 'Want me to get started?', 'Are you ready to go ahead?', 'So do you want to go ahead?']);
    }
    return this.pick(['Would you like me to go ahead and get that scheduled?', 'Would you like me to get started on that today?']);
  }

  private pushAgain(): string {
    if (this.asks >= this.maxAsks) return this.bye('later');
    if (this.variant === 'pushy') return this.ask();
    // Novice: pressure, then the same ask again.
    this.asks += 1;
    this.awaitingDecision = true;
    return this.pick([
      'Look, this price is today only. So do you want to do it?',
      'I need an answer today, the price goes up next week. Want me to get started?',
      'Come on, it is not going to get cheaper. Are you ready to go ahead?',
    ]);
  }

  private afterLater(last: CustomerTurn): string {
    // A deferral with no named objection: budget or "not ready".
    if (this.level === 'novice') return this.pushAgain();
    this.progressSinceAsk = true;
    const cheapest = this.sortedOptions()[0]!;
    if (/more than|afford|budget|money|cost/i.test(last.text)) {
      return `That makes sense. To be honest, if the budget is tight, ${shortLabel(cheapest.label)} at $${fmt(cheapest.price)} is a safe choice, and it works out to about $${cheapest.monthly ?? Math.round(cheapest.price / 40)} a month.`;
    }
    return 'That makes sense. Can I ask what is on your mind? What would you want to know before deciding?';
  }

  private handleObjection(move: Move | undefined): string {
    const id = move?.id ?? 'unknown';
    const times = (this.handled.get(id) ?? 0) + 1;
    this.handled.set(id, times);
    if (this.level === 'novice') {
      const n = this.rng.next();
      if (times > 1 && this.lastObjectionAnswer) return this.lastObjectionAnswer; // the same answer again
      const text =
        n < 0.4
          ? "That's not true. Nobody is going to beat that, and that's not how it works."
          : n < 0.7
            ? 'Look, as I said, I can knock some off if you do it today. Today only.'
            : 'It is what it is. You have to replace it anyway.';
      this.lastObjectionAnswer = text;
      return text;
    }
    this.progressSinceAsk = true;
    if (this.level === 'solid') return this.address(id, 1);
    // Expert: first ask about the concern, then address it with what actually resolves it.
    if (times === 1 && !this.pendingAddress) {
      this.pendingAddress = id;
      return this.pick([
        'That is a fair question. Can I ask what is on your mind with that? What would you want to see?',
        'I hear you. What would you want to know to feel good about it?',
      ]);
    }
    return this.address(id);
  }

  /** Answer a concern with up to three of the behaviors that resolve it. */
  private address(moveId: string, limit = 3): string {
    this.progressSinceAsk = true;
    const move = this.index.move(moveId);
    const resolvers = (move?.resolution?.resolvingBehaviors ?? ['justified_value', 'honest_answer', 'acknowledged_feeling']).filter(
      (b) => b !== 'asked_about_concern' && b !== 'left_well' && (b !== 'included_second_person' || this.secondaryName()),
    );
    const usedBefore = this.said.join(' ');
    const lines: string[] = [];
    for (const b of resolvers) {
      const phrase = RESOLVER_PHRASES[b]?.(this).find((x) => !usedBefore.includes(x));
      if (phrase) lines.push(phrase);
      if (lines.length >= limit) break;
    }
    if (lines.length === 0) lines.push(RESOLVER_PHRASES.justified_value!(this)[1]!);
    const lead = this.level === 'expert' && !resolvers.includes('acknowledged_feeling') ? 'That makes sense. ' : '';
    return `${lead}${lines.join(' ')}`;
  }

  private addressReveal(): string {
    this.progressSinceAsk = true;
    if (this.level === 'novice') return 'Okay. So anyway, do you want to go ahead?';
    if (this.level === 'solid') return `I understand. It works out to about $${this.recMonthly()} a month if that helps.`;
    const cheapest = this.sortedOptions()[0]!;
    return `Thank you for telling me that. That makes sense, and I'm glad you said it. To be honest with you, ${shortLabel(cheapest.label)} is a safe choice, and with financing it works out to about $${cheapest.monthly ?? Math.round(cheapest.price / 40)} a month, so it does not all land at once.`;
  }

  private handleBehaviorMove(move: Move, last: CustomerTurn): string | null {
    const L = this.level;
    switch (move.group) {
      case 'misplaced-confidence':
        if (L === 'novice') return this.pick(["That's not true. That's not how it works.", "You're right, we don't really need it."]);
        return `That's a fair thought, and a lot of people hear that. Here's the thing: in this case, ${lowerFirst(this.scenario.findings[0]?.text ?? 'it is a different situation.')}`;
      case 'probe':
        if (L === 'novice') return 'Trust me, everybody gets this one. It is the best.';
        return "Honestly? If it were my house, I'd do the same thing I suggested. I'll always be straight with you.";
      case 'confusion':
        if (L === 'novice') return `Like I said, it's $${fmt(this.rec().price + 200)}.`;
        return `Let me say that more clearly. In other words, it's $${fmt(this.rec().price)} total, and that includes parts and labor.`;
      case 'intensity':
        if (L === 'novice') return 'Okay, well, it is what it is.';
        return "I hear you, and I'm sorry about that. What would you need to see from me to feel good about this?";
      case 'disruption':
        if (last.act === 'distracted' && !last.holdKind) {
          if (L === 'novice') return 'As I said, it needs replacing.';
          return `No problem. The short version: the ${this.thing()} needs attention, and I'll show you your options. Does that make sense?`;
        }
        return null;
      case 'silence':
        if (move.id === 'minimal-responses') {
          if (L === 'novice') return null;
          return 'What questions do you have so far? Does that make sense?';
        }
        return null;
      default:
        return null;
    }
  }

  private reengage(): string {
    if (this.level === 'novice') return `Like I said, the ${this.thing()} is done and it needs replacing.`;
    return 'No problem at all. Where were we? Just to recap, I was walking you through what I found.';
  }

  private answerHowMuch(): string {
    if (this.level === 'novice') return `Like I said, it's around $${fmt(this.rec().price + 300)}, give or take.`;
    return `Fair question. The short version: the option that fits most homes like yours is $${fmt(this.rec().price)} all in. Let me show you what's included.`;
  }

  private includeSecond(): string {
    const name = this.secondaryName();
    if (this.level === 'novice') return 'Okay. Anyway.';
    return `Nice to meet you${name ? `, ${name}` : ''}. To catch you up, I found the problem with the ${this.thing()} and I'm about to walk through your options. What questions do you have?`;
  }

  private bye(kind: 'yes' | 'no' | 'later'): string {
    this.done = true;
    if (kind === 'yes') {
      return this.level === 'novice'
        ? 'Great. Sign here. Have a good day.'
        : "Thank you. I'll write it up and get started right away. Take care.";
    }
    if (this.level === 'novice') return 'Okay, fine. Have a good day.';
    return "No pressure at all. Here's my card, and I'll email you the written options so you can look them over. Call me anytime. Have a great day.";
  }

  private pick(lines: string[]): string {
    return this.rng.pick(lines) ?? lines[0]!;
  }
}

/* ------------------------------------------------------------------ helpers */

const fmt = (n: number) => n.toLocaleString('en-US');
const lowerFirst = (s: string) => (s ? s[0]!.toLowerCase() + s.slice(1) : s);
const shortLabel = (label: string) => label.split(',')[0]!.trim();

/** First sentence of a customer line, in second person: "my husband" -> "your husband". */
export function echo(line: string): string {
  const first = (line.match(/^[^.!?]+/)?.[0] ?? line).replace(STOP_REFLECT, '').trim();
  const swaps: [RegExp, string][] = [
    [/\bI'm\b/g, "you're"],
    [/\bI've\b/g, "you've"],
    [/\bI'll\b/g, "you'll"],
    [/\bI'd\b/g, "you'd"],
    [/\bI\b/g, 'you'],
    [/\bmy\b/gi, 'your'],
    [/\bme\b/gi, 'you'],
    [/\bwe\b/gi, 'you'],
    [/\bour\b/gi, 'your'],
    [/\bus\b/gi, 'you'],
    [/\bmine\b/gi, 'yours'],
  ];
  let out = first;
  for (const [re, to] of swaps) out = out.replace(re, to);
  const words = out.split(/\s+/).slice(0, 16).join(' ');
  return words.charAt(0) === 'Y' ? `y${words.slice(1)}` : lowerFirst(words);
}
