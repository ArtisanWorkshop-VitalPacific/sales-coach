import { inkOn, Orb, orbFor } from './orb';

export function initials(name: string) {
  const parts = name.replace(/&/g, ' ').split(/\s+/).filter(Boolean);
  return (
    (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')
  ).toUpperCase();
}

/** Every person is an orb with their initials. Same seed, same orb, every time. */
export function Avatar({
  name,
  seed,
  size = 48,
  live = false,
  showInitials = true,
  className,
}: {
  name: string;
  seed?: string;
  size?: number;
  /** Let the colors turn: for the customer on the call right now. */
  live?: boolean;
  showInitials?: boolean;
  className?: string;
}) {
  const orb = orbFor(seed ?? name);
  return (
    <Orb name={orb} size={size} live={live} className={className}>
      {showInitials && (
        <span
          aria-hidden
          className="font-medium"
          style={{ color: inkOn(orb), fontSize: Math.round(size * 0.34), letterSpacing: '-0.02em' }}
        >
          {initials(name)}
        </span>
      )}
    </Orb>
  );
}
