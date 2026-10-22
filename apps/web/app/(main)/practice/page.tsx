'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Avatar } from '@/components/avatar';
import { Card, Chip, Difficulty, PageHeader, Segmented } from '@/components/ui';
import { contentIndex, DIFFICULTY_LABEL, jobLabel, scenarios } from '@/lib/content';
import { useSessions } from '@/lib/store';

type Filter = 'all' | 'water' | 'drain' | 'other';
const group = (jobType: string): Exclude<Filter, 'all'> =>
  /water-heater|tankless/.test(jobType) ? 'water' : /drain|sewer|clog|jetting/.test(jobType) ? 'drain' : 'other';

export default function PracticePage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [level, setLevel] = useState<'all' | 'easy' | 'real' | 'hard'>('all');
  const { sessions } = useSessions();
  const best = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sessions ?? []) m.set(s.scenarioId, Math.max(m.get(s.scenarioId) ?? 0, s.debrief.overall));
    return m;
  }, [sessions]);
  const index = contentIndex();
  const list = scenarios()
    .filter((s) => filter === 'all' || group(s.jobType) === filter)
    .filter((s) => level === 'all' || (level === 'easy' ? s.difficulty <= 2 : level === 'real' ? s.difficulty === 3 : s.difficulty >= 4))
    .sort((a, b) => a.difficulty - b.difficulty || a.title.localeCompare(b.title));

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Pick a customer. Make the call."
        lead="Every customer has a story, a budget, and a worry they have not told you yet. Find it."
      />
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All jobs' },
            { value: 'water', label: 'Water heaters' },
            { value: 'drain', label: 'Drains' },
            { value: 'other', label: 'Repairs' },
          ]}
        />
        <Segmented
          size="sm"
          value={level}
          onChange={setLevel}
          options={[
            { value: 'all', label: 'Any level' },
            { value: 'easy', label: 'Warm-up' },
            { value: 'real', label: 'Real world' },
            { value: 'hard', label: 'Tough' },
          ]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => {
          const p = index.persona(s.personaId);
          const score = best.get(s.id);
          return (
            <Link key={s.id} href={`/practice/${s.id}`} className="reveal" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <Card className="flex h-full flex-col p-5 transition-transform duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-float">
                <div className="flex items-start justify-between gap-3">
                  <Avatar name={p.name} seed={p.id} size={44} />
                  <div className="flex items-center gap-2">
                    {p.language === 'es' && <Chip>Español</Chip>}
                    {score !== undefined && <Chip tone={score >= s.passBar ? 'positive' : undefined}>Best {score}</Chip>}
                  </div>
                </div>
                <p className="t-headline mt-4 text-ink">{s.title}</p>
                <p className="t-callout mt-1 line-clamp-2 text-ink-3">{p.card}</p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="t-caption text-ink-3">
                    {p.name.split(' ')[0]} · {jobLabel(s.jobType)}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="t-caption text-ink-4">{DIFFICULTY_LABEL[s.difficulty]}</span>
                    <Difficulty level={s.difficulty} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      {list.length === 0 && <p className="t-body mt-10 text-center text-ink-3">No customers match. Try another filter.</p>}
    </div>
  );
}
