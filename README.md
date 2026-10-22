# Sales Coach

Practice the call before the call.

Sales Coach is a voice practice app for home service technicians. A real technician talks, out loud, with a customer played by AI: a retiree on a fixed income, a landlord who wants the cheapest fix, a couple who has to agree, a homeowner who got burned last time. The customer pushes back, goes quiet after the price, takes a phone call mid-sentence, and remembers what you said. Then a coach tells you the one thing that worked and the one thing to fix, and you run that moment again.

Built for Gardner Plumbing Co. and SOS Plumbing and Air first, then every shop that sells in the home.

## Try it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

No keys needed. Without keys the app runs in **Demo mode**: the customer engine runs in your browser with rules-based listening, scripted lines, and your browser's built-in voices. Add keys to turn on the real thing:

| Key | Turns on |
| --- | --- |
| `ANTHROPIC_API_KEY` | **Claude mode.** Claude listens, plays the customer, and coaches the debrief. |
| `ELEVENLABS_API_KEY` | Real customer voices (Eleven v4 Turbo, with fallbacks). The name `SALES_COACH_11LABS` also works. |
| `STRIPE_SECRET_KEY` | Checkout in Portal > Billing. |
| `SALES_COACH_PASSCODE` | A team passcode in front of the whole app. |
| `DATABASE_URL`, `SERVICETITAN_*`, `LIVEKIT_*` | Shared storage, job context, and Live mode. See [docs/RUNBOOK.md](docs/RUNBOOK.md). |

Copy `apps/web/.env.example` to `apps/web/.env.local` for local work. In production, keys live in Vercel. Step by step: [docs/RUNBOOK.md](docs/RUNBOOK.md).

## How it works

```
content (YAML)  ->  validated bundle  ->  SessionSpec  ->  hidden customer state
                                                              |
tech speaks -> Perceiver tags behaviors -> state updates (deterministic rules)
                                         -> Director picks what the customer does
                                         -> Voice writes the line in the persona's words
                                         -> TTS speaks it
after the call -> rubric score (instant) -> Claude Coach review (win, one fix, try again)
```

- The **customer's mind is deterministic**: trust, understanding, engagement, urgency, objections, and a hidden real concern move by rules you can read in `packages/engine/src/state.ts`. Claude does the perceiving and the talking, not the deciding, so customers are consistent, testable, and fair.
- The **Director** (`packages/engine/src/director.ts`) runs the moves: objections, silences, step-aways, interruptions, misunderstandings, misplaced confidence, the spouse walking in.
- **Models by role** (`packages/engine/src/providers/claude/config.ts`): Haiku 5.5 listens, Sonnet 5.5 speaks as the customer, Opus 5.5 coaches. `SALES_COACH_PRESET=max` moves the customer to Opus 5.5 fast mode.

## Repo

| Path | What |
| --- | --- |
| `apps/web` | Next.js 16 app: tech home, practice, live call, debrief, drills, progress, team, training day, portal, design system. API routes for turns, voices, coaching, billing. |
| `apps/agent` | Live mode: LiveKit voice agent (WebRTC, Deepgram, ElevenLabs) driving the same engine. |
| `apps/testbench` | The customer test bench: a scripted technician at three levels runs every scenario and checks the customer behaves. |
| `packages/engine` | The customer engine: schemas, state, Director, perception, voice, scoring, Claude adapters. Browser-safe core. |
| `packages/content` | The library: personas, objections, behavior moves, scenarios, drills, rubric, company specs. YAML in, validated JSON out. |
| `packages/design` | Design tokens (one source for web, iOS, Android). |
| `packages/db` | Postgres schema (Neon, Drizzle). |
| `packages/servicetitan` | ServiceTitan client: the next job, first names only. |
| `docs` | Runbook, content authoring guide. |

## Scripts

```bash
pnpm dev                 # web app
pnpm build               # content + tokens + web
pnpm content:validate    # check the library (add -- --strict before shipping content)
pnpm content:build       # rebuild packages/content/generated/bundle.json (commit it)
pnpm design:build        # rebuild tokens CSS
pnpm testbench           # run the customer test bench
pnpm typecheck && pnpm test && pnpm lint
```

## Status

What is done, every decision made overnight, and what needs a human: [STATUS.md](STATUS.md).
