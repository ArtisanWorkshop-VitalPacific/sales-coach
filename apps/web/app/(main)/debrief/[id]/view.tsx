'use client';

import type { Debrief } from '@sales-coach/engine';
import { Check, ChevronDown, Pause, Play, RotateCcw, Sparkles, Target, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '@/components/avatar';
import { Bar, Button, ButtonLink, Card, Chip, cn, Empty, Ring, Section, Skeleton } from '@/components/ui';
import { contentIndex } from '@/lib/content';
import { decisionLine, formatDuration, relativeDay, requestCoachDebrief } from '@/lib/sessions';
import { Speaker } from '@/lib/speech/speaker';
import { deleteSession, getSession, type StoredSession } from '@/lib/store';
import { useCapabilities } from '@/lib/use-capabilities';
import { COACH_BROWSER, COACH_VOICE } from '@/lib/voices';

export function DebriefView({ id, tv }: { id: string; tv: boolean }) {
  const router = useRouter();
  const { caps, loaded } = useCapabilities();
  const [s, setS] = useState<StoredSession | null | undefined>(undefined);
  const [coaching, setCoaching] = useState(false);
  const [coachFailed, setCoachFailed] = useState(false);
  const asked = useRef(false);

  useEffect(() => {
    getSession(id)
      .then((x) => setS(x ?? null))
      .catch(() => setS(null));
  }, [id]);

  // Upgrade the instant rubric score to the Claude Coach's review.
  useEffect(() => {
    if (!s || !loaded || !caps?.brain || s.debrief.scoredBy === 'claude' || asked.current) return;
    asked.current = true;
    setCoaching(true);
    requestCoachDebrief(s.id)
      .then((d) => {
        if (d) setS((prev) => (prev ? { ...prev, debrief: d } : prev));
        else setCoachFailed(true);
      })
      .catch(() => setCoachFailed(true))
      .finally(() => setCoaching(false));
  }, [s, loaded, caps]);

  if (s === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (s === null) {
    return <Empty title="That call is not on this device." body="Calls are saved on the device you practiced on." action={<ButtonLink href="/">Go home</ButtonLink>} />;
  }
  return <Loaded s={s} tv={tv} coaching={coaching} coachFailed={coachFailed} voice={!!caps?.voice} onDelete={async () => {
    await deleteSession(s.id);
    router.replace('/progress');
  }} />;
}

function Loaded({ s, tv, coaching, coachFailed, voice, onDelete }: { s: StoredSession; tv: boolean; coaching: boolean; coachFailed: boolean; voice: boolean; onDelete: () => void }) {
  const d = s.debrief;
  const index = contentIndex();
  const turnText = useMemo(() => new Map(s.record.transcript.map((t) => [t.id, t])), [s.record.transcript]);
  const companyQ = s.record.companyId ? `&c=${encodeURIComponent(s.record.companyId)}` : '';
  const retryHref = d.fix.tryAgain?.drillId
    ? `/call?drill=${d.fix.tryAgain.drillId}${companyQ}`
    : `/call?scenario=${s.scenarioId}&d=${s.difficulty}${companyQ}${d.fix.tryAgain?.moveId ? `&retry=${d.fix.tryAgain.moveId}` : ''}`;
  const againHref = s.drillId ? `/call?drill=${s.drillId}${companyQ}` : `/call?scenario=${s.scenarioId}&d=${s.difficulty}${companyQ}`;
  const winTurn = d.win.turnId ? turnText.get(d.win.turnId) : undefined;
  const fixTurn = d.fix.turnId ? turnText.get(d.fix.turnId) : undefined;

  return (
    <div className="mx-auto max-w-[980px]">
      {tv && (
        <Link href="/training-day" className="btn btn-secondary btn-sm mb-6">
          Back to training day
        </Link>
      )}
      <header className="reveal mb-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 text-ink-3">
          <Avatar name={s.personaName} seed={s.personaId} size={32} />
          <span className="t-callout">
            {s.scenarioTitle} · {relativeDay(s.createdAt)} · {formatDuration(s.durationMs)}
          </span>
        </div>
        <div className="mt-8">
          <Ring value={d.overall} size={tv ? 220 : 180} stroke={tv ? 16 : 14} sublabel={`Pass at ${d.passBar}`} />
        </div>
        <h1 className="t-display mt-6 text-ink">{d.passed ? (d.overall >= d.passBar + 15 ? 'Strong call.' : 'You passed.') : 'Not yet. Close.'}</h1>
        <p className="t-body-lg mt-2 text-ink-3">{decisionLine(s.personaName, s.record.decision)}</p>
        <div className="mt-5 flex items-center gap-2">
          {coaching ? (
            <Chip tone="voice">
              <Sparkles size={13} /> Coach is reviewing your call
            </Chip>
          ) : d.scoredBy === 'claude' ? (
            <Chip tone="voice">
              <Sparkles size={13} /> Reviewed by your coach
            </Chip>
          ) : (
            <Chip>{coachFailed ? 'Quick score. The coach review is unavailable right now.' : 'Quick score'}</Chip>
          )}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PlayDebrief text={d.spoken} voice={voice} />
          <ButtonLink href={retryHref} variant="secondary">
            <RotateCcw size={17} /> Try that moment again
          </ButtonLink>
        </div>
      </header>

      <div className={cn('mb-12 grid gap-5 md:grid-cols-2', coaching && 'animate-pulse')}>
        <Card className="reveal p-6 md:p-8">
          <p className="t-callout flex items-center gap-2 font-semibold text-positive">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-positive-soft">
              <Check size={14} />
            </span>
            What worked
          </p>
          <p className="t-body-lg mt-4 text-ink">{d.win.text}</p>
          {winTurn && <Quote text={winTurn.text} />}
        </Card>
        <Card className="reveal p-6 md:p-8 [animation-delay:100ms]">
          <p className="t-callout flex items-center gap-2 font-semibold text-caution">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-caution-soft">
              <Target size={14} />
            </span>
            One thing to fix
          </p>
          <p className="t-body-lg mt-4 text-ink">{d.fix.text}</p>
          {fixTurn && <Quote text={fixTurn.text} label="You said" />}
          {d.fix.modelResponse && (
            <div className="mt-5 rounded-md bg-accent-soft p-4">
              <p className="t-caption font-semibold text-accent">Try it like this</p>
              <p className="t-body mt-1 text-ink">{d.fix.modelResponse}</p>
            </div>
          )}
          <ButtonLink href={retryHref} className="mt-6" size="sm">
            Run it again
          </ButtonLink>
        </Card>
      </div>

      <Section title="Your skills">
        <Card className="divide-y divide-line">
          {d.skills.map((k) => (
            <SkillRow key={k.skillId} k={k} turnText={turnText} />
          ))}
        </Card>
      </Section>

      {d.moves.length > 0 && (
        <Section title="Customer moments">
          <div className="grid gap-3 md:grid-cols-2">
            {d.moves.map((m, i) => {
              const move = index.move(m.moveId);
              return (
                <Card key={`${m.moveId}-${i}`} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="t-body font-medium text-ink">{m.name}</p>
                    <Chip tone={m.result === 'pass' ? 'positive' : m.result === 'fail' ? 'negative' : undefined}>
                      {m.result === 'pass' ? 'Handled' : m.result === 'fail' ? 'Missed' : m.result === 'pending' ? 'Unfinished' : 'Unclear'}
                    </Chip>
                  </div>
                  <p className="t-callout mt-2 text-ink-3">
                    {m.reason ?? (m.result === 'pass' ? move?.evaluate.pass : m.result === 'fail' ? move?.evaluate.fail : move?.summary)}
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="The call">
        <Transcript s={s} highlight={{ win: d.win.turnId, fix: d.fix.turnId }} />
      </Section>

      <details className="mb-12">
        <summary className="t-callout cursor-pointer text-ink-3">Read the spoken debrief</summary>
        <p className="t-body mt-3 max-w-2xl text-ink-2">{d.spoken}</p>
        {d.managerNote && <p className="t-caption mt-3 text-ink-4">Note for your manager: {d.managerNote}</p>}
      </details>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t hairline pt-6">
        <div className="flex gap-3">
          <ButtonLink href={againHref} variant="secondary" size="sm">
            Same customer again
          </ButtonLink>
          <ButtonLink href="/practice" variant="ghost" size="sm">
            New customer
          </ButtonLink>
        </div>
        <Button variant="ghost" size="sm" className="text-negative" onClick={onDelete}>
          <Trash2 size={15} /> Delete this call
        </Button>
      </div>
      <p className="t-caption mt-6 text-ink-4">
        {s.record.adapters.writer.startsWith('claude') ? `Customer: ${s.record.adapters.writer.replace('claude:', '')}.` : 'Customer: demo engine.'}{' '}
        {d.model ? `Coach: ${d.model}.` : ''} Content {s.record.contentVersion}.
      </p>
    </div>
  );
}

function Quote({ text, label = 'You said' }: { text: string; label?: string }) {
  return (
    <blockquote className="mt-4 border-l-2 border-line-strong pl-4">
      <p className="t-caption text-ink-4">{label}</p>
      <p className="t-callout text-ink-2">&ldquo;{text}&rdquo;</p>
    </blockquote>
  );
}

function SkillRow({ k, turnText }: { k: Debrief['skills'][number]; turnText: Map<string, { text: string }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-5 py-4 md:px-6">
      <button type="button" className="flex w-full items-center gap-4 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="w-40 shrink-0 md:w-56">
          <p className="t-body font-medium text-ink">{k.name}</p>
        </div>
        <div className="flex-1">
          <Bar value={k.score} tone="auto" />
        </div>
        <span className="t-body w-10 text-right font-semibold tabular-nums text-ink">{k.score ?? '–'}</span>
        <ChevronDown size={16} className={cn('text-ink-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="fade mt-3 pl-0 md:pl-60">
          <p className="t-callout text-ink-2">{k.summary}</p>
          {k.evidence.length > 0 && (
            <ul className="mt-3 space-y-2">
              {k.evidence.slice(0, 4).map((e, i) => (
                <li key={i} className="t-callout flex gap-2">
                  <span className={cn('mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full', e.polarity === 'positive' ? 'bg-positive-fill' : 'bg-caution-fill')} />
                  <span className="text-ink-3">
                    <span className="text-ink-2">{e.note}.</span> &ldquo;{e.quote || turnText.get(e.turnId)?.text}&rdquo;
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Transcript({ s, highlight }: { s: StoredSession; highlight: { win?: string; fix?: string } }) {
  const [all, setAll] = useState(false);
  const turns = s.record.transcript;
  const shown = all ? turns : turns.slice(0, 14);
  const first = s.personaName.split(' ')[0];
  return (
    <Card className="p-5 md:p-7">
      <ol className="space-y-4">
        {shown.map((t) => {
          const tech = t.speaker === 'tech';
          const mark = t.id === highlight.win ? 'win' : t.id === highlight.fix ? 'fix' : null;
          if (t.act === 'silence' && !t.text) {
            return (
              <li key={t.id} className="t-caption text-center text-ink-4">
                {first} stays quiet for {Math.round((t.silenceMs ?? 0) / 1000)} seconds
              </li>
            );
          }
          return (
            <li key={t.id} className={cn('flex', tech ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-lg px-4 py-2.5',
                  tech ? 'bg-accent text-accent-ink' : 'bg-surface-3 text-ink',
                  mark === 'win' && 'ring-2 ring-positive-fill ring-offset-2 ring-offset-surface',
                  mark === 'fix' && 'ring-2 ring-caution-fill ring-offset-2 ring-offset-surface',
                )}
              >
                {!tech && <p className="t-micro mb-0.5 opacity-60">{t.speaker === 'secondary' ? 'Partner' : first}</p>}
                <p className="t-callout">{t.text.replace(/\[[^\]]{1,24}\]\s*/g, '')}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {turns.length > 14 && (
        <button type="button" className="t-callout mt-5 text-accent hover:underline" onClick={() => setAll(!all)}>
          {all ? 'Show less' : `Show all ${turns.length} turns`}
        </button>
      )}
    </Card>
  );
}

function PlayDebrief({ text, voice }: { text: string; voice: boolean }) {
  const sp = useRef<Speaker | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => sp.current?.stop(), []);
  return (
    <Button
      onClick={async () => {
        if (playing) {
          sp.current?.stop();
          setPlaying(false);
          return;
        }
        sp.current ??= new Speaker(voice);
        sp.current.unlock();
        setPlaying(true);
        await sp.current.speak(text, { eleven: COACH_VOICE, browser: COACH_BROWSER });
        setPlaying(false);
      }}
    >
      {playing ? <Pause size={17} /> : <Play size={17} />} {playing ? 'Pause' : 'Play the debrief'}
    </Button>
  );
}
