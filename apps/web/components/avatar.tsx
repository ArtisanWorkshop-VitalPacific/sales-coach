import { cn } from './ui';

/** Where the light catches each pearl, so customers side by side are easy to tell apart. */
const SPOTS: [number, number][] = [
  [34, 28],
  [62, 26],
  [42, 20],
  [28, 40],
  [58, 36],
  [48, 30],
  [30, 30],
  [66, 42],
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

/** Every customer is a pearl: white and grey, lit from one side, with their initials. */
export function Avatar({
  name,
  seed,
  size = 48,
  live = false,
  className,
}: {
  name: string;
  seed?: string;
  size?: number;
  /** Let the sheen turn: for the customer on the call right now. */
  live?: boolean;
  className?: string;
}) {
  const [x, y] = SPOTS[hash(seed ?? name) % SPOTS.length]!;
  const s = (k: number) => Math.round(size * k);
  return (
    <span
      className={cn(
        'pearl inline-grid shrink-0 select-none place-items-center font-medium text-[#44403B]',
        live && 'pearl-live',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: s(0.34),
        letterSpacing: '-0.02em',
        background: `radial-gradient(circle at ${x}% ${y}%, #FFFFFF 0%, #FFFFFF 8%, #F5F3F1 28%, #EBE8E4 50%, #D7D2CC 74%, #A59F97 95%, #777169 100%)`,
        boxShadow: `inset 0 -${s(0.1)}px ${s(0.22)}px rgba(68, 64, 59, 0.16), inset 0 ${s(0.07)}px ${s(0.16)}px rgba(255, 255, 255, 0.9), 0 0 0 0.5px rgba(0, 0, 0, 0.07), 0 ${s(0.1)}px ${s(0.26)}px rgba(0, 0, 0, 0.07)`,
      }}
      aria-hidden
    >
      <span className="relative z-[1]">{initials(name)}</span>
    </span>
  );
}
