import { cn } from './ui';

const HUES = [
  ['#FFD6E0', '#FFB4C8'],
  ['#D7E8FF', '#A9CCFF'],
  ['#E3D9FF', '#C6B3FF'],
  ['#D5F5E3', '#A8E8C5'],
  ['#FFE8CC', '#FFCF99'],
  ['#D9F2FA', '#A6E0F2'],
  ['#F2E2D2', '#E2C3A3'],
  ['#E8E8ED', '#CFCFD6'],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function initials(name: string) {
  const parts = name.replace(/&/g, ' ').split(/\s+/).filter(Boolean);
  return (
    (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')
  ).toUpperCase();
}

/** A soft, friendly monogram. Customers are characters, not photos. */
export function Avatar({
  name,
  seed,
  size = 48,
  className,
}: {
  name: string;
  seed?: string;
  size?: number;
  className?: string;
}) {
  const [a, b] = HUES[hash(seed ?? name) % HUES.length]!;
  return (
    <span
      className={cn(
        'inline-grid shrink-0 select-none place-items-center rounded-full font-semibold text-[#1d1d1f]',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        letterSpacing: '-0.02em',
        background: `linear-gradient(145deg, ${a}, ${b})`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
