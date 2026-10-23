import tokens from '@sales-coach/design/tokens.json';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from './ui';

type Point = keyof typeof tokens.orb.points;
export type OrbName = keyof typeof tokens.orb.palettes;

export const ORB_NAMES = Object.keys(tokens.orb.palettes) as OrbName[];
const POOLS: Exclude<Point, 'center'>[] = [
  'tl',
  'tr',
  'bl',
  'br',
  'top',
  'bottom',
  'left',
  'right',
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** The same person always gets the same orb. */
export function orbFor(seed: string): OrbName {
  return ORB_NAMES[hash(seed) % ORB_NAMES.length]!;
}

/** Black or white, whichever reads on the orb's middle color. */
export function inkOn(name: OrbName) {
  const hex = tokens.orb.palettes[name].center.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.18 ? '#000000' : '#FFFFFF';
}

/**
 * The color field: a pool of each sampled color at the point it was sampled, over the middle
 * color. The field is drawn 40% larger than the orb so it can turn without showing a corner.
 */
export function orbField(name: OrbName) {
  const p = tokens.orb.palettes[name];
  const at = (v: number) => ((v + 20) / 1.4).toFixed(1);
  const pools = POOLS.map((k) => {
    const [x = 50, y = 50] = tokens.orb.points[k];
    return `radial-gradient(ellipse 30% 30% at ${at(x)}% ${at(y)}%, ${p[k]} 0%, ${p[k]}00 100%)`;
  });
  return [...pools, p.center].join(', ');
}

/**
 * A soft, grainy color orb in the style of the voice orbs on elevenlabs.io. The rest of the
 * interface is white and grey, so this is where the color lives. `live` lets the field turn.
 */
export function Orb({
  name,
  size,
  shade,
  live = false,
  className,
  style,
  children,
}: {
  name: OrbName;
  /** Pixel size. Leave it out to size the orb with classes instead. */
  size?: number;
  /** With class sizing: the size the shading is drawn for. */
  shade?: number;
  live?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const s = size ?? shade ?? 120;
  const k = (f: number) => Math.round(s * f);
  // Placed with absolute or fixed from outside; otherwise it anchors its own layers.
  const placed = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className ?? '');
  return (
    <span
      aria-hidden
      className={cn(
        !placed && 'relative',
        'isolate inline-grid shrink-0 select-none place-items-center overflow-hidden rounded-full',
        className,
      )}
      style={{
        ...(size ? { width: size, height: size } : {}),
        boxShadow: `inset 0 -${k(0.08)}px ${k(0.2)}px rgba(0, 0, 0, 0.14), inset 0 ${k(0.05)}px ${k(0.14)}px rgba(255, 255, 255, 0.28), 0 ${k(0.06)}px ${k(0.18)}px rgba(0, 0, 0, 0.08)`,
        ...style,
      }}
    >
      <span
        aria-hidden
        className={cn('absolute inset-[-20%]', live && 'orb-spin')}
        style={{ background: orbField(name) }}
      />
      <span aria-hidden className="orb-grain absolute inset-0" />
      {children && <span className="relative z-[1]">{children}</span>}
    </span>
  );
}
