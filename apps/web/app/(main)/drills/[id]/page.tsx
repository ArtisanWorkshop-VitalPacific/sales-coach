import { notFound } from 'next/navigation';
import { Avatar } from '@/components/avatar';
import { Card, Eyebrow } from '@/components/ui';
import { contentIndex, drills } from '@/lib/content';
import { DrillActions } from './actions';

export function generateStaticParams() {
  return drills().map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: contentIndex().drills.get(id)?.title ?? 'Drill' };
}

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = contentIndex();
  const d = index.drills.get(id);
  if (!d) notFound();
  const p = index.persona(d.personaId);
  const first = p.name.split(' ')[0];
  return (
    <div className="mx-auto max-w-[820px]">
      <header className="reveal mb-10">
        <Eyebrow>
          Drill {d.order} · {Math.max(1, Math.round(d.durationSec / 60))} min
        </Eyebrow>
        <h1 className="t-display mt-2 text-ink">{d.title}</h1>
        <DrillActions drillId={d.id} why={d.why} />
      </header>

      <Card className="reveal mb-5 p-6 md:p-8">
        <h2 className="t-headline text-ink">Why it matters</h2>
        <div className="t-body-lg mt-3 space-y-4 text-ink-2">
          {paragraphs(d.why).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </Card>

      <Card className="reveal mb-5 p-6 md:p-8">
        <h2 className="t-headline text-ink">How it sounds</h2>
        <ol className="mt-5 space-y-3">
          {d.demo.map((line, i) => (
            <li
              key={i}
              className={line.speaker === 'tech' ? 'flex justify-end' : 'flex justify-start'}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 ${line.speaker === 'tech' ? 'bg-accent text-accent-ink' : 'bg-surface-3 text-ink'}`}
              >
                <p className="t-micro mb-0.5 opacity-60">
                  {line.speaker === 'tech' ? 'Tech' : 'Customer'}
                </p>
                <p className="t-callout">{line.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="t-headline text-ink">To pass</h2>
          <ul className="mt-3 space-y-2">
            {d.passCriteria.map((c) => (
              <li key={c} className="t-callout flex gap-2 text-ink-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="t-headline text-ink">Your customer</h2>
          <div className="mt-3 flex items-center gap-3">
            <Avatar name={p.name} seed={p.id} size={44} />
            <div>
              <p className="t-body font-medium text-ink">{p.name}</p>
              <p className="t-caption text-ink-3">{p.archetype}</p>
            </div>
          </div>
          <p className="t-callout mt-3 text-ink-3">{d.techPrompt}</p>
          <p className="t-caption mt-3 text-ink-4">
            The drill picks up mid-call. {first} already knows why you are there.
          </p>
        </Card>
      </div>
    </div>
  );
}

/** Lessons are written to be heard; on screen they read better in short paragraphs. */
function paragraphs(text: string): string[] {
  if (text.includes('\n\n')) return text.split(/\n\n+/);
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += 3)
    out.push(
      sentences
        .slice(i, i + 3)
        .join('')
        .trim(),
    );
  return out;
}
