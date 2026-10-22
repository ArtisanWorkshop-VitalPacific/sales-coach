'use client';

import { Award } from 'lucide-react';
import { useMemo } from 'react';
import { SessionRow } from '@/components/session-row';
import { Bar, ButtonLink, Card, Chip, cn, Empty, PageHeader, Section } from '@/components/ui';
import { contentIndex, scenarios, SKILL_ORDER } from '@/lib/content';
import { type StoredSession, useSessions } from '@/lib/store';

function averages(list: StoredSession[]) {
  const m = new Map<string, { sum: number; n: number }>();
  for (const s of list) {
    for (const k of s.debrief.skills) {
      if (k.score === null) continue;
      const t = m.get(k.skillId) ?? { sum: 0, n: 0 };
      t.sum += k.score;
      t.n++;
      m.set(k.skillId, t);
    }
  }
  return new Map([...m].map(([k, v]) => [k, Math.round(v.sum / v.n)]));
}

function levelFor(sessions: StoredSession[]) {
  const levels = contentIndex().rubric.levels;
  const full = sessions.filter((s) => s.kind !== 'drill');
  let current = -1;
  levels.forEach((l, i) => {
    if (i === 0) {
      if (full.length > 0) current = 0;
      return;
    }
    if (full.some((s) => s.difficulty >= l.examDifficulty && s.debrief.overall >= l.examPassBar))
      current = i;
  });
  return { levels, current };
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 600;
  const h = 120;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - (v / 100) * h] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h + 8}`}
      className="h-32 w-full"
      preserveAspectRatio="none"
      aria-label="Score trend"
    >
      <line
        x1="0"
        x2={w}
        y1={h - 0.7 * h}
        y2={h - 0.7 * h}
        stroke="var(--sc-color-line-strong)"
        strokeDasharray="4 6"
      />
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="var(--sc-color-accent-soft)" />
      <path
        d={d}
        fill="none"
        stroke="var(--sc-color-accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function ProgressPage() {
  const { sessions } = useSessions();
  const all = sessions ?? [];
  const recent = all.slice(0, 10);
  const prior = all.slice(10, 20);
  const now = useMemo(() => averages(recent), [recent]);
  const before = useMemo(() => averages(prior), [prior]);
  const { levels, current } = levelFor(all);
  const next = levels[current + 1];
  const examScenario = next
    ? scenarios()
        .filter((s) => s.difficulty >= Math.min(next.examDifficulty, 4))
        .sort((a, b) => a.difficulty - b.difficulty)[0]
    : undefined;
  const skills = contentIndex().rubric.skills;
  const trend = [...all]
    .reverse()
    .slice(-20)
    .map((s) => s.debrief.overall);

  return (
    <div>
      <PageHeader
        eyebrow="Progress"
        title="Better every call."
        lead="Your skills, your level, and every call you have made on this device."
      />
      {sessions !== null && all.length === 0 ? (
        <Empty
          title="Nothing to show yet."
          body="Make your first call and your progress starts here."
          action={<ButtonLink href="/practice">Pick a customer</ButtonLink>}
        />
      ) : (
        <>
          <div className="mb-12 grid gap-5 lg:grid-cols-5">
            <Card className="relative overflow-hidden p-6 md:p-8 lg:col-span-2">
              <p className="t-callout flex items-center gap-2 font-semibold text-ink-3">
                <Award size={16} /> Your level
              </p>
              <p className="t-display mt-3 text-ink">
                {current >= 0 ? levels[current]!.name : 'Getting started'}
              </p>
              <div className="mt-5 flex gap-1.5">
                {levels.map((l, i) => (
                  <span
                    key={l.id}
                    className={cn(
                      'h-1.5 flex-1 rounded-full',
                      i <= current ? 'bg-voice' : 'bg-surface-3',
                    )}
                    title={l.name}
                  />
                ))}
              </div>
              {next && (
                <div className="mt-6">
                  <p className="t-callout text-ink-2">
                    <span className="font-semibold text-ink">Next: {next.name}.</span>{' '}
                    {next.requirement}
                  </p>
                  {examScenario && (
                    <ButtonLink
                      href={`/call?scenario=${examScenario.id}&d=${next.examDifficulty}&kind=exam`}
                      size="sm"
                      className="mt-4"
                    >
                      Take the {next.name} call
                    </ButtonLink>
                  )}
                </div>
              )}
            </Card>
            <Card className="p-6 md:p-8 lg:col-span-3">
              <div className="flex items-end justify-between">
                <p className="t-callout font-semibold text-ink-3">Score trend</p>
                <p className="t-caption text-ink-4">Dashed line: pass at 70</p>
              </div>
              {trend.length > 1 ? (
                <Sparkline values={trend} />
              ) : (
                <p className="t-callout mt-8 text-ink-3">Two calls in, your trend shows up here.</p>
              )}
            </Card>
          </div>

          <Section
            title="Skills"
            action={<span className="t-caption text-ink-4">Last 10 calls</span>}
          >
            <Card className="divide-y divide-line">
              {SKILL_ORDER.map((id) => {
                const k = skills.find((s) => s.id === id);
                const v = now.get(id) ?? null;
                const b = before.get(id);
                const delta = v !== null && b !== undefined ? v - b : null;
                return (
                  <div key={id} className="flex items-center gap-4 px-5 py-4 md:px-6">
                    <div className="w-40 shrink-0 md:w-56">
                      <p className="t-body font-medium text-ink">{k?.name ?? id}</p>
                    </div>
                    <div className="flex-1">
                      <Bar value={v} tone="auto" />
                    </div>
                    <span className="t-body w-10 text-right font-semibold tabular-nums text-ink">
                      {v ?? '–'}
                    </span>
                    <span className="w-14 text-right">
                      {delta !== null && delta !== 0 && (
                        <Chip tone={delta > 0 ? 'positive' : 'caution'}>
                          {delta > 0 ? `+${delta}` : delta}
                        </Chip>
                      )}
                    </span>
                  </div>
                );
              })}
            </Card>
          </Section>

          <Section title="All calls">
            <Card className="divide-y divide-line">
              {all.map((s) => (
                <SessionRow key={s.id} s={s} />
              ))}
            </Card>
          </Section>
        </>
      )}
    </div>
  );
}
