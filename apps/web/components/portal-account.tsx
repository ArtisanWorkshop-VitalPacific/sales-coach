'use client';

import { Check, CircleCheck, Copy, Lock } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import type { Capabilities } from '@/lib/capabilities';
import { contentIndex } from '@/lib/content';
import { BANDS, OVERAGE_PER_MINUTE, quote, SEMINAR_PER_DAY, type TierId, TIERS, usd } from '@/lib/pricing';
import { useProfile } from '@/lib/store';
import { useCapabilities } from '@/lib/use-capabilities';
import { Button, Card, Chip, cn, Section, Skeleton } from './ui';

/* ================================================================ Billing */

const MAX_SLIDER = 80;
const TIER_IDS = Object.keys(TIERS) as TierId[];
const LARGEST_BAND = BANDS[BANDS.length - 1]!.max;

export function BillingTab({ checkout }: { checkout: string | null }) {
  const { caps, loaded } = useCapabilities();
  const [profile] = useProfile();
  const [trucks, setTrucks] = useState(12);
  const [draft, setDraft] = useState('12');
  const [tier, setTier] = useState<TierId>('pro');
  const [shop, setShop] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const companyName = contentIndex().company(profile.companyId)?.name ?? '';
  const q = quote(tier, trucks);
  const billing = !!caps?.billing;

  const setCount = (n: number) => {
    const v = Math.max(1, Math.min(999, Math.round(n)));
    setTrucks(v);
    setDraft(String(v));
  };

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tier, trucks, company: (shop.trim() || companyName).slice(0, 120) }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || 'Checkout did not open. Try again.');
      window.location.assign(json.url);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div>
      {checkout === 'success' && (
        <div className="reveal mb-8 flex items-start gap-3 rounded-lg bg-positive-soft p-5">
          <CircleCheck className="mt-0.5 shrink-0 text-positive" size={20} />
          <div>
            <p className="t-body font-semibold text-ink">You&rsquo;re in.</p>
            <p className="t-callout text-ink-2">Your license is active. Stripe is sending the receipt.</p>
          </div>
        </div>
      )}
      {checkout === 'cancel' && (
        <div className="reveal mb-8 rounded-lg bg-surface-2 p-5 ring-1 ring-line">
          <p className="t-body font-semibold text-ink">Checkout canceled.</p>
          <p className="t-callout text-ink-3">Nothing was charged. Your plan is right where you left it.</p>
        </div>
      )}

      <Section title="Build your plan">
        <Card className="p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <label htmlFor="trucks" className="t-callout font-semibold text-ink-3">
                Trucks on the road
              </label>
              <p className="t-caption text-ink-4">One license covers every tech in every truck.</p>
            </div>
            <div className="flex items-baseline gap-2">
              <input
                id="trucks"
                inputMode="numeric"
                value={draft}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                  setDraft(v);
                  const n = Number.parseInt(v, 10);
                  if (Number.isFinite(n) && n >= 1) setTrucks(Math.min(999, n));
                }}
                onBlur={() => setDraft(String(trucks))}
                className="t-title w-24 rounded-md border hairline bg-surface-2 px-3 py-1.5 text-right tabular-nums text-ink outline-none focus:border-accent"
                aria-label="Number of trucks"
              />
              <span className="t-body text-ink-3">{trucks === 1 ? 'truck' : 'trucks'}</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={MAX_SLIDER}
            step={1}
            value={Math.min(trucks, MAX_SLIDER)}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-6 w-full accent-[var(--sc-color-accent)]"
            aria-label="Trucks"
          />
          <div className="t-caption mt-2 flex justify-between text-ink-4">
            <span>1</span>
            {BANDS.map((b) => (
              <span key={b.id} className={cn('hidden sm:inline', q.band?.id === b.id && 'font-semibold text-ink-2')}>
                {b.label}
              </span>
            ))}
            <span>{MAX_SLIDER}+</span>
          </div>
        </Card>
      </Section>

      <Section title="Pick a tier">
        <div className="grid gap-5 lg:grid-cols-3">
          {TIER_IDS.map((id) => {
            const t = TIERS[id];
            const tq = quote(id, trucks);
            const on = tier === id;
            return (
              <Card
                key={id}
                onClick={() => setTier(id)}
                className={cn('flex cursor-pointer flex-col p-6 transition-shadow md:p-7', on ? 'ring-2 ring-accent' : 'ring-1 ring-transparent hover:ring-line-strong')}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="t-headline text-ink">{t.name}</p>
                  {on && <Chip tone="accent">Selected</Chip>}
                </div>
                <p className="t-callout mt-1 text-ink-3">{t.tagline}</p>
                <div className="mt-5">
                  {tq.custom ? (
                    <p className="t-title text-ink">Custom</p>
                  ) : (
                    <p className="t-title tabular-nums text-ink">
                      {usd(tq.monthly)}
                      <span className="t-callout font-normal text-ink-3"> a month</span>
                    </p>
                  )}
                  <p className="t-caption text-ink-4">
                    {tq.custom ? 'Per location, for 61 trucks and up' : 'Billed annually'}
                    {id === 'elite' && ` · plus ${usd(TIERS.elite.build)} build`}
                  </p>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {t.includes.map((x) => (
                    <li key={x} className="t-callout flex gap-2.5 text-ink-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-positive" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    className={cn('btn btn-sm w-full', on ? 'btn-primary' : 'btn-secondary')}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTier(id);
                    }}
                    aria-pressed={on}
                  >
                    {on ? `${t.name} selected` : `Choose ${t.name}`}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Your quote">
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="relative overflow-hidden rounded-xl bg-[#000] p-7 text-[#f5f5f7] shadow-float md:p-10 lg:col-span-3">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-voice opacity-25 blur-3xl" />
            <p className="t-callout font-semibold text-[#a1a1a6]">
              Sales Coach {TIERS[tier].name} · {trucks} {trucks === 1 ? 'truck' : 'trucks'}
            </p>
            {q.custom ? (
              <>
                <h3 className="t-display mt-3">Custom, per location.</h3>
                <p className="t-body mt-3 max-w-md text-[#a1a1a6]">
                  Over {LARGEST_BAND} trucks, we price each location on its own. Our sales team builds the plan with you.
                </p>
                <div className="mt-8">
                  <Button disabled aria-label="Talk to the sales team. Contact opens soon.">
                    Talk to us
                  </Button>
                  <p className="t-caption mt-3 text-[#a1a1a6]">For the sales team. Direct contact opens soon.</p>
                </div>
              </>
            ) : (
              <>
                <h3 className="t-display mt-3 tabular-nums">
                  {usd(q.monthly)}
                  <span className="t-body-lg font-normal text-[#a1a1a6]"> a month</span>
                </h3>
                <dl className="mt-8 space-y-3 border-t border-white/15 pt-6">
                  <QuoteLine label="License, billed annually" value={`${usd(q.annual)} a year`} />
                  <QuoteLine label="Pooled practice minutes" value={`${q.pooledMinutes.toLocaleString('en-US')} a month`} />
                  <QuoteLine label="Overage" value={`$${OVERAGE_PER_MINUTE.toFixed(2)} a minute`} />
                  {tier === 'elite' && (
                    <>
                      <QuoteLine label="Elite build, one time" value={usd(q.build)} />
                      <QuoteLine label="Strategy program" value={`${usd(q.eliteAnnual)} a year`} />
                    </>
                  )}
                </dl>
                {tier === 'elite' && (
                  <p className="t-caption mt-4 text-[#a1a1a6]">The build is invoiced after the scoping call. Checkout covers the license and program.</p>
                )}
              </>
            )}
          </div>

          <Card className="flex flex-col p-6 md:p-8 lg:col-span-2">
            <label htmlFor="shop" className="t-callout font-semibold text-ink-3">
              Shop name
            </label>
            <input
              id="shop"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              placeholder={companyName || 'Your company'}
              maxLength={120}
              className="mt-2 rounded-md border hairline bg-surface-2 px-4 py-3 text-[17px] text-ink outline-none focus:border-accent"
              autoComplete="organization"
            />
            <div className="mt-auto pt-6">
              {!loaded ? (
                <Skeleton className="h-11 w-full rounded-pill" />
              ) : (
                <Button className="w-full" onClick={startCheckout} disabled={!billing || busy || q.custom}>
                  {busy ? 'Opening Stripe' : q.custom ? 'Custom quote' : `Check out ${TIERS[tier].name}`}
                </Button>
              )}
              {loaded && !billing && (
                <p className="t-caption mt-3 flex items-center gap-1.5 text-ink-3">
                  <Lock size={13} /> Billing connects when Stripe is added.
                </p>
              )}
              {error && <p className="t-caption mt-3 text-negative">{error}</p>}
              {billing && !error && !q.custom && <p className="t-caption mt-3 text-ink-4">Secure checkout by Stripe. Promo codes welcome.</p>}
            </div>
          </Card>
        </div>
      </Section>

      <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-xl">
          <p className="t-callout font-semibold text-ink-3">In-person seminars</p>
          <p className="t-headline mt-1 text-ink">{usd(SEMINAR_PER_DAY)} per day.</p>
          <p className="t-callout mt-1 text-ink-3">
            A full day with the whole team. Live role plays on your objections, your process, your price book.
          </p>
        </div>
        <Chip>Any tier</Chip>
      </Card>
    </div>
  );
}

function QuoteLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="t-callout text-[#a1a1a6]">{label}</dt>
      <dd className="t-body font-medium tabular-nums">{value}</dd>
    </div>
  );
}

/* ================================================================== Setup */

interface EnvVar {
  name: string;
  note?: string;
  optional?: boolean;
}

interface Integration {
  id: string;
  name: string;
  on: (c: Capabilities) => boolean | null;
  unlocks: string;
  off: string;
  vars: EnvVar[];
  extra?: (c: Capabilities) => ReactNode;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'claude',
    name: 'Claude',
    on: (c) => c.brain,
    unlocks: 'Customers who think, push back, and remember. A coach that reviews every call.',
    off: 'Off: Demo mode. Built-in rules and scripted lines.',
    vars: [
      { name: 'ANTHROPIC_API_KEY' },
      { name: 'SALES_COACH_PRESET', optional: true, note: 'standard, max, or economy. Leave it out for standard.' },
    ],
    extra: (c) =>
      c.models ? (
        <div className="mt-5 rounded-md bg-surface-2 p-4">
          <p className="t-caption font-semibold text-ink-3">Running now · {c.preset} preset</p>
          <dl className="mt-2 space-y-1.5">
            <ModelLine label="Listens" value={c.models.listen} />
            <ModelLine label="Speaks" value={c.models.speak} />
            <ModelLine label="Coaches" value={c.models.coach} />
          </dl>
        </div>
      ) : null,
  },
  {
    id: 'voice',
    name: 'ElevenLabs voices',
    on: (c) => c.voice,
    unlocks: 'A real human voice for every customer and the coach.',
    off: 'Off: the browser’s built-in voices.',
    vars: [{ name: 'ELEVENLABS_API_KEY' }, { name: 'ELEVENLABS_MODEL_ID', optional: true, note: 'Only to override the default voice model.' }],
  },
  {
    id: 'billing',
    name: 'Stripe',
    on: (c) => c.billing,
    unlocks: 'Checkout for annual licenses, right from the Billing tab.',
    off: 'Off: plans and quotes work. Checkout is disabled.',
    vars: [{ name: 'STRIPE_SECRET_KEY' }],
  },
  {
    id: 'db',
    name: 'Neon database',
    on: (c) => c.db,
    unlocks: 'Shared team data across devices: the live team console, assignments, history.',
    off: 'Off: calls stay on the device they were practiced on.',
    vars: [{ name: 'DATABASE_URL' }],
  },
  {
    id: 'servicetitan',
    name: 'ServiceTitan',
    on: (c) => c.servicetitan,
    unlocks: 'Rehearse the next job: the real appointment, equipment, and history. First names only.',
    off: 'Off: techs rehearse a sample job.',
    vars: [
      { name: 'SERVICETITAN_CLIENT_ID' },
      { name: 'SERVICETITAN_CLIENT_SECRET' },
      { name: 'SERVICETITAN_APP_KEY' },
      { name: 'SERVICETITAN_TENANT_ID' },
      { name: 'SERVICETITAN_ENV', note: 'integration while testing, production when live.' },
    ],
  },
  {
    id: 'live',
    name: 'LiveKit Live mode',
    on: (c) => c.live,
    unlocks: 'Sub-second, full-duplex voice. Talk over the customer like a real call.',
    off: 'Off: standard voice turns. Live mode also needs the agent worker running.',
    vars: [{ name: 'LIVEKIT_URL' }, { name: 'LIVEKIT_API_KEY' }, { name: 'LIVEKIT_API_SECRET' }],
  },
  {
    id: 'passcode',
    name: 'Passcode gate',
    on: () => null,
    unlocks: 'One shared passcode keeps a public link private while you pilot.',
    off: 'Optional. Recommended once Claude is on, so a public link cannot spend your credits.',
    vars: [{ name: 'SALES_COACH_PASSCODE', optional: true, note: 'Any passcode you choose. Share it with your team.' }],
  },
];

export function SetupTab() {
  const { caps, loaded } = useCapabilities();
  const onCount = caps ? INTEGRATIONS.filter((i) => i.on(caps) === true).length : 0;
  const total = INTEGRATIONS.filter((i) => i.id !== 'passcode').length;

  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <p className="t-headline text-ink">
          {loaded && caps ? `${onCount} of ${total} connected.` : loaded ? 'Status unavailable right now.' : 'Checking your setup.'}
        </p>
        <p className="t-body mt-2 text-ink-3">
          Everything turns on in Vercel. No code. Add the variable, save, redeploy. Keys stay in Vercel: this page only shows on or off.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {INTEGRATIONS.map((i) => (
          <IntegrationCard key={i.id} i={i} caps={caps} loaded={loaded} />
        ))}
      </div>
    </div>
  );
}

function IntegrationCard({ i, caps, loaded }: { i: Integration; caps: Capabilities | null; loaded: boolean }) {
  const state = caps ? i.on(caps) : null;
  const on = state === true;
  return (
    <Card className="flex flex-col p-6 md:p-7">
      <div className="flex items-start justify-between gap-3">
        <p className="t-headline text-ink">{i.name}</p>
        {!loaded ? (
          <Skeleton className="h-6 w-14 rounded-pill" />
        ) : state === null ? (
          <Chip>Optional</Chip>
        ) : on ? (
          <Chip tone="positive">
            <span className="h-1.5 w-1.5 rounded-full bg-positive-fill" /> On
          </Chip>
        ) : (
          <Chip>
            <span className="h-1.5 w-1.5 rounded-full bg-ink-4" /> Off
          </Chip>
        )}
      </div>
      <p className="t-callout mt-2 text-ink-2">{i.unlocks}</p>
      {!on && <p className="t-caption mt-1 text-ink-4">{i.off}</p>}
      {on && caps && i.extra?.(caps)}
      <div className="mt-auto pt-5">
        {on ? (
          <details className="group">
            <summary className="t-callout cursor-pointer text-accent hover:underline">Setup steps</summary>
            <Steps vars={i.vars} />
          </details>
        ) : (
          <>
            <p className="t-caption font-semibold text-ink-3">Turn it on</p>
            <Steps vars={i.vars} />
          </>
        )}
      </div>
    </Card>
  );
}

function Steps({ vars }: { vars: EnvVar[] }) {
  return (
    <ol className="t-callout mt-3 space-y-3 text-ink-2">
      <Step n={1}>
        In Vercel, open your project. Go to <Path>Settings</Path> then <Path>Environment Variables</Path>.
      </Step>
      <Step n={2}>
        <span>Add {vars.length === 1 ? 'this variable' : 'these variables'} with the value from the provider:</span>
        <ul className="mt-2 space-y-2">
          {vars.map((v) => (
            <li key={v.name}>
              <VarName name={v.name} />
              {v.optional && <span className="t-caption ml-2 text-ink-4">Optional</span>}
              {v.note && <p className="t-caption mt-1 text-ink-3">{v.note}</p>}
            </li>
          ))}
        </ul>
      </Step>
      <Step n={3}>
        <Path>Save</Path>. Then <Path>Deployments</Path>, open the latest, and choose <Path>Redeploy</Path>.
      </Step>
    </ol>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="t-micro mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-surface-3 tabular-nums text-ink-2">{n}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

function Path({ children }: { children: ReactNode }) {
  return <span className="font-medium text-ink">{children}</span>;
}

/** Shows a variable name, never a value. Tap to copy the name. */
function VarName({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(name)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          })
          .catch(() => {});
      }}
      className="inline-flex max-w-full items-center gap-2 rounded-sm bg-surface-2 px-2.5 py-1 font-mono text-[13px] text-ink ring-1 ring-line hover:ring-line-strong"
      title="Copy the name"
    >
      <span className="truncate">{name}</span>
      {copied ? <Check size={13} className="shrink-0 text-positive" /> : <Copy size={13} className="shrink-0 text-ink-4" />}
    </button>
  );
}

function ModelLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="t-caption text-ink-3">{label}</dt>
      <dd className="t-caption truncate font-mono text-ink">{value}</dd>
    </div>
  );
}
