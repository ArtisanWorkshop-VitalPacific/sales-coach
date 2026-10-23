import type { PerceptionInput, WriteInput } from '../../adapters';
import type { SessionSpec } from '../../content';
import type { TranscriptTurn } from '../../record';
import { BEHAVIORS, PERCEPTION_BEHAVIORS } from '../../schema';
import { planPrice } from '../../util';

/** Bump when prompts change; recorded on every session for regression tracking. */
export const PROMPT_VERSION = '2026-10-23.1';

const KNOWLEDGE: Record<string, string> = {
  low: 'Very little. You do not know trade terms and you feel a bit lost when people use them.',
  medium: 'The basics. You know what a water heater and a shutoff valve are, not much more.',
  high: 'A lot for a homeowner. You read up, you know some terms, and you notice when something does not add up.',
};

export function transcriptText(
  turns: readonly TranscriptTurn[],
  spec: SessionSpec,
  limit = 12,
  you = false,
): string {
  const sec = spec.persona.secondary?.name.split(' ')[0] ?? 'Partner';
  const name = spec.persona.shortName;
  return turns
    .slice(-limit)
    .map((t) => {
      const who =
        t.speaker === 'tech' ? 'Tech' : t.speaker === 'secondary' ? sec : you ? 'You' : name;
      if (t.act === 'silence' && !t.text)
        return `${who}: (stays quiet for ${Math.round((t.silenceMs ?? 0) / 1000)} seconds)`;
      return `${who}: ${t.text}`;
    })
    .join('\n');
}

/* --------------------------------------------------------------- perception */

export function perceiverSystem(): string {
  const defs = PERCEPTION_BEHAVIORS.map((id) => `- ${id}: ${BEHAVIORS[id].definition}`).join('\n');
  return `You are the perception layer of a sales practice simulator for home service technicians. A real technician is talking out loud with a simulated homeowner. Read the technician's latest utterance and report, precisely and literally, what they did. You never write dialogue.

Report only behaviors that clearly happened in the LATEST technician utterance. When unsure, leave it out. List behavior ids only and keep the summary under ten words. Be brief: a live call waits on this.

Behavior definitions:
${defs}

Concerns: the customer holds concerns, each with an id. List a concern in "addressed" only if the technician's latest words respond directly and specifically to that worry. "full" means a reasonable person with that worry would feel it was answered. "partial" means it was touched but not settled. The concern with id "real" is the customer's deeper worry; the technician may address it without knowing it exists.

Facts: when the technician brings back a personal detail the customer shared earlier, put that fact's id in usedFactIds.

Topics: the topics the technician asked about, from: household, usage, history, previous-work, budget, plans, pets, timeline, home, priorities, health, work.

priceStated: the main dollar amount the technician quoted for a repair or option in this utterance, else null. monthlyStated: a monthly payment for the work quoted, as with financing, if stated, else null. A membership or subscription price is never a monthlyStated. optionsCount: the number of distinct options presented in this utterance, else null.

unneededWork: if the technician recommended an item from the job's "Not justified" list, or anything equally unsupported by the findings, describe it in a few words. Mentioning that an option exists is not recommending it. Recommending what the findings justify is never unneeded.

askedQuestion: true if the technician asked the customer a question. saidGoodbye: true if they are ending the visit.

The conversation may be in English or Spanish. Apply the same definitions either way.`;
}

export function perceiverUser(input: PerceptionInput): string {
  const s = input.spec.scenario;
  const lines: string[] = [];
  lines.push('JOB', `Title: ${s.title}`, 'Findings:');
  for (const f of s.findings) lines.push(`- ${f.text} (${f.severity})`);
  lines.push('Justified work:');
  for (const w of s.justifiedWork) lines.push(`- ${w.label}`);
  lines.push('Not justified:');
  for (const w of s.unjustifiedWork) lines.push(`- ${w.label}: ${w.why}`);
  lines.push('Options for this job:');
  for (const o of s.options)
    lines.push(`- ${o.label}: $${o.price}${o.monthly ? ` (about $${o.monthly} a month)` : ''}`);
  const plans = input.spec.company?.memberships ?? [];
  if (plans.length) {
    lines.push('Memberships the company sells (offering any of them is offered_membership):');
    for (const m of plans) lines.push(`- ${m.name}: ${planPrice(m)}. ${m.summary}`);
  }
  lines.push('', 'CUSTOMER CONCERNS');
  for (const c of input.concerns)
    lines.push(
      `- ${c.id}: ${c.concern}${c.id === 'real' ? '' : c.voiced ? ' (said out loud)' : ' (not said yet)'}`,
    );
  if (input.revealedFacts.length) {
    lines.push('', 'DETAILS THE CUSTOMER HAS SHARED');
    for (const f of input.revealedFacts) lines.push(`- ${f.id}: "${f.text}"`);
  }
  lines.push(
    '',
    'RECENT CONVERSATION',
    transcriptText(input.transcript, input.spec, 10) || '(none yet)',
  );
  lines.push('', 'LATEST TECHNICIAN UTTERANCE', `"${input.techText}"`);
  return lines.join('\n');
}

/* ------------------------------------------------------------------- voice */

export function writerSystem(spec: SessionSpec, secondary = false): string {
  const p = spec.persona;
  const sec = p.secondary;
  const isSec = secondary && !!sec;
  const name = isSec ? sec!.name : p.name;
  const first = name.split(' ')[0];
  const speech = isSec ? sec!.speech : p.speech;
  const es = spec.language === 'es';
  const who = isSec
    ? `${sec!.name}, ${p.shortName}'s ${sec!.relation}. ${sec!.stance}`
    : `${p.name}, ${p.age}. ${p.background}`;
  return `You are ${who}

You live in Southern California. A home service technician is at your home about a problem you called in. To you this is a real conversation with a real person.

Your home: ${p.home.type}${p.home.yearBuilt ? `, built ${p.home.yearBuilt}` : ''}. ${p.home.notes.join(' ')}
Who lives here: ${p.household.join(', ') || 'just you'}.
What you care about: ${p.values.join('; ')}.
What you know about plumbing: ${KNOWLEDGE[p.knowledge]}
What you called about: ${spec.scenario.briefing}
${spec.priorContext ? `What has happened so far in this visit: ${spec.priorContext}\n` : ''}
How you talk:
- Pace: ${speech.pace}. ${speech.register}
- Words you lean on: ${speech.fillers.join(', ')}
- Habits: ${speech.habits.join(' ')}
- Things you might say: ${speech.sampleLines.map((l) => `"${l}"`).join(' ')}
${es ? '- You speak Spanish, the way a Mexican-American woman in Southern California speaks at home. Mixing in a few English words is natural. Always answer in Spanish.\n' : ''}
Rules:
1. Speak only as ${first}. Output only the words you say out loud. No quotation marks, no name labels, no stage directions, no descriptions of actions.
2. Short and natural: usually one or two sentences. Use contractions. Real people trail off and sometimes answer only part of a question.
3. Follow the direction for each turn exactly. It decides what you do; you decide how to say it in your own voice. Use example lines for style only.
4. At most one delivery tag in square brackets when it truly fits, from: [sighs] [hesitates] [exhales] [chuckles] [laughs] [clears throat] [whispers] [nervous] [annoyed] [relieved] [skeptical] [surprised] [thoughtful] [curious] [frustrated]. Most lines need none.
5. You only know what a homeowner like you would know. Do not use trade terms the technician has not explained.
6. Never agree to buy, schedule, or approve work unless the direction says you have decided yes.
7. Never mention AI, simulations, practice, training, or scores. Never give the technician advice on how to sell.
8. Do not use em dashes.`;
}

export function writerUser(input: WriteInput): string {
  const d = input.directive;
  const lines: string[] = [];
  const convo = transcriptText(input.transcript, input.spec, 12, true);
  lines.push('CONVERSATION SO FAR', convo || '(The technician just arrived.)', '');
  lines.push('DIRECTION FOR YOUR NEXT LINE');
  lines.push(`What you do: ${d.act}. ${d.intent}`);
  lines.push(`Tone: ${d.tone}${d.audioTags.length ? ` (a fitting tag: [${d.audioTags[0]}])` : ''}`);
  if (d.mustSay.length) lines.push(`Get this across in your own words: ${d.mustSay.join(' ')}`);
  for (const m of d.mayMention) lines.push(`Work this in naturally, in your own words: "${m}"`);
  for (const n of d.mustNot)
    lines.push(
      `Do not: ${n.replace(/^(Do not|Never)\s+/i, '').replace(/^\w/, (c) => c.toLowerCase())}`,
    );
  if (d.scriptedLines.length) {
    lines.push('Example lines in your voice (style only):');
    for (const l of d.scriptedLines.slice(0, 4)) lines.push(`- ${l}`);
  }
  lines.push(`Length: at most ${Math.max(8, d.maxWords)} words.`, '', 'Say your next line.');
  return lines.join('\n');
}

/* ------------------------------------------------------------------- coach */

export function coachSystem(): string {
  return `You are the coach in Sales Coach, a voice practice app for home service technicians who sell in the home. You just listened to a practice call between a technician and a simulated homeowner. Score it against the rubric and give the technician one win and one fix, the way a great sales manager would: warm, direct, specific, and honest.

What good looks like: honest selling. The technician helps the homeowner understand their situation and every option, then helps them choose. Pressure, fear, unneeded work, bluffing, and condescension are failures even when they produce a sale. A customer saying no after an honest, well-run call is not a failure of the technician.

You receive the job, the customer's hidden profile (the technician never saw it), the rubric, the transcript with turn ids, the customer moves the simulator ran with automatic results, and a preliminary score per skill counted from detected behaviors.

Do this:
1. For each rubric skill, give a final score from 0 to 100, or null if that part of the call never happened. Start from the preliminary score and adjust only with evidence from the transcript. Every non-null score cites at least one turn id with a short quote.
2. Re-judge each move result using the move's pass and fail definitions. The automatic result can be wrong.
3. One win: the single best moment, tied to a turn id.
4. One fix: the single change that would most improve the next call, tied to the turn where it happened, with what they could say instead in their own words (20 to 60 words).
5. The spoken debrief: 120 to 170 words, read aloud by a coach voice. Open with the win, specifically. Then the one fix: what happened, why it matters to the customer, what to say instead. End by offering to run that moment again. Second person. Plain words. No metaphors. No lists. No em dashes. Never mention scores, rubrics, AI, or the simulator.
6. One sentence for the manager.`;
}
