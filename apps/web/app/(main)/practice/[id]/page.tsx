import { notFound } from 'next/navigation';
import { Avatar } from '@/components/avatar';
import { Card, Chip, Eyebrow } from '@/components/ui';
import { contentIndex, jobLabel, scenarios } from '@/lib/content';
import { BriefingStart } from './start';

export function generateStaticParams() {
  return scenarios().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = contentIndex().scenarios.get(id);
  return { title: s?.title ?? 'Practice' };
}

export default async function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = contentIndex();
  const s = index.scenarios.get(id);
  if (!s) notFound();
  const p = index.persona(s.personaId);
  const recommended = s.options.find((o) => o.recommended);

  return (
    <div className="mx-auto max-w-[980px]">
      <div className="reveal mb-10 flex flex-col items-start gap-6 md:flex-row md:items-center">
        <Avatar name={p.name} seed={p.id} size={88} />
        <div>
          <Eyebrow>
            {jobLabel(s.jobType)} · {p.name}
          </Eyebrow>
          <h1 className="t-display mt-1 text-ink">{s.title}</h1>
          <p className="t-body-lg mt-3 max-w-2xl text-ink-3">{p.card}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        <div className="flex flex-col gap-5 md:col-span-3">
          <Card className="p-6">
            <h2 className="t-headline text-ink">What you know walking in</h2>
            <p className="t-body mt-2 text-ink-2">{s.briefing}</p>
            {s.equipment.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.equipment.map((e) => (
                  <li key={e.item}>
                    <Chip>
                      {e.item}
                      {e.ageYears !== undefined ? `, ${e.ageYears} yrs` : ''}
                    </Chip>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-6">
            <h2 className="t-headline text-ink">What you found</h2>
            <ul className="mt-3 space-y-2.5">
              {s.findings.map((f) => (
                <li key={f.id} className="flex gap-3">
                  <span
                    className={`mt-[9px] h-2 w-2 shrink-0 rounded-full ${
                      f.severity === 'urgent'
                        ? 'bg-negative-fill'
                        : f.severity === 'major'
                          ? 'bg-caution-fill'
                          : 'bg-ink-4'
                    }`}
                  />
                  <span className="t-body text-ink-2">{f.text}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h2 className="t-headline text-ink">Your price book for this job</h2>
            <div className="mt-3 divide-y divide-line">
              {s.options.map((o) => (
                <div key={o.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="t-body font-medium text-ink">
                      {o.label}{' '}
                      {o.recommended && (
                        <Chip tone="accent" className="ml-1 align-middle">
                          Fits this home
                        </Chip>
                      )}
                    </p>
                    <p className="t-caption mt-0.5 text-ink-3">{o.includes.join(' · ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="t-body font-semibold tabular-nums text-ink">
                      ${o.price.toLocaleString()}
                    </p>
                    {o.monthly && (
                      <p className="t-caption tabular-nums text-ink-3">or ${o.monthly}/mo</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {recommended && (
              <p className="t-caption mt-3 text-ink-4">
                The honest fit is marked. Recommend what the home needs, and only that.
              </p>
            )}
          </Card>
        </div>
        <div className="md:col-span-2">
          <div className="md:sticky md:top-20">
            <Card className="p-6">
              <h2 className="t-headline text-ink">Your goal</h2>
              <p className="t-body mt-2 text-ink-2">{s.goal}</p>
              <BriefingStart scenarioId={s.id} defaultDifficulty={s.difficulty} />
            </Card>
            <p className="t-caption mt-4 px-2 text-ink-4">
              Speak naturally. {p.name.split(' ')[0]} hears you, reacts to how you say things, and
              remembers. Headphones make it feel real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
