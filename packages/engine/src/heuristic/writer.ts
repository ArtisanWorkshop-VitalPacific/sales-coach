import type { LineWriter, WriteInput } from '../adapters';
import { cleanLine } from '../adapters';
import { AudioTag } from '../schema';
import { createRng, type Rng } from '../util';

const GENERIC_EN: Record<string, string[]> = {
  history: [
    'It’s been acting up a little for a while, but it really went out yesterday.',
    'I first noticed it a couple days ago.',
  ],
  usage: ['Pretty normal, I’d say. Showers, laundry, dishes.', 'Nothing unusual. The regular stuff.'],
  household: ['It’s just us here.', 'Not a big household, no.'],
  budget: ['I’d like to keep it reasonable, you know?', 'I don’t have a number, I just don’t want surprises.'],
  plans: ['We’ll probably be here a while.', 'No plans to move, no.'],
  priorities: ['I just want it fixed right, and I don’t want any surprises.', 'Honestly? That it lasts.'],
  timeline: ['As soon as possible, honestly.', 'Sooner is better.'],
  'previous-work': ['Nobody’s been out for this one yet.', 'Not for this, no.'],
  home: ['We’ve been here a good while now.', 'A long time. It’s home.'],
  pets: ['Just watch the door, please.', 'They’ll stay out of your way.'],
  work: ['I work, so I’m not home a lot.', 'Busy, you know.'],
  default: ['Okay.', 'Mm-hm.', 'Mm-hm. Go ahead.', 'All right.'],
};
/** "What's going on?" answers, by kind of job. Claude improvises these from the scenario; the demo uses these. */
const PROBLEM_EN: [RegExp, string[]][] = [
  [/water-heater|tankless|hot-water|anode|wh-/, [
    'Well, the hot water just quit. It was lukewarm for a day or so, and now it’s ice cold.',
    'It’s been making this rumbling noise for a while, and now the water’s barely warm. I don’t really know what’s wrong with it.',
    'Honestly, I just know something’s off with the water heater. That’s why I called.',
  ]],
  [/drain|sewer|clog|backup|toilet/, [
    'It keeps backing up. I clear it, and a few days later it’s doing it again.',
    'The drain’s been slow for weeks, and now it’s just standing water.',
  ]],
  [/leak|slab|repipe|pipe/, [
    'There’s water where there shouldn’t be, and my water bill jumped. I don’t know where it’s coming from.',
    'I keep finding a wet spot, and I’m worried it’s something big.',
  ]],
  [/gas/, ['I smelled gas near the water heater, so I shut the valve and called you.', 'There was a gas smell this morning. It scared me.']],
];
const PROBLEM_ES: [RegExp, string[]][] = [
  [/water-heater|tankless|hot-water|anode|wh-/, ['Pues, ya no sale agua caliente. Primero salía tibia y ahora sale bien fría.', 'Hace ruidos desde hace tiempo y ahora casi no calienta.']],
  [/drain|sewer|clog|backup|toilet/, ['Se tapa a cada rato. Lo destapo y a los días otra vez.']],
  [/leak|slab|repipe|pipe/, ['Hay agua donde no debería, y el recibo del agua subió mucho.']],
];

const GENERIC_ES: Record<string, string[]> = {
  history: ['Empezó hace unos días, pero ayer ya no salía agua caliente.', 'Desde ayer en la mañana.'],
  usage: ['Lo normal. Bañarnos, lavar ropa, los trastes.'],
  household: ['Somos pocos aquí en la casa.'],
  budget: ['Pues, no quiero gastar de más, ¿me entiende?'],
  plans: ['Aquí nos vamos a quedar.'],
  priorities: ['Que quede bien hecho, y que no haya sorpresas.'],
  timeline: ['Lo más pronto posible.'],
  'previous-work': ['No, nadie ha venido para esto.'],
  home: ['Ya tenemos muchos años en esta casa.'],
  pets: ['Nomás cuidado con la puerta.'],
  work: ['Trabajo, casi no estoy en la casa.'],
  default: ['Okay.', 'Sí.', 'Ajá.', 'Bueno.'],
};

const REACT_EN: Record<string, string[]> = {
  door: ['Sure, come on in. It’s right through here.', 'Okay. It’s this way.'],
  discovery: ['Okay.', 'Mm-hm.', 'Sure, ask away.'],
  findingsLow: ['I’m sorry, what does that mean?', 'Can you say that in plain English?', 'I don’t really follow.'],
  findings: ['Okay. So what are my options?', 'Okay, I see it. What do we do?'],
  options: ['Okay. Which one would you do?', 'What’s the difference between those?', 'Hm. Tell me more about the middle one.'],
  priceHigh: ['That’s more than I was hoping.', 'Oh. That’s a lot.', 'Hm. That’s more than I expected.'],
  price: ['Okay. And that’s everything?', 'All right. What does that include?'],
  objectionsOpen: ['I don’t know...', 'I hear you, I just still don’t feel great about it.', 'Hm.'],
  objectionsSettled: ['Okay. That helps.', 'All right, that makes sense.', 'Okay, I feel better about that.'],
  close: ['Hm.', 'Okay.', 'Let me think.'],
  wrapup: ['Okay.', 'Sounds good.', 'All right.'],
};
const REACT_ES: Record<string, string[]> = {
  door: ['Pase, pase. Está por acá.'],
  discovery: ['Okay.', 'Ajá.'],
  findingsLow: ['Perdón, ¿qué quiere decir eso?', '¿Me lo explica más sencillo?'],
  findings: ['Okay. ¿Y qué opciones tengo?'],
  options: ['¿Y usted cuál haría?', '¿Cuál es la diferencia?'],
  priceHigh: ['Uy, es más de lo que pensaba.', 'Es mucho dinero.'],
  price: ['Okay. ¿Eso es todo?', '¿Y qué incluye?'],
  objectionsOpen: ['No sé...', 'Sí le entiendo, pero todavía no me convence.'],
  objectionsSettled: ['Okay, eso me ayuda.', 'Ah, bueno. Así sí.'],
  close: ['Mm.', 'Déjeme pensar.'],
  wrapup: ['Okay.', 'Está bien.'],
};

/** Picks content-authored lines. Used in demo mode and the test bench. */
export class ScriptedWriter implements LineWriter {
  readonly name = 'scripted';
  private used = new Set<string>();
  private rng: Rng;

  constructor(seed = 7) {
    this.rng = createRng(seed);
  }

  async write(input: WriteInput): Promise<string> {
    const { directive: d, spec, state } = input;
    if (d.act === 'silence') return '';
    const es = spec.language === 'es';
    let line: string | undefined;
    if (d.verbatim && d.scriptedLines[0]) return d.scriptedLines[0];

    if (d.scriptedLines.length > 0) line = this.fresh(d.scriptedLines);
    else if (d.act === 'answer') {
      const fact = d.mayMention[0];
      if (fact) return cleanLine(fact, AudioTag.options);
      const lastTech = [...input.transcript].reverse().find((t) => t.speaker === 'tech');
      const topic = topicOf(lastTech?.text ?? '');
      const bank = es ? GENERIC_ES : GENERIC_EN;
      if (topic === 'problem') {
        const job = `${spec.scenario.jobType} ${spec.scenario.id}`;
        const hit = (es ? PROBLEM_ES : PROBLEM_EN).find(([re]) => re.test(job));
        line = this.fresh(hit?.[1] ?? (es ? ['La verdad, nomás sé que algo no está bien. Por eso le llamé.'] : ['Honestly, I just know it’s not working right. That’s why I called you.']));
      } else line = this.fresh(bank[topic] ?? bank.default!);
    } else {
      const bank = es ? REACT_ES : REACT_EN;
      let key: string = state.phase;
      if (state.phase === 'findings' && state.understanding < 40) key = 'findingsLow';
      if (state.phase === 'price' && state.priceHeard !== null && state.priceHeard > spec.persona.hidden.budgetCeiling) key = 'priceHigh';
      if (state.phase === 'objections') {
        const open = state.objections.some((o) => o.status !== 'resolved' && o.status !== 'latent' && o.strength > 35);
        key = open ? 'objectionsOpen' : 'objectionsSettled';
      }
      line = this.fresh(bank[key] ?? bank.discovery!);
    }
    if (d.mayMention[0] && line && line.split(/\s+/).length < 12) line = `${line} ${d.mayMention[0]}`;
    if (d.audioTags[0] && line && !line.startsWith('[')) line = `[${d.audioTags[0]}] ${line}`;
    return cleanLine(line ?? '', AudioTag.options);
  }

  private fresh(lines: string[]): string {
    const unused = lines.filter((l) => !this.used.has(l));
    const pick = this.rng.pick(unused.length ? unused : lines) ?? '';
    this.used.add(pick);
    return pick;
  }
}

function topicOf(text: string): string {
  const t = text.toLowerCase();
  if (/what('?s| is| has) (been )?(going on|happening)|what happened|what('?s| is) (the )?(problem|issue)|tell me (about|what)|walk me through|what are you (noticing|seeing|hearing)|what brings|qué (pasó|está pasando)/.test(t)) return 'problem';
  if (/how long has|when did|how old|first notice|before/.test(t)) return 'history';
  if (/how (much|often)|shower|laundry|use/.test(t)) return 'usage';
  if (/who (lives|else)|family|kids|people/.test(t)) return 'household';
  if (/budget|spend|afford/.test(t)) return 'budget';
  if (/plan|staying|selling|future/.test(t)) return 'plans';
  if (/important|matter|priority|looking for/.test(t)) return 'priorities';
  if (/how soon|when do you need|timeline/.test(t)) return 'timeline';
  if (/company|plumber|anyone|installed/.test(t)) return 'previous-work';
  if (/lived|house|home/.test(t)) return 'home';
  if (/dog|cat|pet/.test(t)) return 'pets';
  if (/work|job/.test(t)) return 'work';
  return 'default';
}
