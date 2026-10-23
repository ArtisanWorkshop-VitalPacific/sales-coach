import { cn } from './ui';

/** Placeholder mark: a voice wave rising, in black and white. Pending SRV LAB brand review. */
export function Mark({
  size = 28,
  className,
  inverted = false,
}: {
  size?: number;
  className?: string;
  inverted?: boolean;
}) {
  const tile = inverted ? 'var(--sc-color-bg)' : 'var(--sc-color-ink)';
  const bars = inverted ? 'var(--sc-color-ink)' : 'var(--sc-color-bg)';
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden>
      <rect width="28" height="28" rx="8" fill={tile} />
      <rect x="6.5" y="12" width="3" height="6" rx="1.5" fill={bars} />
      <rect x="12.5" y="7.5" width="3" height="13" rx="1.5" fill={bars} />
      <rect x="18.5" y="10" width="3" height="8" rx="1.5" fill={bars} />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-ink', className)}>
      <Mark size={24} />
      <span className="text-[17px] font-semibold tracking-[-0.025em]">Sales Coach</span>
    </span>
  );
}
