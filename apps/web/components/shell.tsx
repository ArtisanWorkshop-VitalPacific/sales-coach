'use client';

import { Building2, Gauge, House, Phone, Settings, Target, Tv, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useProfile } from '@/lib/store';
import { Wordmark } from './logo';
import { cn } from './ui';

const TECH = [
  { href: '/', label: 'Home', icon: House },
  { href: '/practice', label: 'Practice', icon: Phone },
  { href: '/drills', label: 'Drills', icon: Target },
  { href: '/progress', label: 'Progress', icon: Gauge },
];
const LEAD = [
  { href: '/team', label: 'Team', icon: Users },
  { href: '/portal', label: 'Portal', icon: Building2 },
];

function active(path: string, href: string) {
  return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [profile, setProfile] = useProfile();
  const lead = profile.role !== 'tech';
  const links = lead ? [...TECH, ...LEAD] : TECH;
  const mobile = lead
    ? [TECH[0]!, TECH[1]!, TECH[2]!, LEAD[0]!, LEAD[1]!]
    : [...TECH, { href: '/settings', label: 'Settings', icon: Settings }];

  return (
    <div className="min-h-dvh">
      {/* A glass capsule that floats over the page. */}
      <header className="sticky top-0 z-40 px-3 pt-[max(10px,env(safe-area-inset-top))] md:px-5 md:pt-4">
        <div className="glass mx-auto flex h-14 max-w-[1200px] items-center gap-6 rounded-pill pr-2 pl-5">
          <Link href="/" aria-label="Sales Coach home">
            <Wordmark />
          </Link>
          <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-pill px-3.5 py-1.5 text-[14px] transition-colors',
                  active(path, l.href)
                    ? 'bg-surface text-ink shadow-ring'
                    : 'text-ink-3 hover:text-ink',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <label className="sr-only" htmlFor="role">
              View as
            </label>
            <select
              id="role"
              value={profile.role}
              onChange={(e) => setProfile({ role: e.target.value as typeof profile.role })}
              className="h-9 rounded-pill bg-surface-2 pr-9 pl-3.5 text-[13px] text-ink-2 shadow-[inset_0_0_0_0.5px_var(--sc-color-line)]"
              title="Switch view (demo). Sign-in sets this automatically once accounts are on."
            >
              <option value="tech">Tech view</option>
              <option value="manager">Manager view</option>
              <option value="owner">Owner view</option>
            </select>
            {lead && (
              <Link
                href="/training-day"
                className="hidden h-10 w-10 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink sm:grid"
                title="Training day mode"
                aria-label="Training day mode"
              >
                <Tv size={19} />
              </Link>
            )}
            <Link
              href="/settings"
              className="hidden h-10 w-10 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink md:grid"
              aria-label="Settings"
            >
              <Settings size={19} />
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 pt-8 pb-32 md:pt-14 md:pb-20">{children}</main>
      <nav
        className="glass fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 rounded-[28px] md:hidden"
        aria-label="Tabs"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 px-1.5 py-1.5">
          {mobile.map((l) => {
            const on = active(path, l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-[22px] py-1.5 text-[10px] font-medium transition-colors',
                  on ? 'bg-surface text-ink shadow-ring' : 'text-ink-3',
                )}
              >
                <Icon size={21} strokeWidth={on ? 2 : 1.7} />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
