'use client';

import type { SkillId } from '@sales-coach/engine';
import { BellRing, Database, TrendingUp, X } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Avatar } from '@/components/avatar';
import { SessionRow } from '@/components/session-row';
import { SAMPLE_SHOP, SAMPLE_TEAM } from '@/components/team-sample';
import { Bar, ButtonLink, Card, ChevronLink, Chip, cn, Section, Stat } from '@/components/ui';
import { contentIndex, drills, SKILL_ORDER } from '@/lib/content';
import { type StoredSession, useProfile, useSessions } from '@/lib/store';
import { useCapabilities } from '@/lib/use-capabilities';

const YOU = 'You (this device)';
const STORAGE_KEY = 'sc.assignments';
const DAY = 86400000;

type Assignments = Record<string, string[]>;

interface Row {
  /** Assignment key: the tech's name. */
  key: string;
  name: string;
  role: string;
  sample: boolean;
  callsThisWeek: number;
  avg: number | null;
  lastWeekAvg: number | null;
  skills: Partial<Record<SkillId, number | null>>;
  lastPracticedDaysAgo: number | null;
  streak: number;
}

/* ---------------------------------------------------------------- helpers */

const mean = (xs: number[]) =>
  xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null;

function daysAgo(iso: string) {
  const a = new Date();
  a.setHours(0, 0, 0, 0);
  const b = new Date(iso);
  b.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((a.getTime() - b.getTime()) / DAY));
}

const lastLabel = (d: number | null) =>
  d === null ? 'Not yet' : d <= 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;

const humanize = (id: string) => {
  const s = id.replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const drillTitle = (id: string) => contentIndex().drills.get(id)?.title ?? humanize(id);

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function cellTone(v: number | null | undefined) {
  if (v === null || v === undefined) return 'bg-surface-2 text-ink-4';
  if (v >= 80) return 'bg-positive-soft text-positive';
  if (v >= 60) return 'bg-accent-soft text-accent';
  return 'bg-caution-soft text-caution';
}

function scoreTone(v: number | null) {
  if (v === null) return 'text-ink-4';
  if (v >= 80) return 'text-positive';
  if (v >= 60) return 'text-ink';
  return 'text-caution';
}

/** The real row: computed from practice calls stored on this device. */
function youRow(sessions: StoredSession[], role: string): Row {
  const now = Date.now();
  const time = (s: StoredSession) => new Date(s.createdAt).getTime();
  const week = sessions.filter((s) => now - time(s) < 7 * DAY);
  const prior = sessions.filter((s) => now - time(s) >= 7 * DAY && now - time(s) < 14 * DAY);
  const recent = sessions.slice(0, 10);
  const skills: Partial<Record<SkillId, number | null>> = {};
  for (const id of SKILL_ORDER) {
    const xs: number[] = [];
    for (const s of recent) {
      const k = s.debrief.skills.find((x) => x.skillId === id);
      if (k && k.score !== null) xs.push(k.score);
    }
    skills[id] = mean(xs);
  }
  const days = new Set(sessions.map((s) => new Date(s.createdAt).toDateString()));
  let streak = 0;
  for (let d = new Date(); days.has(d.toDateString()); d.setDate(d.getDate() - 1)) streak++;
  const first = sessions[0];
  return {
    key: YOU,
    name: YOU,
    role,
    sample: false,
    callsThisWeek: week.length,
    avg: mean(recent.map((s) => s.debrief.overall)),
    lastWeekAvg: mean(prior.map((s) => s.debrief.overall)),
    skills,
    lastPracticedDaysAgo: first ? daysAgo(first.createdAt) : null,
    streak,
  };
}

function extremes(r: Row, names: Map<string, string>) {
  const scored = SKILL_ORDER.map((id) => ({
    id,
    name: names.get(id) ?? humanize(id),
    score: r.skills[id] ?? null,
  })).filter(
    (x): x is { id: (typeof SKILL_ORDER)[number]; name: string; score: number } => x.score !== null,
  );
  if (!scored.length) return { strong: null, weak: null };
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  return { strong: sorted[0] ?? null, weak: sorted[sorted.length - 1] ?? null };
}

/* ------------------------------------------------------------ assignments */

function defaultAssignments(): Assignments {
  return Object.fromEntries(SAMPLE_TEAM.map((t) => [t.name, [...t.drills]]));
}

function useAssignments(): [Assignments, (name: string, ids: string[]) => void] {
  const [map, setMap] = useState<Assignments>(defaultAssignments);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      const clean: Assignments = {};
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (Array.isArray(v)) clean[k] = v.filter((x): x is string => typeof x === 'string');
      }
      setMap({ ...defaultAssignments(), ...clean });
    } catch {
      /* private mode or bad JSON: keep the defaults */
    }
  }, []);
  const update = (name: string, ids: string[]) => {
    const next = { ...map, [name]: ids };
    setMap(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  };
  return [map, update];
}

/* ------------------------------------------------------------------- page */

export default function TeamPage() {
  const { sessions } = useSessions();
  const [profile] = useProfile();
  const { caps } = useCapabilities();
  const [assignments, assign] = useAssignments();
  const all = sessions ?? [];
  const index = contentIndex();
  const rubricSkills = index.rubric.skills;
  const skillNames = useMemo(
    () => new Map(rubricSkills.map((s) => [s.id, s.name] as const)),
    [rubricSkills],
  );
  /** Header columns in SKILL_ORDER so they always line up with the cells. */
  const skills = useMemo(
    () =>
      SKILL_ORDER.map((id) => {
        const s = rubricSkills.find((x) => x.id === id);
        return { id, name: s?.name ?? humanize(id), description: s?.description ?? '' };
      }),
    [rubricSkills],
  );

  const you = useMemo(
    () => youRow(all, profile.name ? `${profile.name} · your real scores` : 'Your real scores'),
    [all, profile.name],
  );
  const sampleRows: Row[] = useMemo(
    () =>
      SAMPLE_TEAM.map((t) => ({
        key: t.name,
        name: t.name,
        role: `${t.role} · ${t.years} ${t.years === 1 ? 'year' : 'years'}`,
        sample: true,
        callsThisWeek: t.callsThisWeek,
        avg: t.avg,
        lastWeekAvg: t.lastWeekAvg,
        skills: t.skills,
        lastPracticedDaysAgo: t.lastPracticedDaysAgo,
        streak: t.streak,
      })),
    [],
  );
  const rows = useMemo(() => [...sampleRows, you], [sampleRows, you]);
  const active = rows.filter((r) => r.avg !== null);

  const digest = useMemo(() => {
    const teamAvg = mean(active.map((r) => r.avg!));
    const lastAvg = mean(active.filter((r) => r.lastWeekAvg !== null).map((r) => r.lastWeekAvg!));
    const calls = rows.reduce((a, r) => a + r.callsThisWeek, 0);
    const improved = [...active]
      .filter((r) => r.lastWeekAvg !== null)
      .sort((a, b) => b.avg! - b.lastWeekAvg! - (a.avg! - a.lastWeekAvg!))[0];
    const nudge = [...rows]
      .filter((r) => r.sample || r.lastPracticedDaysAgo !== null)
      .sort(
        (a, b) =>
          (b.lastPracticedDaysAgo ?? 0) - (a.lastPracticedDaysAgo ?? 0) ||
          a.callsThisWeek - b.callsThisWeek,
      )[0];
    const today = rows.filter((r) => r.lastPracticedDaysAgo === 0).length;
    const longest = [...rows].sort((a, b) => b.streak - a.streak)[0];
    const teamSkills = SKILL_ORDER.map((id) => ({
      id,
      name: skillNames.get(id) ?? humanize(id),
      avg: mean(active.map((r) => r.skills[id]).filter((v): v is number => typeof v === 'number')),
    }));
    const ranked = teamSkills.filter((s) => s.avg !== null).sort((a, b) => b.avg! - a.avg!);
    return {
      teamAvg,
      delta: teamAvg !== null && lastAvg !== null ? teamAvg - lastAvg : null,
      calls,
      improved,
      nudge,
      today,
      longest,
      teamSkills,
      best: ranked[0],
      focus: ranked[ranked.length - 1],
    };
  }, [active, rows, skillNames]);

  const improvedBy = digest.improved ? digest.improved.avg! - digest.improved.lastWeekAvg! : 0;

  return (
    <div>
      <header className="reveal mb-10 md:mb-14">
        <p className="t-callout font-semibold text-ink-3">{SAMPLE_SHOP} · Sample team</p>
        <h1 className="t-hero mt-2 text-ink">Your team. In focus.</h1>
        <p className="t-body-lg mt-4 max-w-xl text-ink-3">
          Who practiced. Who improved. Who needs a nudge. One screen, every morning.
        </p>
      </header>

      {/* Digest */}
      <div className="mb-12 grid gap-5 lg:grid-cols-5">
        <div className="reveal relative overflow-hidden rounded-xl bg-[#000] p-7 text-[#f5f5f7] shadow-float md:p-10 lg:col-span-3">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-voice opacity-30 blur-3xl" />
          <p className="t-callout font-semibold text-[#a1a1a6]">This week</p>
          <h2 className="t-display mt-3 max-w-md">
            Team average {digest.teamAvg ?? '–'}.
            {digest.delta !== null && digest.delta !== 0 && (
              <span className="text-[#a1a1a6]">
                {' '}
                {digest.delta > 0 ? `Up ${digest.delta}.` : `Down ${-digest.delta}.`}
              </span>
            )}
          </h2>
          <p className="t-body mt-4 max-w-md text-[#a1a1a6]">
            {digest.calls} practice {digest.calls === 1 ? 'call' : 'calls'} across {rows.length}{' '}
            techs.
            {digest.best && ` ${digest.best.name} leads the team.`}
            {digest.focus && ` ${digest.focus.name} needs the reps.`}
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
            <DarkStat label="Calls" value={digest.calls} />
            <DarkStat label="Team avg" value={digest.teamAvg ?? '–'} />
            <DarkStat label="Today" value={`${digest.today} of ${rows.length}`} />
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-2">
          {digest.improved && (
            <Card className="reveal flex flex-1 flex-col p-6 [animation-delay:120ms]">
              <p className="t-callout flex items-center gap-2 font-semibold text-ink-3">
                <TrendingUp size={16} /> Most improved
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar name={digest.improved.name} seed={digest.improved.key} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="t-headline truncate text-ink">{digest.improved.name}</p>
                  <p className="t-caption text-ink-3">
                    {digest.improved.lastWeekAvg} last week. {digest.improved.avg} now.
                  </p>
                </div>
                <span
                  className={cn(
                    't-title tabular-nums',
                    improvedBy > 0 ? 'text-positive' : 'text-ink-3',
                  )}
                >
                  {improvedBy > 0 ? `+${improvedBy}` : improvedBy}
                </span>
              </div>
            </Card>
          )}
          {digest.nudge && (
            <Card className="reveal flex flex-1 flex-col p-6 [animation-delay:200ms]">
              <p className="t-callout flex items-center gap-2 font-semibold text-ink-3">
                <BellRing size={16} /> Needs a nudge
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar name={digest.nudge.name} seed={digest.nudge.key} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="t-headline truncate text-ink">{digest.nudge.name}</p>
                  <p className="t-caption text-ink-3">
                    Last practiced {lastLabel(digest.nudge.lastPracticedDaysAgo).toLowerCase()}.{' '}
                    {digest.nudge.callsThisWeek}{' '}
                    {digest.nudge.callsThisWeek === 1 ? 'call' : 'calls'} this week.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-5">
                <a href={`#tech-${slug(digest.nudge.key)}`} className="btn btn-secondary btn-sm">
                  Assign a drill
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Section>
        <Card className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4 md:p-8">
          <Stat label="Calls this week" value={digest.calls} />
          <Stat label="Practiced today" value={`${digest.today} of ${rows.length}`} />
          <Stat
            label="Longest streak"
            value={
              digest.longest
                ? `${digest.longest.streak} ${digest.longest.streak === 1 ? 'day' : 'days'}`
                : '–'
            }
            hint={digest.longest?.name}
          />
          <Stat
            label="Team focus"
            value={<span className="t-headline">{digest.focus?.name ?? '–'}</span>}
            hint={digest.focus ? `Team average ${digest.focus.avg}` : undefined}
          />
        </Card>
      </Section>

      {/* Heatmap */}
      <Section title="Skill heatmap" action={<Chip>Sample team</Chip>}>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-[4px] p-3 md:p-4">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-surface pr-3 text-left align-bottom"
                  >
                    <span className="t-caption font-semibold text-ink-3">Tech</span>
                  </th>
                  {skills.map((s) => (
                    <th
                      key={s.id}
                      scope="col"
                      title={s.description}
                      className="w-[78px] px-1 pb-2 align-bottom"
                    >
                      <span className="t-micro block text-center font-medium text-ink-3">
                        {s.name}
                      </span>
                    </th>
                  ))}
                  <th scope="col" className="w-[64px] px-1 pb-2 align-bottom">
                    <span className="t-micro block text-center font-semibold text-ink-2">
                      Overall
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-surface pr-3 text-left font-normal"
                    >
                      <span className="flex items-center gap-2.5">
                        <Avatar
                          name={r.sample ? r.name : profile.name || 'You'}
                          seed={r.key}
                          size={28}
                        />
                        <span className="t-callout max-w-[112px] truncate font-medium text-ink">
                          {r.sample ? r.name.split(' ')[0] : 'You'}
                        </span>
                      </span>
                    </th>
                    {SKILL_ORDER.map((id) => {
                      const v = r.skills[id];
                      return (
                        <td key={id}>
                          <div
                            className={cn(
                              't-callout grid h-10 place-items-center rounded-[10px] font-semibold tabular-nums',
                              cellTone(v),
                            )}
                            title={`${r.name}: ${skillNames.get(id) ?? id} ${v ?? 'not scored yet'}`}
                          >
                            {v ?? '–'}
                          </div>
                        </td>
                      );
                    })}
                    <td>
                      <div
                        className={cn(
                          't-callout grid h-10 place-items-center rounded-[10px] bg-surface-3 font-semibold tabular-nums',
                          scoreTone(r.avg),
                        )}
                      >
                        {r.avg ?? '–'}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="sticky left-0 z-10 bg-surface pt-2 pr-3 text-left">
                    <span className="t-callout font-semibold text-ink">Team</span>
                  </th>
                  {digest.teamSkills.map((s) => (
                    <td key={s.id} className="pt-2">
                      <div className="t-callout grid h-10 place-items-center rounded-[10px] font-semibold tabular-nums text-ink ring-1 ring-line ring-inset">
                        {s.avg ?? '–'}
                      </div>
                    </td>
                  ))}
                  <td className="pt-2">
                    <div className="t-callout grid h-10 place-items-center rounded-[10px] font-semibold tabular-nums text-ink ring-1 ring-line ring-inset">
                      {digest.teamAvg ?? '–'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t hairline px-5 py-4 md:px-7">
            <Legend className="bg-positive-fill" label="80 and up" />
            <Legend className="bg-accent" label="60 to 79" />
            <Legend className="bg-caution-fill" label="Under 60" />
            <span className="t-caption text-ink-4 md:ml-auto lg:hidden">
              Swipe sideways for every skill.
            </span>
          </div>
        </Card>
      </Section>

      {/* Roster */}
      <Section title="Roster" action={<Chip>Sample team</Chip>}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <TechCard
              key={r.key}
              r={r}
              names={skillNames}
              assigned={assignments[r.key] ?? []}
              onAssign={(ids) => assign(r.key, ids)}
              youName={profile.name}
            />
          ))}
        </div>
      </Section>

      {/* This device */}
      <Section title="Recent calls on this device">
        {sessions === null ? null : all.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="t-headline text-ink">No calls on this device yet.</p>
            <p className="t-callout mt-2 text-ink-3">
              Run one and your row in the heatmap fills in.
            </p>
            <ButtonLink href="/practice" className="mt-6">
              Pick a customer
            </ButtonLink>
          </Card>
        ) : (
          <Card className="divide-y divide-line">
            {all.slice(0, 5).map((x) => (
              <SessionRow key={x.id} s={x} />
            ))}
          </Card>
        )}
      </Section>

      <Card className="flex items-start gap-4 p-6 md:p-8">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <Database size={18} />
        </span>
        <div className="min-w-0">
          <p className="t-headline text-ink">A sample team, for now.</p>
          <p className="t-callout mt-1 max-w-2xl text-ink-3">
            Live team data appears once accounts and the shared database are turned on. Until then,
            the six techs above are a sample shop. Your row is real: it comes from the calls
            practiced on this device. Assignments save on this device too.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {caps && (
              <Chip tone={caps.db ? 'positive' : undefined}>
                {caps.db ? 'Database connected' : 'Database off'}
              </Chip>
            )}
            <ChevronLink href="/portal?tab=setup">How to turn it on</ChevronLink>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------- components */

function DarkStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="t-caption text-[#a1a1a6]">{label}</p>
      <p className="t-headline mt-0.5 tabular-nums">{value}</p>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="t-caption inline-flex items-center gap-2 text-ink-3">
      <span className={cn('h-2.5 w-2.5 rounded-full', className)} />
      {label}
    </span>
  );
}

function TechCard({
  r,
  names,
  assigned,
  onAssign,
  youName,
}: {
  r: Row;
  names: Map<string, string>;
  assigned: string[];
  onAssign: (ids: string[]) => void;
  youName: string;
}) {
  const { strong, weak } = extremes(r, names);
  const trend = r.avg !== null && r.lastWeekAvg !== null ? r.avg - r.lastWeekAvg : null;
  const available = drills().filter((d) => !assigned.includes(d.id));
  const empty = r.avg === null;

  return (
    <Card id={`tech-${slug(r.key)}`} className="reveal flex scroll-mt-24 flex-col p-6">
      <div className="flex items-center gap-3">
        <Avatar name={r.sample ? r.name : youName || 'You'} seed={r.key} size={44} />
        <div className="min-w-0 flex-1">
          <p className="t-headline truncate text-ink">{r.name}</p>
          <p className="t-caption truncate text-ink-3">{r.role}</p>
        </div>
        <div className="text-right">
          <p className={cn('t-title tabular-nums', scoreTone(r.avg))}>{r.avg ?? '–'}</p>
          <p className="t-micro text-ink-4">
            {trend === null
              ? r.sample
                ? 'Average'
                : empty
                  ? 'No calls'
                  : 'Average'
              : trend > 0
                ? `Up ${trend}`
                : trend < 0
                  ? `Down ${-trend}`
                  : 'Steady'}
          </p>
        </div>
      </div>

      <Bar value={r.avg} tone="auto" className="mt-4" />

      <dl className="mt-5 grid grid-cols-3 gap-3">
        <Mini
          label="This week"
          value={`${r.callsThisWeek} ${r.callsThisWeek === 1 ? 'call' : 'calls'}`}
        />
        <Mini label="Streak" value={`${r.streak} ${r.streak === 1 ? 'day' : 'days'}`} />
        <Mini
          label="Last practiced"
          value={lastLabel(r.lastPracticedDaysAgo)}
          warn={(r.lastPracticedDaysAgo ?? 0) >= 5}
        />
      </dl>

      {empty ? (
        <div className="mt-5 rounded-md bg-surface-2 p-4">
          <p className="t-callout text-ink-2">
            Practice a call and this row fills in with your real scores.
          </p>
          <ButtonLink href="/practice" size="sm" className="mt-3">
            Pick a customer
          </ButtonLink>
        </div>
      ) : (
        <div className="t-callout mt-5 space-y-2">
          {strong && (
            <p className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-ink-3">Strongest</span>
              <span className="truncate text-right font-medium text-positive">
                {strong.name} · {strong.score}
              </span>
            </p>
          )}
          {weak && weak.id !== strong?.id && (
            <p className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-ink-3">Work on</span>
              <span className="truncate text-right font-medium text-caution">
                {weak.name} · {weak.score}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="mt-auto pt-5">
        <div className="border-t hairline pt-4">
          <p className="t-caption font-semibold text-ink-3">Assigned drills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {assigned.length === 0 && <span className="t-caption text-ink-4">None yet.</span>}
            {assigned.map((id) => (
              <span key={id} className="chip max-w-full bg-accent-soft pr-1.5 text-accent">
                <span className="truncate">{drillTitle(id)}</span>
                <button
                  type="button"
                  onClick={() => onAssign(assigned.filter((x) => x !== id))}
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full hover:bg-accent-soft"
                  aria-label={`Remove ${drillTitle(id)}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <select
            value=""
            onChange={(e) => {
              const id = e.target.value;
              if (id && !assigned.includes(id)) onAssign([...assigned, id]);
            }}
            disabled={available.length === 0}
            className="mt-3 w-full rounded-pill border hairline bg-surface-2 px-4 py-2.5 text-[15px] text-ink disabled:opacity-50"
            aria-label={`Assign a drill to ${r.name}`}
          >
            <option value="">
              {available.length ? 'Assign a drill' : 'Every drill is assigned'}
            </option>
            {available.map((d) => (
              <option key={d.id} value={d.id}>
                {d.order}. {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

function Mini({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="t-caption text-ink-3">{label}</dt>
      <dd className={cn('t-callout truncate font-medium', warn ? 'text-caution' : 'text-ink')}>
        {value}
      </dd>
    </div>
  );
}
