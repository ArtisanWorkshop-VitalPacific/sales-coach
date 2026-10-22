'use client';

import { ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Avatar } from '@/components/avatar';
import { Button, ButtonLink, Card, ChevronLink, Difficulty, Section, Stat } from '@/components/ui';
import { companies, contentIndex, drills, jobLabel, scenarios } from '@/lib/content';
import { SessionRow } from '@/components/session-row';
import { type StoredSession, useProfile, useSessions } from '@/lib/store';
import { useCapabilities } from '@/lib/use-capabilities';

function greeting(now: Date | null) {
  if (!now) return 'Welcome';
  const h = now.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function stats(sessions: StoredSession[]) {
  const weekAgo = Date.now() - 7 * 86400000;
  const week = sessions.filter((s) => new Date(s.createdAt).getTime() > weekAgo);
  const recent = sessions.slice(0, 10);
  const avg = recent.length
    ? Math.round(recent.reduce((a, s) => a + s.debrief.overall, 0) / recent.length)
    : null;
  const days = new Set(sessions.map((s) => new Date(s.createdAt).toDateString()));
  let streak = 0;
  for (let d = new Date(); days.has(d.toDateString()); d.setDate(d.getDate() - 1)) streak++;
  const skillTotals = new Map<string, { sum: number; n: number; name: string }>();
  for (const s of recent) {
    for (const k of s.debrief.skills) {
      if (k.score === null) continue;
      const t = skillTotals.get(k.skillId) ?? { sum: 0, n: 0, name: k.name };
      t.sum += k.score;
      t.n++;
      skillTotals.set(k.skillId, t);
    }
  }
  const best = [...skillTotals.values()].sort((a, b) => b.sum / b.n - a.sum / a.n)[0];
  return { week: week.length, avg, streak, best: best?.name ?? null };
}

export default function HomePage() {
  const [profile, setProfile] = useProfile();
  const { sessions } = useSessions();
  const { caps, loaded } = useCapabilities();
  const all = sessions ?? [];
  const s = stats(all);

  const passedDrills = useMemo(
    () => new Set(all.filter((x) => x.drillId && x.debrief.passed).map((x) => x.drillId!)),
    [all],
  );
  const track = drills();
  const nextDrill = track.find((d) => !passedDrills.has(d.id)) ?? track[0];
  const firstCall = useMemo(() => {
    const done = new Set(all.map((x) => x.scenarioId));
    const list = scenarios().sort((a, b) => a.difficulty - b.difficulty);
    return list.find((x) => !done.has(x.id)) ?? list[0];
  }, [all]);
  const company = contentIndex().company(profile.companyId);
  // Time-based text renders after mount so the static page never disagrees with the device clock.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  return (
    <div>
      <header className="reveal mb-10 md:mb-14">
        <p className="t-callout min-h-[1.4em] font-semibold text-ink-3">
          {now?.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="t-hero mt-2 text-ink">
          {greeting(now)}
          {profile.name ? `, ${profile.name.split(' ')[0]}.` : '.'}
        </h1>
        <p className="t-body-lg mt-4 max-w-xl text-ink-3">
          Practice the call before the call. Real customers. Real pushback. A coach who tells you
          exactly what to fix.
        </p>
      </header>

      {loaded && caps && !caps.brain && (
        <div className="reveal mb-8 flex items-start gap-3 rounded-lg bg-surface-2 p-4 ring-1 ring-line md:items-center">
          <Sparkles className="mt-0.5 shrink-0 text-ink-3 md:mt-0" size={18} />
          <p className="t-callout text-ink-2">
            <span className="font-semibold text-ink">Demo mode.</span> Customers run on built-in
            rules and your browser&rsquo;s voices. Add a Claude key and they come to life.{' '}
            <Link href="/portal?tab=setup" className="text-accent hover:underline">
              How to turn it on
            </Link>
          </p>
        </div>
      )}

      {!profile.onboarded && (
        <Onboarding
          onDone={(name, companyId) => setProfile({ name, companyId, onboarded: true })}
        />
      )}

      <div className="mb-12 grid gap-5 lg:grid-cols-5">
        {nextDrill && (
          <Link
            href={`/drills/${nextDrill.id}`}
            className="reveal group relative overflow-hidden rounded-xl bg-[#000] p-7 text-[#f5f5f7] shadow-float md:p-10 lg:col-span-3"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-voice opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-45" />
            <p className="t-callout font-semibold text-[#a1a1a6]">
              Today&rsquo;s drill · {Math.round(nextDrill.durationSec / 60) || 1} min
            </p>
            <h2 className="t-display mt-3 max-w-md">{nextDrill.title}</h2>
            <p className="t-body mt-4 max-w-md text-[#a1a1a6]">{firstSentence(nextDrill.why)}</p>
            <span className="btn btn-primary mt-8">
              Start the drill <ArrowRight size={18} />
            </span>
          </Link>
        )}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {firstCall && (
            <Card className="reveal flex flex-1 flex-col p-6 [animation-delay:120ms]">
              <p className="t-callout font-semibold text-ink-3">
                {all.length ? 'Your next call' : 'Your first call'}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar
                  name={contentIndex().persona(firstCall.personaId).name}
                  seed={firstCall.personaId}
                  size={44}
                />
                <div className="min-w-0">
                  <p className="t-headline truncate text-ink">{firstCall.title}</p>
                  <p className="t-caption text-ink-3">
                    {contentIndex().persona(firstCall.personaId).name} ·{' '}
                    {jobLabel(firstCall.jobType)}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-6">
                <Difficulty level={firstCall.difficulty} />
                <ButtonLink href={`/practice/${firstCall.id}`} size="sm">
                  Brief me
                </ButtonLink>
              </div>
            </Card>
          )}
          <Card className="reveal flex flex-1 flex-col p-6 [animation-delay:200ms]">
            <p className="t-callout flex items-center gap-2 font-semibold text-ink-3">
              <Briefcase size={16} /> Rehearse your next job
            </p>
            <p className="t-body mt-3 text-ink-2">
              {caps?.servicetitan
                ? 'Your next appointment loads from ServiceTitan: the job, the equipment, the history. First names only.'
                : 'Connect ServiceTitan and your next appointment becomes a practice call. Try a sample job now.'}
            </p>
            <div className="mt-auto pt-5">
              <ButtonLink href="/call?job=demo" variant="secondary" size="sm">
                Rehearse a sample job
              </ButtonLink>
            </div>
          </Card>
        </div>
      </div>

      <Section>
        <Card className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4 md:p-8">
          <Stat label="Calls this week" value={s.week} />
          <Stat
            label="Average score"
            value={s.avg ?? '–'}
            hint={s.avg !== null ? 'Last 10 calls' : 'No calls yet'}
          />
          <Stat label="Streak" value={`${s.streak} ${s.streak === 1 ? 'day' : 'days'}`} />
          <Stat
            label="Strongest skill"
            value={<span className="t-headline">{s.best ?? '–'}</span>}
          />
        </Card>
      </Section>

      <Section
        title="Recent calls"
        action={all.length > 0 ? <ChevronLink href="/progress">All calls</ChevronLink> : undefined}
      >
        {sessions === null ? null : all.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="t-headline text-ink">No calls yet.</p>
            <p className="t-callout mt-2 text-ink-3">
              Your first one takes about five minutes. Headphones help.
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

      {company && (
        <p className="t-caption text-center text-ink-4">
          Practicing with {company.name}&rsquo;s process.{' '}
          <Link href="/settings" className="text-accent hover:underline">
            Change
          </Link>
        </p>
      )}
    </div>
  );
}

function firstSentence(text: string) {
  const m = text.match(/^(.+?[.!?])\s/);
  return m ? m[1] : text.slice(0, 140);
}

function Onboarding({ onDone }: { onDone: (name: string, companyId: string) => void }) {
  const [name, setName] = useState('');
  const list = companies();
  const [companyId, setCompanyId] = useState(
    list.find((c) => c.id === 'demo-company')?.id ?? list[0]?.id ?? 'demo-company',
  );
  return (
    <Card className="reveal mb-10 p-6 md:p-8">
      <p className="t-headline text-ink">Let&rsquo;s get you set up.</p>
      <p className="t-callout mt-1 text-ink-3">Two things, ten seconds. Stays on this device.</p>
      <form
        className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          onDone(name.trim(), companyId);
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          className="rounded-md border hairline bg-surface-2 px-4 py-3 text-[17px] outline-none focus:border-accent"
          autoComplete="given-name"
        />
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="rounded-md border hairline bg-surface-2 px-4 py-3 text-[17px]"
          aria-label="Company"
        >
          {list.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button type="submit">Save</Button>
      </form>
    </Card>
  );
}
