'use client';

import type { Company, Move } from '@sales-coach/engine';
import { Check, ChevronDown, ExternalLink, Info, Lock, X } from 'lucide-react';
import { useState } from 'react';
import { behaviorMoves, companies, contentIndex, drills, objections, personas, scenarios } from '@/lib/content';
import { usd } from '@/lib/pricing';
import { useProfile } from '@/lib/store';
import { Avatar } from './avatar';
import { Button, Card, Chip, cn, Difficulty, Empty, Section, Segmented, Stat } from './ui';

/* ================================================================ Company */

export function CompanyTab() {
  const [profile, setProfile] = useProfile();
  const list = companies();
  const [picked, setPicked] = useState<string | null>(null);
  const fallback = list.some((c) => c.id === profile.companyId) ? profile.companyId : (list[0]?.id ?? '');
  const id = picked ?? fallback;
  const c = list.find((x) => x.id === id);

  if (!c) return <Empty title="No company specs yet." body="Company specs live in the content library." />;

  const inUse = profile.companyId === c.id;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {list.length <= 4 ? (
          <div className="no-scrollbar -mx-5 overflow-x-auto px-5">
            <Segmented size="sm" options={list.map((x) => ({ value: x.id, label: x.shortName }))} value={c.id} onChange={setPicked} />
          </div>
        ) : (
          <select
            value={c.id}
            onChange={(e) => setPicked(e.target.value)}
            className="rounded-pill border hairline bg-surface px-4 py-2 text-[15px] text-ink"
            aria-label="Company"
          >
            {list.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        )}
        {inUse ? (
          <Chip tone="positive">
            <Check size={13} /> Practice calls use {c.shortName}
          </Chip>
        ) : (
          <button type="button" className="btn btn-secondary btn-sm self-start" onClick={() => setProfile({ companyId: c.id })}>
            Practice with {c.shortName}
          </button>
        )}
      </div>

      <div className="mb-12 grid gap-5 lg:grid-cols-5">
        <Card className="reveal p-6 md:p-8 lg:col-span-3">
          <p className="t-callout font-semibold text-ink-3">{c.trades.map(cap).join(' · ')}</p>
          <h2 className="t-display mt-2 text-ink">{c.name}</h2>
          <p className="t-body-lg mt-4 text-ink-2">{c.about}</p>
          {c.serviceArea.length > 0 && (
            <div className="mt-6">
              <p className="t-caption font-semibold text-ink-3">Service area</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.serviceArea.map((a) => (
                  <Chip key={a}>{a}</Chip>
                ))}
              </div>
            </div>
          )}
        </Card>
        <OwnerReview c={c} />
      </div>

      <div className="mb-12 grid gap-5 md:grid-cols-2">
        <Card className="p-6 md:p-8">
          <p className="t-callout font-semibold text-ink-3">Brand voice</p>
          <ul className="mt-4 space-y-3">
            {c.brandVoice.map((v) => (
              <li key={v} className="t-body flex gap-3 text-ink">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {v}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6 md:p-8">
          <p className="t-callout font-semibold text-ink-3">Promises</p>
          {c.promises.length === 0 ? (
            <p className="t-callout mt-4 text-ink-4">No promises on file.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {c.promises.map((p) => (
                <li key={p.id}>
                  <p className="t-body font-medium text-ink">{p.label}</p>
                  <p className="t-callout text-ink-3">{p.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Section title="The sales process">
        <Card className="divide-y divide-line">
          {c.process.map((s, i) => (
            <div key={s.id} className="flex gap-4 px-5 py-4 md:px-7 md:py-5">
              <span className="t-callout grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 font-semibold tabular-nums text-ink">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="t-body flex flex-wrap items-center gap-2 font-medium text-ink">
                  {s.name}
                  {!s.required && <Chip>Optional</Chip>}
                </p>
                <p className="t-callout mt-0.5 text-ink-3">{s.description}</p>
              </div>
            </div>
          ))}
        </Card>
      </Section>

      <div className="mb-12 grid gap-5 md:grid-cols-2">
        <Card className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="t-callout font-semibold text-ink-3">Membership</p>
              <p className="t-headline mt-1 text-ink">{c.membership?.name ?? 'None on file'}</p>
            </div>
            {c.membership && !c.membership.verified && <Chip tone="caution">Verify</Chip>}
          </div>
          {c.membership ? (
            <>
              {membershipPrice(c) && <p className="t-title mt-4 tabular-nums text-ink">{membershipPrice(c)}</p>}
              <p className="t-callout mt-3 text-ink-2">{c.membership.summary}</p>
              {c.membership.benefits.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {c.membership.benefits.map((b) => (
                    <li key={b} className="t-callout flex gap-3 text-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-positive" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="t-callout mt-3 text-ink-3">No membership plan in this spec. Techs skip the membership ask until the owner adds one.</p>
          )}
        </Card>
        <Card className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="t-callout font-semibold text-ink-3">Financing</p>
              <p className="t-headline mt-1 text-ink">{c.financing.available ? 'Available' : 'Not offered'}</p>
            </div>
            {!c.financing.verified && <Chip tone="caution">Verify</Chip>}
          </div>
          <p className="t-callout mt-3 text-ink-2">{c.financing.summary}</p>
        </Card>
      </div>

      {c.priceRanges.length > 0 && (
        <Section title="Price ranges">
          <PriceRanges c={c} />
        </Section>
      )}

      <div className="mb-12 grid gap-5 lg:grid-cols-5">
        <Card className="p-6 md:p-8 lg:col-span-3">
          <p className="t-callout font-semibold text-ink-3">Preferred scripts</p>
          {c.scripts.preferred.length === 0 ? (
            <p className="t-callout mt-4 text-ink-4">None on file.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {c.scripts.preferred.map((s) => (
                <li key={s.moment} className="py-4 first:pt-0 last:pb-0">
                  <p className="t-caption font-semibold text-ink-3">{s.moment}</p>
                  <p className="t-body mt-1 text-ink">&ldquo;{s.line}&rdquo;</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-6 md:p-8 lg:col-span-2">
          <p className="t-callout font-semibold text-ink-3">Never say</p>
          {c.scripts.banned.length === 0 ? (
            <p className="t-callout mt-4 text-ink-4">None on file.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {c.scripts.banned.map((b) => (
                <li key={b} className="t-callout flex gap-3 text-ink-2">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-negative-soft text-negative">
                    <X size={12} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {c.objectionAnswers.length > 0 && (
        <Section title="Your answers to common objections">
          <div className="grid gap-4 md:grid-cols-2">
            {c.objectionAnswers.map((a) => {
              const m = contentIndex().move(a.moveId);
              return (
                <Card key={a.moveId} className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <p className="t-body font-medium text-ink">{m?.name ?? humanize(a.moveId)}</p>
                    {m && <Chip className="shrink-0">{groupLabel(m.group)}</Chip>}
                  </div>
                  <p className="t-callout mt-2 text-ink-2">{a.answer}</p>
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Sources">
        {c.sources.length === 0 ? (
          <Card className="p-6">
            <p className="t-callout text-ink-3">No sources. This company is a fictional demo, so nothing here comes from a real website.</p>
          </Card>
        ) : (
          <Card className="divide-y divide-line">
            {c.sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2 md:px-7"
              >
                <ExternalLink size={15} className="shrink-0 text-ink-4" />
                <span className="t-callout min-w-0 flex-1 truncate text-accent">{s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                <span className="t-caption shrink-0 text-ink-4">Retrieved {s.retrieved}</span>
              </a>
            ))}
          </Card>
        )}
      </Section>
    </div>
  );
}

function OwnerReview({ c }: { c: Company }) {
  const [open, setOpen] = useState(false);
  const fictional = c.sources.length === 0;
  const notes = c.review.notes.map((n) => n.replace(/^Verify with the owner\.\s*/, ''));
  const shown = open ? notes : notes.slice(0, 3);
  const status = c.review.status === 'approved' ? 'Owner approved' : c.review.status === 'reviewed' ? 'Reviewed' : 'Draft';
  return (
    <div className="reveal rounded-lg bg-caution-soft p-6 md:p-7 lg:col-span-2 [animation-delay:120ms]">
      <div className="flex items-center justify-between gap-3">
        <p className="t-callout flex items-center gap-2 font-semibold text-caution">
          <Info size={16} /> Owner review
        </p>
        <Chip tone={c.review.status === 'approved' ? 'positive' : 'caution'} className="bg-surface">
          {status}
        </Chip>
      </div>
      <p className="t-body mt-3 text-ink">
        {fictional
          ? 'A fictional demo company. Every price, promise, and term is made up for practice.'
          : 'Drafted from the public website. Needs owner confirmation before techs rely on it.'}
      </p>
      {notes.length > 0 && (
        <>
          <p className="t-caption mt-4 font-semibold text-ink-3">
            {fictional ? 'Notes' : `${notes.length} ${notes.length === 1 ? 'item' : 'items'} to confirm`}
          </p>
          <ul className="mt-2 space-y-2">
            {shown.map((n) => (
              <li key={n} className="t-caption flex gap-2 text-ink-2">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-caution" />
                {n}
              </li>
            ))}
          </ul>
          {notes.length > 3 && (
            <button type="button" className="t-caption mt-3 font-medium text-accent hover:underline" onClick={() => setOpen(!open)}>
              {open ? 'Show less' : `Show all ${notes.length}`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function PriceRanges({ c }: { c: Company }) {
  const [all, setAll] = useState(false);
  const rows = all ? c.priceRanges : c.priceRanges.slice(0, 8);
  return (
    <Card className="overflow-hidden">
      <div className="hidden grid-cols-[1fr_auto] gap-6 border-b hairline px-7 py-3 md:grid">
        <span className="t-caption font-semibold text-ink-3">Job</span>
        <span className="t-caption font-semibold text-ink-3">Typical range</span>
      </div>
      <ul className="divide-y divide-line">
        {rows.map((r) => (
          <li key={r.id} className="grid grid-cols-[1fr_auto] items-baseline gap-4 px-5 py-3.5 md:gap-6 md:px-7">
            <div className="min-w-0">
              <p className="t-callout text-ink">{r.item}</p>
              <p className="t-caption mt-0.5 truncate text-ink-4" title={r.source}>
                {r.source}
              </p>
            </div>
            <span className="t-callout font-semibold whitespace-nowrap tabular-nums text-ink">
              {r.low === r.high ? usd(r.low) : `${usd(r.low)} to ${usd(r.high)}`}
            </span>
          </li>
        ))}
      </ul>
      {c.priceRanges.length > 8 && (
        <div className="border-t hairline px-5 py-3.5 md:px-7">
          <button type="button" className="t-callout text-accent hover:underline" onClick={() => setAll(!all)}>
            {all ? 'Show less' : `Show all ${c.priceRanges.length} ranges`}
          </button>
        </div>
      )}
    </Card>
  );
}

function membershipPrice(c: Company) {
  const m = c.membership;
  if (!m) return null;
  const parts = [m.monthlyPrice ? `${usd(m.monthlyPrice)} a month` : null, m.annualPrice ? `${usd(m.annualPrice)} a year` : null].filter(Boolean);
  return parts.length ? parts.join(' or ') : null;
}

/* ================================================================ Library */

const OBJECTION_GROUPS = [
  ['price', 'Price'],
  ['timing', 'Timing'],
  ['trust', 'Trust'],
  ['competition', 'Competition'],
  ['scope', 'Scope'],
  ['financing', 'Financing'],
  ['membership', 'Membership'],
] as const;

const BEHAVIOR_GROUPS = [
  ['silence', 'Silence'],
  ['disruption', 'Disruption'],
  ['confusion', 'Confusion'],
  ['misplaced-confidence', 'Misplaced confidence'],
  ['intensity', 'Intensity'],
  ['probe', 'Probes'],
] as const;

const GROUP_LABEL: Record<string, string> = Object.fromEntries([...OBJECTION_GROUPS, ...BEHAVIOR_GROUPS]);
const groupLabel = (g: string) => GROUP_LABEL[g] ?? humanize(g);

export function LibraryTab() {
  const obj = objections();
  const beh = behaviorMoves();
  const people = personas();
  const scen = scenarios();

  return (
    <div>
      <Section>
        <Card className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4 md:p-8">
          <Stat label="Objections" value={obj.length} hint={`${new Set(obj.map((m) => m.group)).size} groups`} />
          <Stat label="Customer behaviors" value={beh.length} hint="Silence, interruptions, probes" />
          <Stat label="Personas" value={people.length} hint={`${people.filter((p) => p.language === 'es').length} in Spanish`} />
          <Stat label="Scenarios" value={scen.length} hint={`${drills().length} ${drills().length === 1 ? 'drill' : 'drills'}`} />
        </Card>
      </Section>

      <Section title="Objection library">
        <p className="t-body -mt-2 mb-6 max-w-2xl text-ink-3">What customers say. Why they say it. What a strong tech says back.</p>
        <MoveGroups moves={obj} groups={OBJECTION_GROUPS} />
      </Section>

      <Section title="Customer behaviors">
        <p className="t-body -mt-2 mb-6 max-w-2xl text-ink-3">Not objections. The moments that knock a call off track, and how to stay on it.</p>
        <MoveGroups moves={beh} groups={BEHAVIOR_GROUPS} />
      </Section>

      <Section title="Personas">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <Card key={p.id} className="flex flex-col p-6">
              <div className="flex items-center gap-3">
                <Avatar name={p.name} seed={p.id} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="t-headline truncate text-ink">{p.name}</p>
                  <p className="t-caption text-ink-3">
                    {p.age} · {p.archetype}
                  </p>
                </div>
              </div>
              <p className="t-callout mt-4 text-ink-2">{p.card}</p>
              <div className="mt-auto flex pt-5">
                <Chip tone={p.language === 'es' ? 'accent' : undefined}>{p.language === 'es' ? 'Spanish' : 'English'}</Chip>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Card className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-xl">
          <p className="t-headline flex items-center gap-2 text-ink">
            Add your own objections <Chip tone="accent">Pro</Chip>
          </p>
          <p className="t-callout mt-1 text-ink-3">
            The ones your customers actually say. Your answers, your scripts, your price book. Every tech practices them.
          </p>
        </div>
        <Button variant="secondary" disabled aria-label="Add an objection. Available on Pro.">
          <Lock size={16} /> Add an objection
        </Button>
      </Card>
    </div>
  );
}

function MoveGroups({ moves, groups }: { moves: Move[]; groups: readonly (readonly [string, string])[] }) {
  const known = new Set(groups.map(([g]) => g));
  const extra = [...new Set(moves.map((m) => m.group).filter((g) => !known.has(g)))].map((g) => [g, humanize(g)] as const);
  const all = [...groups, ...extra];
  return (
    <div className="space-y-6">
      {all.map(([g, label]) => {
        const list = moves.filter((m) => m.group === g).sort((a, b) => a.difficultyMin - b.difficultyMin || a.name.localeCompare(b.name));
        if (!list.length) return null;
        return (
          <div key={g}>
            <p className="t-callout mb-2 font-semibold text-ink-3">
              {label} <span className="font-normal text-ink-4">· {list.length}</span>
            </p>
            <Card className="divide-y divide-line">
              {list.map((m) => (
                <MoveRow key={m.id} m={m} />
              ))}
            </Card>
          </div>
        );
      })}
    </div>
  );
}

function MoveRow({ m }: { m: Move }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-5 py-4 md:px-6">
      <button type="button" className="flex w-full items-start gap-4 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="min-w-0 flex-1">
          <p className="t-body font-medium text-ink">{m.name}</p>
          <p className="t-callout text-ink-3">{m.summary}</p>
        </div>
        <span className="flex shrink-0 items-center gap-3 pt-2" title={`Shows up from difficulty ${m.difficultyMin}`}>
          <Difficulty level={m.difficultyMin} />
          <ChevronDown size={16} className={cn('text-ink-4 transition-transform', open && 'rotate-180')} />
        </span>
      </button>
      {open && (
        <div className="fade mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="t-caption font-semibold text-ink-3">Why it matters</p>
            <p className="t-callout mt-1 text-ink-2">{m.coaching.why}</p>
          </div>
          <div className="rounded-md bg-accent-soft p-4">
            <p className="t-caption font-semibold text-accent">Say it like this</p>
            <p className="t-callout mt-1 text-ink">{m.coaching.modelResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================ helpers */

function cap(s: string) {
  return s === 'hvac' ? 'HVAC' : s.charAt(0).toUpperCase() + s.slice(1);
}

function humanize(id: string) {
  const s = id.replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}
