# Content authoring guide

The content library is the product. The engine only plays what is written here.
This guide is for the head of content and for anyone (human or Claude) adding to the library.

## Where things live

```
packages/content/library/
  registry.yaml            every id; add new ids here first
  personas/<id>.yaml       the AI customers
  moves/objections/<id>.yaml   40 objections in 7 groups
  moves/behaviors/<id>.yaml    20 behaviors (silences, distractions, confusion, probes, intensity)
  scenarios/<id>.yaml      jobs: what is wrong, what is honest to recommend, the options and prices
  drills/<id>.yaml         the 20 drillable moments
  rubric/base.yaml         the ten skills and how each is scored
  companies/<id>.yaml      company specs: process, promises, membership, financing, price ranges
```

Gold examples to copy the level of detail from:

- `personas/margaret-retiree.yaml`
- `moves/objections/need-three-bids.yaml`
- `moves/behaviors/silence-after-price.yaml`
- `scenarios/wh-tank-no-hot-water.yaml`
- `drills/hold-the-silence.yaml`

The schemas are in `packages/engine/src/schema/content.ts`. The behavior ids the engine
can detect are in `packages/engine/src/schema/behaviors.ts`. Use only those ids in
`afterBehaviors`, `passIf`, `failIf`, `resolvingBehaviors`, `hardenedBy`, and `sensitivity`.

Validate after every change:

```
pnpm content:validate          # from the repo root
pnpm content:validate -- --only personas
pnpm content:build             # writes generated/bundle.json for the apps
```

## Principles

1. **Honest selling only.** The product teaches techs to help homeowners understand their
   situation and choose. Model responses never use fear, false urgency, or tricks. A
   customer always pushes back on unneeded work.
2. **Real people, not caricatures.** Customers have reasons. The landlord is careful with
   money because his margins are thin, not because he is a villain. Never write a customer
   from a stereotype about age, ethnicity, gender, or class.
3. **Every move tests one skill** and has a pass and a fail a person could judge from the
   transcript. If you cannot say what passing looks like, the move is not ready.
4. **The customer does not cave to persistence.** Objections soften only when the tech
   addresses the concern behind them.

## Style rules (enforced by the validator where possible)

- No em dashes anywhere. Rewrite the sentence or use a comma or a period.
- Customer lines are spoken, not written: contractions, short sentences, 5 to 25 words,
  an occasional filler. Never a speech.
- Customer lines never mention AI, assistants, scripts, training, or the tech's score.
- Plain, literal language in instructions and coaching. No metaphors in coaching text.
- Mild language only. "Darn" is fine. No slurs, no profanity.
- Model responses are company-neutral. Company specs supply company-specific wording.
- Numbers as a person would say them in lines ("eighteen ninety", "about two grand"),
  digits everywhere else.

## Personas

| Field | Guidance |
| --- | --- |
| card | What the tech sees before the call. One or two sentences. Never reveals hidden state. |
| background | 80 to 200 words. Work, family, money situation, history with contractors, one memorable detail. |
| speech | Pace, register, 3 to 5 fillers, 2 to 4 habits, 5 sample lines in their voice. |
| voice | Voice Design prompt for ElevenLabs, browser voice hints, rate and pitch. |
| hidden.realConcern | The worry under the stated objections. `revealLine` is how they say it once they trust the tech. `revealAtTrust` is 10 to 25 above `startingTrust`. |
| hidden.budgetCeiling | Cash they will spend without financing. Set it so the recommended option in their scenarios sits near or a little above it. |
| hidden.monthlyCeiling | What they would pay per month if financing is explained well. |
| hidden.startingTrust | 30 to 60. Burned customers start low. |
| hidden.decisionThreshold | 50 to 70. Analytical and burned customers need more. |
| hidden.objections | 2 to 4 objection move ids with starting strength 30 to 70. Above 35 blocks a yes until addressed. |
| hidden.facts | 3 to 5 details they drop. Each has the topics that make them say it, and `useValue`: how a strong tech uses it later. |
| sensitivity | Multipliers on behavior effects, 0.3 to 2.0. The engineer barely minds jargon (0.4) and hates bluffing (2.0). |
| movePreferences | Weight 2 or 3 for 4 to 6 behavior moves that fit them; 0 for 1 to 3 that do not. |
| openingLines | 3 lines for when they open the door. |
| secondary | Required when the decision maker is joint or spouse: the other person, their stance, their voice, lines for walking in. |

## Moves

**Triggers.** Use these patterns unless there is a reason not to:

| Kind of move | phases | when |
| --- | --- | --- |
| Price objections | price, objections, close | `priceStated: true` |
| Timing objections | close | `decisionAsked: true` |
| Trust objections | door, discovery, findings, price | often `trustBelow: 50` |
| Competition objections | price, objections, close | `priceStated: true` |
| Scope objections | findings, options, price | `optionsPresented: true` for most |
| Financing objections | price, objections, close | `financingOffered: true` |
| Membership objections | options, price, close, wrapup | `membershipOffered: true` |
| Reactive behavior moves | any | `afterBehaviors: [...]` with priority 80 to 90 |
| Ambient behavior moves | discovery, findings, options | `chance` 0.3 to 0.6, priority 30 to 45 |

**Delivery.** `intent` tells the voice writer what to do in plain words, including what not
to reveal yet. `lines` are 4 natural phrasings. `followUps` are what they say if the
tech's answer is weak. Silence moves need `holdSilenceMs`. Interrupt moves need
`interruptAfterMs`. A move spoken by the second person uses `speaker: secondary`.

**Resolution** (objections only). `concern` is the worry behind the words.
`resolvingBehaviors` lower its strength when the tech does them; `hardenedBy` raise it.

**Evaluate.** `passIf` and `failIf` use behavior ids only. Timing-measured moves (silences)
use `minSilenceMs`. `pass` and `fail` are one plain sentence each, written so a manager
could judge from the transcript.

**Coaching.** `why` explains in two or three sentences why the moment matters.
`modelResponse` is what a strong, honest tech says, in their words, 30 to 80 words.
`commonMistakes` lists 2 to 4 things techs actually do wrong.

## Scenarios

Write real Southern California residential plumbing. Use current California practice
(thermal expansion tanks and two seismic straps on water heater installs, permits on
replacements). Keep prices inside the public ranges in the company specs (for example,
water heater replacement $1,400 to $3,200 for a standard tank). Every scenario has:

- findings a tech would actually find, with severity,
- the honest work (`justifiedWork`) and two or three plausible upsells that are not
  justified (`unjustifiedWork`), so the engine can catch techs who recommend them,
- two or three options with prices, monthly numbers, what each includes, and exactly one
  `recommended: true` (the honest best fit for this home),
- a goal the tech should reach.

## Drills

`why` is a spoken 60-second lesson, 130 to 170 words, in a coach's voice: what the moment
is, what most techs do wrong, what is really happening for the customer, what to do. The
`demo` is a short exchange done right. `priorContext` tells the customer what already
happened so the drill can start mid-call. `techPrompt` is the instruction on screen.

## Review status

Everything written by Claude ships as `status: draft`. The head of content moves it to
`reviewed` after reading it and to `approved` after hearing it in a session. Put anything
that needs checking in `review.notes`.
