# Runbook

Everything you need to deploy, turn on Claude and voices, and run Sales Coach day to day.

## 1. Put it on the web (Vercel, about 3 minutes)

1. Go to **vercel.com/new**. Under *Import Git Repository*, pick **ArtisanWorkshop-VitalPacific/sales-coach**.
   If it is not listed, click *Adjust GitHub App Permissions* and give Vercel access to that repository.
2. **Project Name:** `sales-coach`.
3. **Root Directory:** click *Edit* and choose `apps/web`. Framework shows Next.js. Leave the build and install settings alone; `apps/web/vercel.json` sets them.
4. Open *Environment Variables* and add your keys now (or later, step 3 below):
   - `ANTHROPIC_API_KEY`
   - `ELEVENLABS_API_KEY`
5. Click **Deploy**. The first build takes about two minutes. Every push to `main` redeploys automatically.

## 2. Keep it private

Your Claude key pays for every call, so lock the door.

- **Vercel Authentication:** Project > Settings > Deployment Protection > Vercel Authentication > On. Choose **All Deployments** if your plan offers it. On the Hobby plan only preview URLs are protected, so also do the next step.
- **Team passcode (works on every plan):** add `SALES_COACH_PASSCODE` with any passphrase, then redeploy. Everyone enters it once per device. Share it only with your team.

## 3. Add or change keys

1. Vercel > your project > **Settings > Environment Variables**.
2. **Add New**: name, value, environments *Production* and *Preview*. Save.
3. **Deployments** > the latest deployment > **...** > **Redeploy**. Keys apply on the next deploy.
4. Check it: open the app, switch to *Owner view* (top right), go to **Portal > Setup**. Claude and ElevenLabs should read *On*. Tap **Run a live test** on each: every model should answer *OK* with its response time. On the call screen the chip reads *Claude · Voice*.

Where to get them:

| Key | Where | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | console.anthropic.com > API Keys | Needs credits on the account. |
| `ELEVENLABS_API_KEY` | elevenlabs.io > Developers > API Keys | A plan with Eleven v3 access. |
| `SALES_COACH_PRESET` | optional | `standard` (default), `max` (Opus 5.5 fast mode plays the customer, about 3x the cost), `economy` (Haiku 5.5). |
| `ELEVENLABS_MODEL_ID` | optional | Default `eleven_v3_conversational`. Falls back to `eleven_v3`, then `eleven_flash_v2_5`. |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com > Developers > API keys | Use a test key first (`sk_test_...`). |
| `SALES_COACH_PASSCODE` | you choose | Optional gate in front of the whole app. |

Never paste keys into chat, email, or the repo. They live only in Vercel (and in `apps/web/.env.local` on a developer machine, which git ignores).

## 4. Using it on a phone

- Open the production URL in **Safari (iPhone)** or **Chrome (Android)**. Share > **Add to Home Screen** makes it feel like an app.
- Allow the microphone when asked. On iPhone, speech recognition needs *Settings > General > Keyboard > Enable Dictation* on.
- Headphones or AirPods make it feel real and keep the customer's voice out of the mic.
- No mic, or a loud shop? Tap the keyboard and type. Everything else works the same.
- Firefox cannot listen yet. Use Chrome, Safari, or Edge.

## 5. Training day (the shop TV)

Switch to *Manager* or *Owner* view, tap the TV icon (or go to `/training-day`). Add the techs, pick how tough, pick a customer. The call runs with big captions; the debrief shows on the TV; today's board ranks the best scores. Use a USB or Bluetooth speakerphone so the room hears the customer and the mic hears the tech.

## 6. What it costs to run

Rough numbers for one 5-minute practice call in Claude mode with the standard preset:

- Claude: about $0.25, most of it the Opus 5.5 coach review. Haiku 5.5 listening and Sonnet 5.5 speaking cost a few cents.
- ElevenLabs: about 1,500 characters of customer voice per call, billed by your ElevenLabs plan.
- Vercel: the app is light. Turns and voices are short serverless calls.

## 7. Editing the content library

Personas, objections, behavior moves, scenarios, drills, the rubric, and company specs are YAML in `packages/content/library`. Rules and examples: [content-authoring.md](content-authoring.md).

```bash
pnpm content:validate -- --strict   # must be clean before you ship
pnpm content:build                  # writes packages/content/generated/bundle.json
pnpm testbench                      # make sure customers still behave
git commit -am "Content: ..." && git push   # Vercel redeploys
```

Every file has a `review.status` (`draft`, `reviewed`, `approved`). Everything written overnight is `draft` until an owner or the strategy team signs off.

## 8. Optional systems

### Live mode (sub-second voice over WebRTC)
`apps/agent` is a LiveKit Agents worker that plays the customer with the same engine (Deepgram Nova-3 listening, ElevenLabs speaking).

1. Create a LiveKit Cloud project. Set `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, plus `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, `DEEPGRAM_API_KEY` on the agent host.
2. On the host: `pnpm install && pnpm rebuild onnxruntime-node && pnpm agent:dev` (or `pnpm --filter @sales-coach/agent start` in production; LiveKit Cloud Agents or any container works).
3. The web client for Live mode is the next build step (see STATUS.md).

### Shared storage (Neon Postgres)
`packages/db` holds the schema and the first migration. Create a Neon database, set `DATABASE_URL`, then `pnpm db:migrate` and `pnpm db:seed`. Wiring the app to save calls there instead of on the device is a listed next step.

### ServiceTitan
`packages/servicetitan` reads the next appointment and maps it to a first-name-only job context. Create an app in the ServiceTitan developer portal, then set `SERVICETITAN_CLIENT_ID`, `SERVICETITAN_CLIENT_SECRET`, `SERVICETITAN_APP_KEY`, `SERVICETITAN_TENANT_ID`, and `SERVICETITAN_ENV` (`integration` or `production`). Until then, *Rehearse a sample job* uses a realistic fictional job.

### Stripe
With `STRIPE_SECRET_KEY` set, Portal > Billing opens Stripe Checkout for an annual license priced by trucks. The Elite build fee is invoiced separately after the scoping call.

## 9. When something is off

| Symptom | Fix |
| --- | --- |
| Call chip says *Demo* after adding the Claude key | Redeploy. Keys apply to new deployments only. |
| Customer voice is robotic | ElevenLabs key missing or out of quota; the browser voice is the fallback. Check Portal > Setup. |
| "Microphone access is blocked" | Allow the mic for the site (iPhone: Settings > Safari > Microphone). Or type. |
| Customer answers slowly | Normal in Claude mode is 1.5 to 3 seconds. Live mode removes most of it. Check Vercel > Logs for errors. |
| "Lost the connection to Claude" | The call continued in demo mode. Check Vercel > Logs > /api/turn and your Anthropic credits. |
| Calls missing on another device | Calls are stored per device until shared storage is on. |
