'use client';

import Link from 'next/link';
import { decisionLine, formatDuration, relativeDay } from '@/lib/sessions';
import type { StoredSession } from '@/lib/store';
import { Avatar } from './avatar';
import { Chip, cn } from './ui';

export function SessionRow({ s }: { s: StoredSession }) {
  const d = s.debrief;
  return (
    <Link href={`/debrief/${s.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2">
      <Avatar name={s.personaName} seed={s.personaId} size={40} />
      <div className="min-w-0 flex-1">
        <p className="t-body truncate font-medium text-ink">{s.scenarioTitle}</p>
        <p className="t-caption truncate text-ink-3">
          {relativeDay(s.createdAt)} · {formatDuration(s.durationMs)} · {decisionLine(s.personaName, s.record.decision)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {s.kind === 'drill' && <Chip className="hidden sm:inline-flex">Drill</Chip>}
        <span className={cn('t-headline tabular-nums', d.passed ? 'text-positive' : 'text-ink-2')}>{d.overall}</span>
      </div>
    </Link>
  );
}

