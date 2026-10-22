'use client';

import tokens from '@sales-coach/design/tokens.json';
import { Info, Play, RotateCcw } from 'lucide-react';
import { type CSSProperties, type ReactNode, useState } from 'react';
import { Avatar } from '@/components/avatar';
import {
  Bar,
  Button,
  Card,
  ChevronLink,
  Chip,
  cn,
  Difficulty,
  Eyebrow,
  Ring,
  Section,
  Segmented,
  Stat,
  Toggle,
} from '@/components/ui';
import { DIFFICULTY_LABEL } from '@/lib/content';

type Palette = Record<string, string>;

const COLOR_GROUPS: { label: string; keys: string[] }[] = [
  { label: 'Surfaces', keys: ['bg', 'bg-elevated', 'surface', 'surface-2', 'surface-3'] },
  { label: 'Ink', keys: ['ink', 'ink-2', 'ink-3', 'ink-4'] },
  { label: 'Lines', keys: ['line', 'line-strong'] },
  { label: 'Accent', keys: ['accent', 'accent-hover', 'accent-ink', 'accent-soft'] },
  { label: 'Positive', keys: ['positive', 'positive-fill', 'positive-soft'] },
  { label: 'Caution', keys: ['caution', 'caution-fill', 'caution-soft'] },
  { label: 'Negative', keys: ['negative', 'negative-fill', 'negative-soft'] },
  { label: 'Materials', keys: ['glass', 'scrim'] },
];

/** Literal class names so Tailwind picks up every type utility. */
const TYPE_CLASS: Record<string, string> = {
  hero: 't-hero',
  display: 't-display',
  title: 't-title',
  headline: 't-headline',
  'body-lg': 't-body-lg',
  body: 't-body',
  callout: 't-callout',
  caption: 't-caption',
  micro: 't-micro',
};

const TYPE_SAMPLE: Record<string, string> = {
  hero: 'Good morning.',
  display: 'Strong call.',
  title: 'Recent calls',
  headline: 'The silence after price',
  'body-lg': 'Practice the call before the call. Real customers. Real pushback.',
  body: 'A coach who tells you exactly what to fix, and lets you run it again.',
  callout: 'Margaret wants to think about it.',
  caption: 'Today, 9:41 AM · 4:12 · Pass at 70',
  micro: 'CUSTOMER',
};

export default function DesignPage() {
  const light = tokens.color.light as Palette;
  const dark = tokens.color.dark as Palette;

  return (
    <div>
      <header className="reveal mb-8 md:mb-12">
        <p className="t-callout font-semibold text-ink-3">Design system</p>
        <h1 className="t-hero mt-2 text-ink">The details. All of them.</h1>
        <p className="t-body-lg mt-4 max-w-xl text-ink-3">
          Every color, size, curve, and component in {tokens.brand.name}. One source of truth for
          web today, iOS and Android next.
        </p>
      </header>

      <div className="reveal mb-12 flex items-start gap-3 rounded-lg bg-caution-soft p-4 md:items-center md:p-5">
        <Info size={18} className="mt-0.5 shrink-0 text-caution md:mt-0" />
        <p className="t-callout text-ink-2">
          <span className="font-semibold text-ink">Placeholder brand.</span> Pending SRV LAB review.
          Tokens live in <code className="font-mono text-[13px]">packages/design/tokens.json</code>.
        </p>
      </div>

      <Section title="Color">
        <p className="t-body -mt-2 mb-6 max-w-2xl text-ink-3">
          Two themes, one set of names. Pages use the names, so light and dark come free.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          <ThemePanel label="Light" palette={light} />
          <ThemePanel label="Dark" palette={dark} />
        </div>
      </Section>

      <Section title="Gradients">
        <div className="grid gap-5 md:grid-cols-3">
          {Object.entries(tokens.gradient).map(([name, value]) => (
            <Card key={name} className="overflow-hidden">
              <div className="h-32" style={{ background: value }} />
              <div className="p-5">
                <p className="t-body font-medium text-ink">
                  {name === 'voice' ? 'Voice' : name === 'voice-radial' ? 'Voice, radial' : 'Coach'}
                </p>
                <p className="t-caption mt-1 break-all font-mono text-ink-3">{value}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-5 p-6 md:p-8">
          <p className="t-caption font-semibold text-ink-3">The voice, as type</p>
          <p className="t-display text-voice mt-2">Real customers. Real pushback.</p>
        </Card>
      </Section>

      <Section title="Type">
        <Card className="divide-y divide-line">
          {Object.entries(tokens.type).map(([name, t]) => (
            <div
              key={name}
              className="grid gap-3 px-5 py-6 md:grid-cols-[200px_1fr] md:items-baseline md:gap-8 md:px-8"
            >
              <div>
                <p className="t-callout font-semibold text-ink">{name}</p>
                <p className="t-caption mt-0.5 font-mono text-ink-4">
                  {t.size} / {t.line} / {t.tracking} / {t.weight}
                </p>
              </div>
              <p className={cn(TYPE_CLASS[name] ?? 't-body', 'min-w-0 break-words text-ink')}>
                {TYPE_SAMPLE[name] ?? 'Sales Coach'}
              </p>
            </div>
          ))}
        </Card>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {Object.entries(tokens.font).map(([name, stack]) => (
            <Card key={name} className="p-5">
              <p className="t-callout font-semibold capitalize text-ink">{name}</p>
              <p className="mt-2 text-[28px] leading-tight text-ink" style={{ fontFamily: stack }}>
                Aa 0123
              </p>
              <p className="t-caption mt-2 break-words font-mono text-ink-4">{stack}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Radius and depth">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-6 md:p-8">
            <Eyebrow>Radius</Eyebrow>
            <div className="mt-5 grid grid-cols-3 gap-5 sm:grid-cols-5">
              {Object.entries(tokens.radius).map(([name, value]) => (
                <div key={name}>
                  <div
                    className="h-16 bg-surface-3 ring-1 ring-line ring-inset"
                    style={{ borderRadius: value }}
                  />
                  <p className="t-callout mt-2 font-medium text-ink">{name}</p>
                  <p className="t-caption font-mono text-ink-4">{value}</p>
                </div>
              ))}
            </div>
            <p className="t-caption mt-5 text-ink-4">
              Cards use lg. Buttons and chips use pill. Nothing is square.
            </p>
          </Card>
          <Card className="p-6 md:p-8">
            <Eyebrow>Shadow</Eyebrow>
            <div className="mt-5 grid grid-cols-2 gap-5">
              {Object.entries(tokens.shadow).map(([name, value]) => (
                <div key={name}>
                  <div className="h-24 rounded-lg bg-surface" style={{ boxShadow: value }} />
                  <p className="t-callout mt-3 font-medium text-ink">{name}</p>
                  <p className="t-caption break-words font-mono text-ink-4">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="mt-5 p-6 md:p-8">
          <Eyebrow>Space</Eyebrow>
          <div className="mt-5 space-y-2.5">
            {Object.entries(tokens.space).map(([name, value]) => (
              <div key={name} className="flex items-center gap-4">
                <span className="t-caption w-8 shrink-0 font-mono text-ink-3">{name}</span>
                <span className="h-2.5 rounded-full bg-accent" style={{ width: value }} />
                <span className="t-caption font-mono text-ink-4">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Motion">
        <MotionDemo />
      </Section>

      <Section title="Components">
        <ComponentSamples />
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ color */

function ThemePanel({ label, palette }: { label: string; palette: Palette }) {
  return (
    <div
      className="rounded-lg p-5 ring-1 ring-line md:p-7"
      style={{ background: palette.bg, color: palette.ink }}
    >
      <p className="t-headline">{label}</p>
      <div className="mt-5 space-y-6">
        {COLOR_GROUPS.map((g) => (
          <div key={g.label}>
            <p className="t-caption font-semibold" style={{ color: palette['ink-3'] }}>
              {g.label}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {g.keys
                .filter((k) => palette[k])
                .map((k) => (
                  <div key={k} className="min-w-0">
                    <div
                      className="h-12 rounded-md"
                      style={
                        {
                          background: palette[k],
                          boxShadow: `inset 0 0 0 1px ${palette['line-strong']}`,
                        } as CSSProperties
                      }
                    />
                    <p className="t-caption mt-1.5 truncate font-medium">{k}</p>
                    <p
                      className="truncate font-mono text-[11px]"
                      style={{ color: palette['ink-3'] }}
                      title={palette[k]}
                    >
                      {palette[k]}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- motion */

function bezier(curve: string) {
  const n = curve.match(/-?\d*\.?\d+/g)?.map(Number) ?? [0.25, 0.1, 0.25, 1];
  const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = n;
  return `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`;
}

function MotionDemo() {
  const [on, setOn] = useState(false);
  const m = tokens.motion;
  const rows = [
    { name: 'fast', duration: m.fast, ease: m['ease-out'], use: 'Presses, toggles, hovers' },
    { name: 'base', duration: m.base, ease: m['ease-out'], use: 'Panels, tabs, sheets' },
    { name: 'reveal', duration: m.reveal, ease: m['ease-out'], use: 'Content arriving on screen' },
    {
      name: 'base, in-out',
      duration: m.base,
      ease: m['ease-in-out'],
      use: 'Things that move across the screen',
    },
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card className="p-6 md:p-8 lg:col-span-3">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow>Durations</Eyebrow>
          <Button size="sm" variant="secondary" onClick={() => setOn(!on)}>
            {on ? <RotateCcw size={15} /> : <Play size={15} />} {on ? 'Reset' : 'Play'}
          </Button>
        </div>
        <div className="mt-6 space-y-5">
          {rows.map((r) => (
            <div key={r.name}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="t-callout font-medium text-ink">{r.name}</p>
                <p className="t-caption font-mono text-ink-4">{r.duration}</p>
              </div>
              <div className="relative mt-2 h-8 rounded-pill bg-surface-2 ring-1 ring-line ring-inset">
                <span
                  className="absolute top-1 left-1 h-6 w-6 rounded-full bg-voice shadow-card"
                  style={{
                    left: on ? 'calc(100% - 1.75rem)' : '0.25rem',
                    transition: `left ${r.duration} ${r.ease}`,
                  }}
                />
              </div>
              <p className="t-caption mt-1 text-ink-4">{r.use}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 md:p-8 lg:col-span-2">
        <Eyebrow>Curves</Eyebrow>
        <div className="mt-6 grid grid-cols-2 gap-5">
          {(['ease-out', 'ease-in-out'] as const).map((k) => (
            <div key={k}>
              <svg
                viewBox="-6 -6 112 112"
                className="aspect-square w-full rounded-md bg-surface-2"
                aria-hidden
              >
                <path
                  d="M0,100 L100,0"
                  stroke="var(--sc-color-line-strong)"
                  strokeDasharray="3 4"
                  fill="none"
                />
                <path
                  d={bezier(m[k])}
                  stroke="var(--sc-color-accent)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="t-callout mt-3 font-medium text-ink">{k}</p>
              <p className="t-caption break-words font-mono text-ink-4">{m[k]}</p>
            </div>
          ))}
        </div>
        <p className="t-caption mt-5 text-ink-4">
          Reduced motion is respected everywhere. Animations collapse to an instant.
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------- components */

function Sample({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('p-6 md:p-8', className)}>
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function ComponentSamples() {
  const [seg, setSeg] = useState<'week' | 'month' | 'all'>('week');
  const [segSm, setSegSm] = useState<'en' | 'es'>('en');
  const [captions, setCaptions] = useState(true);
  const [barge, setBarge] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Sample label="Buttons" className="lg:col-span-2">
        <div className="space-y-5">
          {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-3">
              <span className="t-caption w-20 shrink-0 font-mono text-ink-4">{v}</span>
              <Button variant={v} size="sm">
                Small
              </Button>
              <Button variant={v}>Medium</Button>
              <Button variant={v} size="lg">
                Large
              </Button>
              <Button variant={v} disabled>
                Disabled
              </Button>
            </div>
          ))}
        </div>
      </Sample>

      <Sample label="Chips">
        <div className="flex flex-wrap gap-2">
          <Chip>Default</Chip>
          <Chip tone="accent">Accent</Chip>
          <Chip tone="positive">Positive</Chip>
          <Chip tone="caution">Caution</Chip>
          <Chip tone="negative">Negative</Chip>
          <Chip tone="voice">Voice</Chip>
        </div>
      </Sample>

      <Sample label="Segmented">
        <div className="flex flex-col items-start gap-4">
          <Segmented
            options={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'all', label: 'All time' },
            ]}
            value={seg}
            onChange={setSeg}
          />
          <Segmented
            size="sm"
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
            ]}
            value={segSm}
            onChange={setSegSm}
          />
        </div>
      </Sample>

      <Sample label="Toggle">
        <div className="divide-y divide-line">
          <Toggle
            checked={captions}
            onChange={setCaptions}
            label="Captions"
            hint="Show what the customer says."
          />
          <Toggle
            checked={barge}
            onChange={setBarge}
            label="Talk over the customer"
            hint="Headphones recommended."
          />
        </div>
      </Sample>

      <Sample label="Bar">
        <div className="space-y-4">
          {[
            { v: 92, tone: 'auto' as const, label: 'auto, 92' },
            { v: 71, tone: 'auto' as const, label: 'auto, 71' },
            { v: 48, tone: 'auto' as const, label: 'auto, 48' },
            { v: 35, tone: 'negative' as const, label: 'negative, 35' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-4">
              <span className="t-caption w-24 shrink-0 font-mono text-ink-4">{b.label}</span>
              <Bar value={b.v} tone={b.tone} />
            </div>
          ))}
        </div>
      </Sample>

      <Sample label="Ring" className="lg:col-span-2">
        <div className="flex flex-wrap items-center justify-around gap-6">
          <Ring value={86} size={128} stroke={10} sublabel="Strong" />
          <Ring value={68} size={128} stroke={10} sublabel="Solid" />
          <Ring value={44} size={128} stroke={10} sublabel="Developing" />
          <Ring value={74} size={128} stroke={10} tone="voice" sublabel="Voice" />
        </div>
      </Sample>

      <Sample label="Difficulty">
        <ul className="space-y-3">
          {[1, 2, 3, 4, 5].map((l) => (
            <li key={l} className="flex items-center gap-4">
              <Difficulty level={l} />
              <span className="t-callout text-ink-2">{DIFFICULTY_LABEL[l]}</span>
            </li>
          ))}
        </ul>
      </Sample>

      <Sample label="Avatar">
        <div className="flex flex-wrap items-end gap-4">
          <Avatar name="Margaret Ellis" seed="margaret-retiree" size={64} />
          <Avatar name="Devin Brooks" seed="devin-researcher" size={56} />
          <Avatar name="Rosa Delgado" seed="rosa-spanish" size={48} />
          <Avatar name="Rick Hammond" seed="rick-landlord" size={44} />
          <Avatar name="Tasha Greene" seed="tasha-burned" size={40} />
          <Avatar name="Paul Lindqvist" seed="paul-engineer" size={32} />
        </div>
        <p className="t-caption mt-4 text-ink-4">
          Customers are characters, not photos. Same seed, same color, every time.
        </p>
      </Sample>

      <Sample label="Card and stat" className="lg:col-span-2">
        <Card className="grid grid-cols-2 gap-6 p-6 ring-1 ring-line md:grid-cols-4 md:p-8">
          <Stat label="Calls this week" value={12} />
          <Stat label="Average score" value={78} hint="Last 10 calls" />
          <Stat label="Streak" value="5 days" />
          <Stat label="Strongest skill" value={<span className="t-headline">Discovery</span>} />
        </Card>
        <div className="mt-5 flex flex-wrap items-center gap-6">
          <ChevronLink href="/">A chevron link</ChevronLink>
          <span className="t-caption text-ink-4">
            Cards: surface, lg radius, card shadow. Glass for bars that float.
          </span>
        </div>
      </Sample>
    </div>
  );
}
