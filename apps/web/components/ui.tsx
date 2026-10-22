import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type BtnSize = 'sm' | 'md' | 'lg';
const btnClass = (v: BtnVariant = 'primary', s: BtnSize = 'md', extra?: string) =>
  cn('btn', `btn-${v}`, s === 'lg' && 'btn-lg', s === 'sm' && 'btn-sm', extra);

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<'button'> & { variant?: BtnVariant; size?: BtnSize }) {
  return <button type="button" className={btnClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: BtnVariant; size?: BtnSize }) {
  return <Link className={btnClass(variant, size, className)} {...props} />;
}

/** Apple-style text link with a chevron. */
export function ChevronLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1 text-accent hover:underline t-callout',
        className,
      )}
    >
      {children}
      <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden className="mt-px">
        <path
          d="M1.5 1l5 5-5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('card', className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('t-callout font-semibold text-ink-3', className)}>{children}</p>;
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'reveal mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h1 className="t-display text-ink">{title}</h1>
        {lead && <p className="t-body-lg mt-3 text-ink-3">{lead}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function Chip({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone?: 'accent' | 'positive' | 'caution' | 'negative' | 'voice';
  className?: string;
}) {
  const toneClass =
    tone === 'accent'
      ? 'bg-accent-soft text-accent'
      : tone === 'positive'
        ? 'bg-positive-soft text-positive'
        : tone === 'caution'
          ? 'bg-caution-soft text-caution'
          : tone === 'negative'
            ? 'bg-negative-soft text-negative'
            : tone === 'voice'
              ? 'bg-voice text-[#1d1d1f]'
              : '';
  return <span className={cn('chip', toneClass, className)}>{children}</span>;
}

export function Difficulty({ level, className }: { level: number; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-[3px]', className)}
      aria-label={`Difficulty ${level} of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn('h-[6px] w-[6px] rounded-full', i <= level ? 'bg-ink' : 'bg-surface-3')}
        />
      ))}
    </span>
  );
}

export function Bar({
  value,
  tone = 'accent',
  className,
}: {
  value: number | null;
  tone?: 'accent' | 'positive' | 'caution' | 'negative' | 'auto';
  className?: string;
}) {
  const v = value ?? 0;
  const t = tone === 'auto' ? (v >= 80 ? 'positive' : v >= 60 ? 'accent' : 'caution') : tone;
  const fill = {
    accent: 'bg-accent',
    positive: 'bg-positive-fill',
    caution: 'bg-caution-fill',
    negative: 'bg-negative-fill',
  }[t];
  return (
    <div className={cn('h-[6px] w-full overflow-hidden rounded-full bg-surface-3', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-700 ease-apple',
          fill,
          value === null && 'opacity-0',
        )}
        style={{ width: `${Math.max(2, Math.min(100, v))}%` }}
      />
    </div>
  );
}

/** Score ring. */
export function Ring({
  value,
  size = 160,
  stroke = 12,
  label,
  sublabel,
  tone = 'auto',
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
  tone?: 'auto' | 'voice';
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const color =
    v >= 80
      ? 'var(--sc-color-positive-fill)'
      : v >= 60
        ? 'var(--sc-color-accent)'
        : 'var(--sc-color-caution-fill)';
  const id = `ring-${size}-${stroke}`;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        {tone === 'voice' && (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C8A0FF" />
              <stop offset="100%" stopColor="#7AB8FF" />
            </linearGradient>
          </defs>
        )}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--sc-color-surface-3)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone === 'voice' ? `url(#${id})` : color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="t-display leading-none tabular-nums">{label ?? Math.round(v)}</div>
          {sublabel && <div className="t-caption mt-1 text-ink-3">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div className={cn('inline-flex rounded-pill bg-surface-3 p-[3px]', className)} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-pill font-medium transition-all duration-200',
            size === 'sm' ? 'px-3 py-1 text-[13px]' : 'px-4 py-1.5 text-[15px]',
            o.value === value
              ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
              : 'text-ink-3 hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 py-3">
      <span>
        <span className="t-body block text-ink">{label}</span>
        {hint && <span className="t-caption block text-ink-3">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-positive-fill' : 'bg-surface-3',
        )}
      >
        <span
          className={cn(
            'absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15)] transition-transform duration-200',
            checked && 'translate-x-[20px]',
          )}
        />
      </button>
    </label>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div>
      <div className="t-caption text-ink-3">{label}</div>
      <div className="t-title tabular-nums text-ink">{value}</div>
      {hint && <div className="t-caption text-ink-3">{hint}</div>}
    </div>
  );
}

export function Empty({
  title,
  body,
  action,
}: {
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <p className="t-headline text-ink">{title}</p>
      {body && <p className="t-callout mt-2 max-w-md text-ink-3">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Section({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('mb-12', className)}>
      {(title || action) && (
        <div className="mb-4 flex items-end justify-between gap-4">
          {title && <h2 className="t-title text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-surface-3', className)} />;
}
