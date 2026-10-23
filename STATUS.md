# Status

Built overnight on October 22, 2026. This is the honest state of the product: what works, every decision made without you, and what needs a human.

## What works today

**No keys needed (Demo mode).** Open the app on a phone or laptop and run a real practice call:

- **Tech home:** today's drill, your next call, rehearse a sample job, streak, average, recent calls.
- **Practice:** every scenario with persona, job, and difficulty; a briefing with what you know walking in, what you found, your price book, and your goal; difficulty 1 to 5 and company process picker.
- **Live call:** the customer greets you, answers, reacts, objects, goes quiet after the price, steps away for a phone call, interrupts, and decides. Hands-free voice (browser speech recognition), tap-to-talk, or typing. Captions on or off.
- **Debrief:** instant rubric score, pass or not, what the customer decided, what worked, one thing to fix with words to try, "Try that moment again", skills with evidence, customer moments handled or missed, the full call, and a spoken debrief.
- **Drills:** the moment-by-moment track with a spoken lesson, a demo exchange, pass criteria, and a live rep.
- **Progress:** level (Apprentice to Master), score trend, skills over the last 10 calls with change, every call.
- **Team (manager view):** sample team digest, skill heatmap, roster, assign drills, plus this device's calls.
- **Training day:** big-screen mode for the shop TV with a roster and today's board.
- **Portal (owner view):** company specs for Gardner, SOS, and the fictional demo shop; the full objection library; the plan builder with live pricing and Stripe Checkout; setup status for every integration.
- **Design system:** `/design` shows every token and component.
- **Settings:** profile, captions, hands-free, interruptions, turn timing, voice and brain, theme, clear history.

**With `ANTHROPIC_API_KEY` (Claude mode):** Claude Haiku 5.5 reads every turn into behaviors, Claude Sonnet 5.5 speaks as the customer in the persona's voice, and Claude Opus 5.5 reviews the whole call and writes the debrief. Certification calls are judged by Claude Fable 5.1. If Claude's read of a turn takes more than 3 seconds, the rules read that turn so the customer never stalls. If Claude is unreachable mid-call, the call continues in demo mode and says so.

**With `ELEVENLABS_API_KEY`** (the name `SALES_COACH_11LABS` also works): each persona gets a cast ElevenLabs voice with delivery tags ([sighs], [hesitates]), Eleven v4 Turbo first, with automatic fallbacks to v3 and Flash.

**Live since October 22** at https://sales-coach-six-ruby.vercel.app with both keys, tested end to end against the real APIs (see Quality checks).

## Not live yet, and why

| Item | State | To finish |
| --- | --- | --- |
| Passcode | Not set, so anyone with the link can run calls on the Claude key. The Hobby plan does not protect production URLs. | Add `SALES_COACH_PASSCODE` in Vercel and redeploy before sharing the link. |
| Live mode (LiveKit, sub-second voice) | Agent worker in `apps/agent` and the browser side at `/live` (token route, captions, end-of-call record). The call screen offers it once LiveKit keys are set. | LiveKit Cloud project and an agent host; first live run. |
| Accounts (Clerk) | Not wired. The Tech / Manager / Owner switch is a demo control; Vercel login or the passcode protects the app. | Add Clerk, map users to companies and roles. |
| Shared storage (Neon) | Schema and migration in `packages/db`. Calls are stored on each device for now. | Create the database, save calls and assignments server-side, real team console. |
| ServiceTitan | Client in `packages/servicetitan` (first names only). "Rehearse your next job" uses a fictional sample job. | Developer app credentials from ServiceTitan, then wire the next appointment into the home screen. |
| Native apps | Tokens are shared in `packages/design/tokens.json`. | iOS and Android shells after the web pilot. |

## Decisions I made without you

1. **Name and brand.** "Sales Coach" as asked. The mark (a rising voice wave) is a placeholder pending SRV LAB brand review. Since October 23 the look is white, grey, and white glass, with the palette, type sizes, radii, and shadows taken from elevenlabs.io: eggshell #FDFCFC, stone #F5F3F1 and #EBE8E4, text from black to #A59F97, and black for every action. Inter stands in for ElevenLabs' licensed Waldenburg, with headlines in Inter Light. Color lives in the orbs: every customer is a grainy gradient orb, eight palettes sampled pixel by pixel from the ElevenLabs voice orbs, the same orb for the same customer every time. Orange #FF4704 marks work to do and red #F41A2F marks a miss. Light is the default; Dark and Match device are in Settings.
2. **Next.js 16** (current) instead of 15 from the plan. Same architecture.
3. **One engine, in TypeScript, everywhere.** The browser demo, the server, the LiveKit agent, and the test bench all drive the same `CustomerSession`. That is why the Live mode agent is TypeScript (LiveKit Agents for Node) instead of Python.
4. **The customer's mind is rules, not vibes.** Trust, understanding, urgency, objections, and the hidden real concern change by readable rules. Claude perceives and speaks; it does not decide whether the customer buys. Customers stay consistent, scores stay fair, and the test bench can prove it.
5. **Haiku 5.5 listens, Sonnet 5.5 speaks** in the standard preset. Listening is a classification job where speed matters most; the voice is where quality shows. `SALES_COACH_PRESET=max` moves listening to Sonnet 5.5 and the customer to Opus 5.5 fast mode.
6. **Stateless server.** Each turn carries the call's snapshot, so any server instance can answer and nothing needs a database on day one.
7. **Calls stay on the device** until shared storage is on. Privacy by default, zero setup.
8. **Browser speech recognition** for v1 (Chrome, Safari, Edge). Firefox falls back to typing. Live mode uses Deepgram Nova-3.
9. **Voices:** ElevenLabs default library voices cast per persona (`apps/web/lib/voices.ts`). Custom-designed voices are a later polish step; each persona already carries a voice design prompt.
10. **Demo shop is fictional:** Summit Plumbing & Air. Gardner and SOS specs are drafted from their public websites and marked for owner review.
11. **Pricing in the app matches the plan:** $990 / $1,990 / $3,990 a month by truck band, billed annually, pooled minutes, $0.15 a minute overage, Pro +40 percent, Elite $30,000 build plus $15,000 a year, seminars $7,500 a day. Stripe prices are computed at checkout, so nothing has to be set up in Stripe first.
12. **A passcode gate** (`SALES_COACH_PASSCODE`) in addition to Vercel login, because the Hobby plan only protects preview URLs and your Claude key pays for every call.
13. **Objections answered early stay answered.** When a tech answers a worry before the customer raises it, she does not raise it as if she never heard it. A full answer settles it and counts as handled. A scenario's must-have objection still comes up, as a follow-up to what the tech said.

## Needs a human

**Owners (Gardner and SOS):**
- Gardner: review counts and rating (the site shows different numbers), ownership dates (family since 2020, business since 1995), the Shield membership's monthly billing and cancellation terms, the 12-month financing rate (a placeholder on the site), HVAC and electrical license numbers (placeholders on the site), how permits show on estimates, how to handle American Home Shield customers.
- SOS: the labor warranty in years (the site says "twice as long"), fees ("free" quotes alongside a dispatch fee; "No OT fees" next to a $149 to $249 after-hours fee), financing lender and terms, whether a membership exists, which brands you install, haul-away, and the home base (Lake Elsinore or Redlands).
- Both: the assumed sales facts in the objection library (set per-job pricing, tech pay partly tied to sales, no standing discounts).

**Content review (strategy team):**
- Every persona, move, scenario, and drill is `review.status: draft`.
- Rosa's Spanish lines need a native Southern California Spanish speaker.
- Budget ceilings for Rick, Devin, and Morgan sit below the standard tank on purpose (financing and options are the lesson). Paul's budget will not cover a full repipe.
- Code and rebate facts to verify: expansion tank requirements in the model responses; the federal 25C heat pump credit (treated as ended after 12/31/2025, scenarios say "rebates may apply, verify current amounts"); California's $1,000 limit for unlicensed work in the handyman objection.
- The warranty scenario's $795 code-items price sits outside the company price ranges.
- Greg (selling the house): the right answer on disclosure is "ask your agent", never legal advice.

**You:**
- Add `SALES_COACH_PASSCODE` before sharing the link.
- Decide on the Vercel plan. Hobby is for personal, non-commercial use and only protects preview URLs; a Pro team lets Gardner and SOS owners sign in.
- Brand review with SRV LAB.

## The library

12 personas, 40 plumbing objections in 7 groups, 20 customer behaviors (silences, step-aways, interruptions, misunderstandings, misplaced confidence, the spouse walking in), 30 scenarios, 20 drills, the base rubric (10 skills, 4 levels), and specs for Gardner, SOS, and Summit (fictional). All validated, all `draft` for review.

## Quality checks run

- **Live on production (October 22).** All three Claude models answered with the exact settings a call uses. All 12 customer voices play on Eleven v4 Turbo, first audio in about 0.3 seconds. Two full practice calls ran through the live API: the customer stepped away for a phone call, went quiet after the price, followed up on the home warranty, and decided. The Opus coach reviewed a call in 20 seconds with specific, correct fixes.
- **Customer test bench: PASS.** 1,680 scripted calls across all 30 scenarios and 20 drills, three technician levels, two difficulties, six seeds. Expert techs get a yes 91 percent of the time and score 89; solid techs 74 percent and 72; novices 0 percent and 29. Persistence without progress never became a yes (314 repeat asks). Recommending unneeded work never ended in a yes. No state out of range, no em dashes or AI mentions in customer lines. Report: `apps/testbench/reports/latest-scripted.md`.
- Engine unit tests: scripted calls end to end, snapshot and restore, Claude adapters against a faked client. ServiceTitan client tests including a no-personal-data test.
- Content validator: schemas, cross-references, no em dashes, no AI mentions in customer lines.
- An independent review of the Claude path before first use. All six findings are fixed: structured outputs no longer fail on one stray value, rejected API settings are remembered instead of retried every turn, each turn has strict time limits, the call loop ignores stale playback, the voice has start and length timeouts, and iPhone and Safari play whole audio files.
- A clean clone installs and builds with the exact Vercel commands.
- Browser runs on a phone-sized screen: onboarding, practice, briefing, a full call, a drill (price, held silence, pass), Spanish, debriefs, team, portal, design system, dark mode.

## Test these first on an iPhone

- Hands-free listening may need a tap on the mic each turn. Safari only lets a page listen after a tap. The call screen asks for the tap when it is needed.
- Use headphones or AirPods. Right after the mic closes, an iPhone can play the customer through the earpiece instead of the speaker.
- In Settings > General > Keyboard, Enable Dictation must be on for the browser to hear you.

## Known gaps

- **Latency in Claude mode,** measured on production: about 3 seconds of Claude time per turn (Haiku listening 1.2 to 2 seconds, Sonnet speaking 1.2 to 1.6), plus about 0.3 seconds for the voice to start. Hands-free adds the 1.1-second pause that ends your turn (Settings > Pause before your turn ends). Natural for an in-home pause, slower than a phone call. Next steps: start the voice on the customer's first sentence while the rest is written, and Live mode for sub-second.
- **Demo mode's listening is rules-based.** It misses some upsells ("replace the pressure regulator") and occasionally flags an honest line. Claude mode reads meaning, not keywords.
- **The scripted expert in the test bench never offers a membership**, so membership moves are lightly tested.
- **ServiceTitan endpoint paths** are from the public API layout; the developer docs needed a login, so query filters are marked "verify" in code.
- **The database** schema and migration are generated but have not run against a live Neon database.
- **The Live mode agent** typechecks against LiveKit Agents 1.9.3; it has not run (no LiveKit keys).

## Roadmap

- **Learn from real conversations** (Matt, October 22). Train on recordings of in-person visits and customer calls, alongside the objection lists. Each recording is transcribed and cut to first names. Claude then drafts new objections in your customers' own words, persona traits, and the lines your best techs use that work. Every draft goes to an owner for approval, the same review the library uses now. The same rubric and coach can score real calls, so practice and the field show on one progress chart. This works by adding to the content library, not retraining a model, which matches the plan's position of no fine-tuning at launch. Needs: a consent process (California requires every party's consent to record a private conversation), an upload or a feed of ServiceTitan call recordings, and shared storage.
- **The voice starts on the first sentence** while the rest of the line is still being written.
- **Accounts, shared storage, ServiceTitan, Live mode:** see Not live yet.

## Content notes from the overnight review

- Fixed overnight: Jen's persona and the drain-kitchen-recurring scenario disagreed about who tried to clear the drain. Dan now ran the store-bought snake, which matches both.
- hard-water-softener recommends the $2,350 softener over the $285 descale. Lower the tested hardness if descale-only should win.
- Code rules cited in scenarios need a licensed eye: the 80 psi regulator rule, 2-inch shower drains, anti-scald valves, expansion tanks.
- Remodel prices are estimates (no public range). The slab leak scenario does not price the leak detection visit.
