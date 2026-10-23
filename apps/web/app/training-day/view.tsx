'use client';

import { ArrowLeft, Trophy, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Avatar } from '@/components/avatar';
import { Mark } from '@/components/logo';
import { cn } from '@/components/ui';
import { contentIndex, DIFFICULTY_LABEL, jobLabel, scenarios } from '@/lib/content';
import { useProfile, useSessions } from '@/lib/store';

const ROSTER_KEY = 'sc.trainingRoster';

function loadRoster(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(ROSTER_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

/** Big-screen mode for the shop TV: one tech on the mic, the whole team learns. */
export function TrainingDay() {
  const router = useRouter();
  const [profile] = useProfile();
  const { sessions } = useSessions();
  const [roster, setRoster] = useState<string[]>([]);
  const [tech, setTech] = useState('');
  const [newName, setNewName] = useState('');
  const [d, setD] = useState(3);
  useEffect(() => setRoster(loadRoster()), []);
  const save = (r: string[]) => {
    setRoster(r);
    try {
      window.localStorage.setItem(ROSTER_KEY, JSON.stringify(r));
    } catch {
      /* ignore */
    }
  };

  const today = useMemo(() => {
    const day = new Date().toDateString();
    return (sessions ?? []).filter(
      (s) => new Date(s.createdAt).toDateString() === day && s.kind !== 'drill',
    );
  }, [sessions]);
  const board = useMemo(() => {
    const m = new Map<string, { best: number; calls: number }>();
    for (const s of today) {
      const e = m.get(s.techName) ?? { best: 0, calls: 0 };
      e.best = Math.max(e.best, s.debrief.overall);
      e.calls++;
      m.set(s.techName, e);
    }
    return [...m].sort((a, b) => b[1].best - a[1].best);
  }, [today]);

  const list = scenarios().sort((a, b) => a.difficulty - b.difficulty);
  const index = contentIndex();

  const start = (scenarioId: string) => {
    if (!tech) return;
    try {
      window.sessionStorage.setItem('sc.trainingTech', tech);
    } catch {
      /* ignore */
    }
    router.push(
      `/call?scenario=${scenarioId}&d=${d}&c=${encodeURIComponent(profile.companyId)}&tv=1`,
    );
  };

  return (
    <div className="min-h-dvh px-6 py-8 text-ink md:px-12 md:py-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/team"
            className="flex items-center gap-2 text-[15px] text-ink-3 hover:text-ink"
          >
            <ArrowLeft size={18} /> Exit training day
          </Link>
          <span className="flex items-center gap-2 text-ink-3">
            <Mark size={22} /> Sales Coach
          </span>
        </div>

        <h1 className="text-[56px] leading-[1.03] font-light tracking-[-0.03em] md:text-[96px]">
          Training day.
        </h1>
        <p className="mt-4 max-w-3xl text-[22px] text-ink-3 md:text-[28px]">
          One tech on the mic. The whole shop learns.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-[15px] font-medium text-ink-3">1. Who is on the mic</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {roster.map((n) => (
                <span key={n} className="group relative">
                  <button
                    type="button"
                    onClick={() => setTech(n)}
                    className={cn(
                      'rounded-pill px-6 py-3 text-[20px] font-medium transition-colors',
                      tech === n ? 'bg-accent text-accent-ink' : 'btn-glass text-ink',
                    )}
                  >
                    {n}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${n}`}
                    onClick={() => save(roster.filter((x) => x !== n))}
                    className="absolute -top-2 -right-2 hidden rounded-full bg-surface-3 p-1 text-ink group-hover:block"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const n = newName.trim();
                  if (!n) return;
                  if (!roster.includes(n)) save([...roster, n]);
                  setTech(n);
                  setNewName('');
                }}
              >
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Add a tech"
                  className="rounded-pill bg-surface px-6 py-3 text-[20px] text-ink shadow-ring outline-none focus:shadow-[inset_0_0_0_1.5px_var(--sc-color-ink)]"
                />
              </form>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <h2 className="text-[15px] font-medium text-ink-3">2. How tough</h2>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setD(v)}
                  className={cn(
                    'rounded-pill px-4 py-2 text-[17px]',
                    d === v ? 'bg-accent text-accent-ink' : 'btn-glass text-ink-3',
                  )}
                >
                  {DIFFICULTY_LABEL[v]}
                </button>
              ))}
            </div>

            <h2 className="mt-10 text-[15px] font-medium text-ink-3">3. Pick the customer</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((s) => {
                const p = index.persona(s.personaId);
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={!tech}
                    onClick={() => start(s.id)}
                    className="card p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar name={p.name} seed={p.id} size={56} />
                      <div>
                        <p className="text-[20px] font-semibold">{p.name}</p>
                        <p className="text-[15px] text-ink-3">{jobLabel(s.jobType)}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[17px] text-ink-2">{s.title}</p>
                    <div className="mt-4 flex items-center justify-between text-ink-3">
                      <span className="text-[14px]">
                        {DIFFICULTY_LABEL[s.difficulty]} as written
                      </span>
                      <span className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={cn(
                              'h-2 w-2 rounded-full',
                              i <= s.difficulty ? 'bg-ink' : 'bg-surface-3',
                            )}
                          />
                        ))}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {!tech && <p className="mt-4 text-[17px] text-ink-3">Pick or add a tech first.</p>}
          </div>

          <aside>
            <div className="card sticky top-8 p-7">
              <h2 className="flex items-center gap-2 text-[22px] font-medium">
                <Trophy size={22} className="text-ink" /> Today&rsquo;s board
              </h2>
              {board.length === 0 ? (
                <p className="mt-4 text-[17px] text-ink-3">First call sets the bar.</p>
              ) : (
                <ol className="mt-5 space-y-4">
                  {board.map(([name, e], i) => (
                    <li key={name} className="flex items-center gap-4">
                      <span
                        className={cn(
                          'w-6 text-[20px] font-bold tabular-nums',
                          i === 0 ? 'text-ink' : 'text-ink-4',
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate text-[20px]">{name}</span>
                      <span className="text-[13px] text-ink-3">
                        {e.calls} {e.calls === 1 ? 'call' : 'calls'}
                      </span>
                      <span className="text-[28px] font-semibold tabular-nums">{e.best}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
