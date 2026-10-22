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
    return (sessions ?? []).filter((s) => new Date(s.createdAt).toDateString() === day && s.kind !== 'drill');
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
    router.push(`/call?scenario=${scenarioId}&d=${d}&c=${encodeURIComponent(profile.companyId)}&tv=1`);
  };

  return (
    <div className="min-h-dvh bg-[#000] px-6 py-8 text-[#f5f5f7] md:px-12 md:py-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex items-center justify-between">
          <Link href="/team" className="flex items-center gap-2 text-[15px] text-[#a1a1a6] hover:text-white">
            <ArrowLeft size={18} /> Exit training day
          </Link>
          <span className="flex items-center gap-2 text-[#a1a1a6]">
            <Mark size={22} inverted /> Sales Coach
          </span>
        </div>

        <h1 className="text-[56px] leading-[1.03] font-bold tracking-[-0.035em] md:text-[96px]">
          Training day<span className="text-voice">.</span>
        </h1>
        <p className="mt-4 max-w-3xl text-[22px] text-[#a1a1a6] md:text-[28px]">One tech on the mic. The whole shop learns.</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-[15px] font-semibold tracking-wide text-[#86868b]">1. Who is on the mic</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {roster.map((n) => (
                <span key={n} className="group relative">
                  <button
                    type="button"
                    onClick={() => setTech(n)}
                    className={cn(
                      'rounded-pill px-6 py-3 text-[20px] font-medium transition-colors',
                      tech === n ? 'bg-[#f5f5f7] text-black' : 'bg-[#1d1d1f] text-[#f5f5f7] hover:bg-[#2c2c2e]',
                    )}
                  >
                    {n}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${n}`}
                    onClick={() => save(roster.filter((x) => x !== n))}
                    className="absolute -top-2 -right-2 hidden rounded-full bg-[#3a3a3c] p-1 group-hover:block"
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
                  className="rounded-pill bg-[#1d1d1f] px-6 py-3 text-[20px] text-white outline-none placeholder:text-[#6e6e73] focus:ring-2 focus:ring-[#2997ff]"
                />
              </form>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <h2 className="text-[15px] font-semibold tracking-wide text-[#86868b]">2. How tough</h2>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setD(v)}
                  className={cn('rounded-pill px-4 py-2 text-[17px]', d === v ? 'bg-[#f5f5f7] text-black' : 'bg-[#1d1d1f] text-[#a1a1a6]')}
                >
                  {DIFFICULTY_LABEL[v]}
                </button>
              ))}
            </div>

            <h2 className="mt-10 text-[15px] font-semibold tracking-wide text-[#86868b]">3. Pick the customer</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((s) => {
                const p = index.persona(s.personaId);
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={!tech}
                    onClick={() => start(s.id)}
                    className="rounded-xl bg-[#1d1d1f] p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2c2c2e] disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar name={p.name} seed={p.id} size={56} />
                      <div>
                        <p className="text-[20px] font-semibold">{p.name}</p>
                        <p className="text-[15px] text-[#a1a1a6]">{jobLabel(s.jobType)}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[17px] text-[#d2d2d7]">{s.title}</p>
                    <div className="mt-4 flex items-center justify-between text-[#86868b]">
                      <span className="text-[14px]">{DIFFICULTY_LABEL[s.difficulty]} as written</span>
                      <span className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={cn('h-2 w-2 rounded-full', i <= s.difficulty ? 'bg-[#f5f5f7]' : 'bg-[#3a3a3c]')} />
                        ))}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {!tech && <p className="mt-4 text-[17px] text-[#86868b]">Pick or add a tech first.</p>}
          </div>

          <aside>
            <div className="sticky top-8 rounded-xl bg-[#1d1d1f] p-7">
              <h2 className="flex items-center gap-2 text-[22px] font-semibold">
                <Trophy size={22} className="text-[#ffb340]" /> Today&rsquo;s board
              </h2>
              {board.length === 0 ? (
                <p className="mt-4 text-[17px] text-[#86868b]">First call sets the bar.</p>
              ) : (
                <ol className="mt-5 space-y-4">
                  {board.map(([name, e], i) => (
                    <li key={name} className="flex items-center gap-4">
                      <span className={cn('w-6 text-[20px] font-bold tabular-nums', i === 0 ? 'text-voice' : 'text-[#6e6e73]')}>{i + 1}</span>
                      <span className="flex-1 truncate text-[20px]">{name}</span>
                      <span className="text-[13px] text-[#86868b]">{e.calls} {e.calls === 1 ? 'call' : 'calls'}</span>
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
