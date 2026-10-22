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

**With `ANTHROPIC_API_KEY` (Claude mode):** Claude Haiku 5.5 reads every turn into behaviors, Claude Sonnet 5.5 speaks as the customer in the persona's voice, and Claude Opus 5.5 reviews the whole call and writes the debrief. Certification calls are judged by Claude Fable 5.1. If Claude is unreachable mid-call, the call continues in demo mode and says so.

**With `ELEVENLABS_API_KEY`:** each persona gets a cast ElevenLabs voice with delivery tags ([sighs], [hesitates]), Eleven v3 Conversational first, with automatic fallbacks.

## Not live yet, and why

| Item | State | To finish |
| --- | --- | --- |
| Vercel project | The repo is ready to import (`apps/web/vercel.json` sets everything). Creating it from here needed a one-time permission click from you in Vercel. | Two options in the morning note: approve the link, or import in about three minutes (docs/RUNBOOK.md, section 1). |
| Keys | None were available to me, so Claude and ElevenLabs paths are tested offline with a faked client, not against the live APIs. | Add the two keys in Vercel and redeploy. First real call is the real test. |
| Live mode (LiveKit, sub-second voice) | Agent worker in `apps/agent`. | LiveKit Cloud project, agent host, and the browser client for Live mode. |
| Accounts (Clerk) | Not wired. The Tech / Manager / Owner switch is a demo control; Vercel login or the passcode protects the app. | Add Clerk, map users to companies and roles. |
| Shared storage (Neon) | Schema and migration in `packages/db`. Calls are stored on each device for now. | Create the database, save calls and assignments server-side, real team console. |
| ServiceTitan | Client in `packages/servicetitan` (first names only). "Rehearse your next job" uses a fictional sample job. | Developer app credentials from ServiceTitan, then wire the next appointment into the home screen. |
| Native apps | Tokens are shared in `packages/design/tokens.json`. | iOS and Android shells after the web pilot. |

## Decisions I made without you

1. **Name and brand.** "Sales Coach" as asked. The mark (a rising voice wave) and palette are placeholders pending SRV LAB brand review. Apple-style system: black, white, gray, one blue accent, a soft violet-to-blue gradient only for the customer's voice.
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
- Approve the Vercel step and add the two keys (RUNBOOK sections 1 to 3).
- Decide on the Vercel plan. Hobby is for personal, non-commercial use and only protects preview URLs; a Pro team lets Gardner and SOS owners sign in.
- Brand review with SRV LAB.

## Quality checks run

- Engine unit tests (scripted calls end to end, snapshot and restore, Claude adapters with a faked client).
- Content validator: schemas, cross-references, no em dashes, no AI mentions in customer lines.
- Customer test bench: see `apps/testbench/reports/latest-scripted.md`.
- Production build of the web app and a browser run on a phone-sized screen: onboarding, practice, briefing, a full typed call, end, debrief.
