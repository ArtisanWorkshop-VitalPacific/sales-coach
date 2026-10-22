'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Card, Chip, cn, PageHeader } from '@/components/ui';
import { drills } from '@/lib/content';
import { useSessions } from '@/lib/store';

const STAGES: Record<string, string> = {
  door: 'At the door',
  discovery: 'Discovery',
  findings: 'Findings',
  options: 'Options',
  price: 'Price',
  objections: 'Objections',
  close: 'The close',
  recovery: 'Recovery',
};

export default function DrillsPage() {
  const { sessions } = useSessions();
  const status = useMemo(() => {
    const m = new Map<string, 'passed' | 'tried'>();
    for (const s of sessions ?? []) {
      if (!s.drillId) continue;
      if (s.debrief.passed) m.set(s.drillId, 'passed');
      else if (!m.has(s.drillId)) m.set(s.drillId, 'tried');
    }
    return m;
  }, [sessions]);
  const track = drills();
  const passed = track.filter((d) => status.get(d.id) === 'passed').length;
  const stages = [...new Set(track.map((d) => d.stage))];

  return (
    <div>
      <PageHeader
        eyebrow="Drills"
        title="One moment. Done right."
        lead="The moments that make or break a sale, one at a time. A short lesson, a live rep, and a coach who tells you what to change."
        actions={
          <div className="text-right">
            <p className="t-title tabular-nums text-ink">
              {passed}/{track.length}
            </p>
            <p className="t-caption text-ink-3">passed</p>
          </div>
        }
      />
      <div className="mb-10 h-[6px] w-full overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-voice transition-[width] duration-700" style={{ width: `${(passed / Math.max(1, track.length)) * 100}%` }} />
      </div>
      {stages.map((stage) => (
        <section key={stage} className="mb-10">
          <h2 className="t-headline mb-3 text-ink-2">{STAGES[stage] ?? stage}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {track
              .filter((d) => d.stage === stage)
              .map((d) => {
                const st = status.get(d.id);
                return (
                  <Link key={d.id} href={`/drills/${d.id}`}>
                    <Card className="flex h-full items-start gap-4 p-5 transition-transform duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-float">
                      <span
                        className={cn(
                          't-callout grid h-9 w-9 shrink-0 place-items-center rounded-full font-semibold tabular-nums',
                          st === 'passed' ? 'bg-positive-fill text-white' : 'bg-surface-3 text-ink-2',
                        )}
                      >
                        {st === 'passed' ? <Check size={17} /> : d.order}
                      </span>
                      <div className="min-w-0">
                        <p className="t-body font-medium text-ink">{d.title}</p>
                        <p className="t-caption mt-1 text-ink-3">
                          {Math.max(1, Math.round(d.durationSec / 60))} min{st === 'tried' ? ' · Tried' : ''}
                        </p>
                      </div>
                      {st === 'tried' && <Chip className="ml-auto" tone="caution">Again</Chip>}
                    </Card>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
