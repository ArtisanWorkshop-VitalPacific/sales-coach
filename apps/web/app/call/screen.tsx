'use client';

import { buildSessionSpec, type SessionRecord, type SpecRequest } from '@sales-coach/engine';
import {
  ArrowLeft,
  Captions,
  CaptionsOff,
  Keyboard,
  Mic,
  MicOff,
  PhoneOff,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Orb, type OrbName, orbFor } from '@/components/orb';
import { cn } from '@/components/ui';
import { CallController, type CallState } from '@/lib/call';
import { contentIndex, DIFFICULTY_LABEL, jobLabel, scenarios } from '@/lib/content';
import { DEMO_JOB } from '@/lib/demo-job';
import { storeFinishedCall } from '@/lib/sessions';
import { useProfile, useSettings } from '@/lib/store';
import { useCapabilities } from '@/lib/use-capabilities';

interface Props {
  scenarioId?: string;
  drillId?: string;
  difficulty?: number;
  companyId?: string;
  job?: string;
  retryMove?: string;
  tv?: boolean;
  exam?: boolean;
}

function useRequest(
  p: Props,
  profileCompany: string,
): { request: SpecRequest | null; error?: string } {
  return useMemo(() => {
    const index = contentIndex();
    const companyId = p.companyId ?? profileCompany;
    const company = index.company(companyId) ? companyId : undefined;
    if (p.job === 'demo') {
      const base =
        scenarios()
          .filter((s) => s.jobType === DEMO_JOB.jobType)
          .sort((a, b) => a.difficulty - b.difficulty)[0] ?? scenarios()[0];
      if (!base) return { request: null, error: 'No scenarios are loaded.' };
      return {
        request: {
          scenarioId: base.id,
          job: DEMO_JOB,
          kind: 'rehearsal',
          companyId: company,
          difficulty: p.difficulty,
        },
      };
    }
    if (p.drillId && index.drills.has(p.drillId)) {
      return { request: { drillId: p.drillId, companyId: company, difficulty: p.difficulty } };
    }
    if (p.scenarioId && index.scenarios.has(p.scenarioId)) {
      return {
        request: {
          scenarioId: p.scenarioId,
          companyId: company,
          difficulty: p.difficulty,
          ...(p.exam ? { kind: 'exam' as const } : {}),
          ...(p.retryMove ? { forcedMoves: [p.retryMove] } : {}),
        },
      };
    }
    return { request: null, error: 'That practice call was not found.' };
  }, [
    p.companyId,
    p.drillId,
    p.job,
    p.retryMove,
    p.scenarioId,
    p.difficulty,
    p.exam,
    profileCompany,
  ]);
}

export function CallScreen(props: Props) {
  const router = useRouter();
  const [profile] = useProfile();
  const [settings, setSettings] = useSettings();
  const { caps, loaded } = useCapabilities();
  const { request, error } = useRequest(props, profile.companyId);
  const spec = useMemo(
    () => (request ? buildSessionSpec(contentIndex(), { ...request, seed: 1 }) : null),
    [request],
  );
  const [controller, setController] = useState<CallController | null>(null);
  const [saving, setSaving] = useState(false);

  // One controller per call, created once capabilities are known.
  useEffect(() => {
    if (!request || !spec || !loaded) return;
    const c = new CallController({
      request,
      spec,
      caps,
      onEnded: async (record: SessionRecord) => {
        setSaving(true);
        let techName: string | undefined;
        if (props.tv) {
          try {
            techName = window.sessionStorage.getItem('sc.trainingTech') ?? undefined;
          } catch {
            /* ignore */
          }
        }
        const stored = await storeFinishedCall(record, { techName });
        router.replace(`/debrief/${stored.id}${props.tv ? '?tv=1' : ''}`);
      },
    });
    setController(c);
    return () => c.dispose();
  }, [request, spec, loaded, caps]);

  if (error || !spec) {
    return (
      <div className="grid min-h-dvh place-items-center p-8 text-center text-ink">
        <div>
          <p className="t-title">{error ?? 'Loading'}</p>
          <Link href="/practice" className="btn btn-primary mt-6">
            Pick a customer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden text-ink">
      {controller ? (
        <LiveCall
          controller={controller}
          spec={spec}
          tv={!!props.tv}
          saving={saving}
          settings={settings}
          setSettings={setSettings}
          liveHref={
            caps?.live && !props.job
              ? `/live?${spec.drill ? `drill=${spec.drill.id}` : `scenario=${spec.scenario.id}`}&d=${spec.difficulty}${spec.company ? `&c=${spec.company.id}` : ''}`
              : null
          }
        />
      ) : (
        <div className="grid min-h-dvh place-items-center">
          <div className="h-2 w-24 animate-pulse rounded-full bg-surface-3" />
        </div>
      )}
    </div>
  );
}

function useCall(c: CallController): CallState {
  return useSyncExternalStore(c.subscribe, c.getState, c.getState);
}

function Timer({ since }: { since: number | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);
  const s = since ? Math.max(0, Math.floor((now - since) / 1000)) : 0;
  return (
    <span className="tabular-nums">
      {Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}
    </span>
  );
}

function statusLine(st: CallState, first: string, typing: boolean) {
  switch (st.status) {
    case 'ready':
      return 'Ready when you are';
    case 'connecting':
      return `Calling on ${first}`;
    case 'customer':
      return st.customerSpeaking ? `${first} is talking` : `${first}`;
    case 'thinking':
      return '';
    case 'hold':
      return st.holdKind === 'away' ? `${first} stepped away` : `${first} is quiet`;
    case 'listening':
      return st.techSpeaking
        ? 'Listening'
        : st.micOn || !st.micAvailable || typing
          ? 'Your turn'
          : 'Your turn. Tap the mic.';
    case 'ended':
      return 'Call ended';
    case 'error':
      return 'Something went wrong';
  }
}

/** Round glass control used for the secondary call buttons. */
const ROUND = 'grid place-items-center rounded-full btn-glass text-ink-2 hover:text-ink';

function LiveCall({
  controller,
  spec,
  tv,
  saving,
  settings,
  setSettings,
  liveHref,
}: {
  liveHref: string | null;
  controller: CallController;
  spec: NonNullable<ReturnType<typeof buildSessionSpec>>;
  tv: boolean;
  saving: boolean;
  settings: ReturnType<typeof useSettings>[0];
  setSettings: ReturnType<typeof useSettings>[1];
}) {
  const st = useCall(controller);
  const p = spec.persona;
  const first = p.name.split(' ')[0]!;
  const [typing, setTyping] = useState(!st.micAvailable);
  const [draft, setDraft] = useState('');
  const captionsRef = useRef<HTMLDivElement>(null);
  const live = st.status !== 'ready';
  const lastCaptions = st.captions.slice(tv ? -4 : -3);

  useEffect(() => {
    captionsRef.current?.scrollTo({ top: captionsRef.current.scrollHeight, behavior: 'smooth' });
  }, [st.captions.length, st.interim]);

  useEffect(() => {
    if (!st.micAvailable) setTyping(true);
  }, [st.micAvailable]);

  const speaking = st.status === 'customer' && st.customerSpeaking;
  const listening = st.status === 'listening' || st.status === 'hold';
  const showCaptions = live && settings.captions && (lastCaptions.length > 0 || !!st.interim);

  return (
    <div className="mx-auto flex min-h-dvh max-w-[920px] flex-col px-5 pt-[max(16px,env(safe-area-inset-top))]">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between gap-3">
        {live ? (
          <button
            type="button"
            onClick={() => controller.hangUp()}
            className="btn btn-sm btn-danger"
            disabled={st.status === 'ended'}
          >
            <PhoneOff size={16} /> End
          </button>
        ) : (
          <Link
            href={spec.drill ? `/drills/${spec.drill.id}` : `/practice/${spec.scenario.id}`}
            className="btn btn-sm btn-glass"
          >
            <ArrowLeft size={16} /> Back
          </Link>
        )}
        <div className="flex items-center gap-2 text-[13px] text-ink-3">
          {live && <Timer since={st.startedAt} />}
          <span className="flex items-center gap-1.5 rounded-pill bg-glass-strong px-2.5 py-1 text-ink-2 shadow-ring">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                st.mode === 'brain' ? 'bg-ink' : 'bg-ink-4',
              )}
            />
            {st.mode === 'brain' ? 'Claude' : 'Demo'}
            {st.voice === 'eleven' ? ' · Voice' : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSettings({ captions: !settings.captions })}
          className="grid h-10 w-10 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
          aria-label={settings.captions ? 'Hide captions' : 'Show captions'}
        >
          {settings.captions ? <Captions size={20} /> : <CaptionsOff size={20} />}
        </button>
      </div>

      {/* Customer */}
      <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
        <CustomerOrb
          name={orbFor(p.id)}
          size={tv ? 220 : 168}
          speaking={speaking}
          listening={listening && st.micOn}
          techSpeaking={st.techSpeaking}
          thinking={st.status === 'thinking' || st.status === 'connecting'}
          away={st.status === 'hold' && st.holdKind === 'away'}
        />
        <h1
          className={cn(
            'mt-10 font-light tracking-[-0.022em] text-ink',
            tv ? 'text-[56px] leading-none' : 'text-[34px] leading-tight',
          )}
        >
          {p.name}
        </h1>
        <p className={cn('mt-2 min-h-[1.4em] text-ink-3', tv ? 'text-[22px]' : 'text-[15px]')}>
          {st.status === 'thinking' ? <Dots /> : statusLine(st, first, typing)}
        </p>
        {!live && (
          <div className="reveal mt-8 max-w-md">
            <p className="text-[15px] text-ink-3">
              {spec.drill ? spec.drill.title : spec.scenario.title} ·{' '}
              {jobLabel(spec.scenario.jobType)} · {DIFFICULTY_LABEL[spec.difficulty]}
            </p>
            {spec.drill && <p className="mt-3 text-[17px] text-ink-2">{spec.drill.techPrompt}</p>}
            {spec.job && <p className="mt-3 text-[17px] text-ink-2">{spec.job.summary}</p>}
          </div>
        )}
      </div>

      {/* Captions, on a pane of glass */}
      {showCaptions && (
        <div
          ref={captionsRef}
          className={cn(
            'card no-scrollbar mb-4 max-h-[30vh] overflow-y-auto px-5 py-4',
            tv && 'max-h-[36vh] px-8 py-6',
          )}
          aria-live="polite"
        >
          <div className="space-y-3">
            {lastCaptions.map((c) => (
              <div key={c.id} className="fade">
                {c.who === 'cue' ? (
                  <p className="text-center text-[13px] text-ink-3 italic">{c.text}</p>
                ) : (
                  <p
                    className={cn(
                      tv ? 'text-[30px] leading-snug' : 'text-[19px] leading-normal',
                      c.who === 'tech' ? 'text-ink-3' : 'text-ink',
                    )}
                  >
                    <span
                      className={cn(
                        'mr-2 font-semibold',
                        c.who === 'tech' ? 'text-ink-3' : 'text-ink',
                      )}
                    >
                      {c.name}
                    </span>
                    {c.text}
                  </p>
                )}
              </div>
            ))}
            {st.interim && (
              <p className={cn('text-ink-4', tv ? 'text-[30px]' : 'text-[19px]')}>
                <span className="mr-2 font-semibold text-ink-3">You</span>
                {st.interim}
              </p>
            )}
          </div>
        </div>
      )}

      {st.notice && !(typing && st.notice.startsWith('Tap the mic')) && (
        <p className="mx-auto mb-3 flex w-fit max-w-full items-center gap-2 rounded-pill bg-glass-strong px-3.5 py-1.5 text-[13px] text-ink-2 shadow-ring">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-caution-fill" />
          {st.notice}
        </p>
      )}
      {st.error && (
        <div className="mb-3 text-center text-[14px] text-negative">
          {st.error}{' '}
          <button type="button" className="underline" onClick={() => controller.hangUp()}>
            End and score what we have
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="safe-bottom pb-4">
        {!live ? (
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => controller.begin()}
              className="btn btn-primary btn-lg w-full max-w-sm"
            >
              Start the call
            </button>
            <div className="flex items-center gap-2 text-[13px] text-ink-3">
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    inputMode: settings.inputMode === 'hands-free' ? 'push' : 'hands-free',
                  })
                }
                className="chip"
              >
                {settings.inputMode === 'hands-free' ? 'Hands-free' : 'Tap to talk'}
              </button>
              <span>·</span>
              <span>{st.micAvailable ? 'Mic ready' : 'Typing mode'}</span>
            </div>
            {liveHref && (
              <Link href={liveHref} className="link text-[13px]">
                Try Live mode (instant voice)
              </Link>
            )}
            {!st.micAvailable && (
              <p className="max-w-sm text-center text-[13px] text-ink-3">
                This browser cannot listen. Use Chrome or Safari for voice, or type your replies.
              </p>
            )}
          </div>
        ) : typing ? (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              controller.sendText(draft);
              setDraft('');
            }}
          >
            {st.micAvailable && (
              <button
                type="button"
                onClick={() => setTyping(false)}
                className={cn(ROUND, 'h-12 w-12 shrink-0')}
                aria-label="Use voice"
              >
                <Mic size={20} />
              </button>
            )}
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                st.status === 'thinking' ? `${first} is responding...` : `Say something to ${first}`
              }
              className="h-12 min-w-0 flex-1 rounded-pill bg-surface px-5 text-[17px] text-ink shadow-ring outline-none focus:shadow-[inset_0_0_0_1.5px_var(--sc-color-ink)]"
              disabled={st.status === 'ended'}
            />
            <button
              type="submit"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-accent-ink disabled:opacity-30"
              disabled={!draft.trim() || st.status === 'thinking'}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => setTyping(true)}
              className={cn(ROUND, 'h-14 w-14')}
              aria-label="Type instead"
            >
              <Keyboard size={22} />
            </button>
            <MicButton
              st={st}
              onPress={() =>
                st.status === 'customer' && settings.bargeIn
                  ? controller.cutIn()
                  : controller.toggleMic()
              }
            />
            <button
              type="button"
              onClick={() => controller.commitNow()}
              className={cn(
                'btn btn-glass h-14 px-5 transition-opacity',
                st.techSpeaking ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              Done
            </button>
          </div>
        )}
      </div>

      {saving && (
        <div className="fade fixed inset-0 z-50 grid place-items-center bg-glass-strong backdrop-blur-2xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-[spin-slow_1.2s_linear_infinite] rounded-full border-2 border-surface-3 border-t-ink" />
            <p className="mt-5 text-[19px] text-ink">Scoring your call</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MicButton({ st, onPress }: { st: CallState; onPress: () => void }) {
  const on = st.micOn;
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={st.status === 'thinking' || st.status === 'connecting' || st.status === 'ended'}
      className={cn(
        'relative grid h-[76px] w-[76px] place-items-center rounded-full transition-all duration-300',
        on ? 'bg-accent text-accent-ink shadow-float' : 'btn-glass text-ink-2',
        'disabled:opacity-40',
      )}
      aria-label={on ? 'Finish talking' : 'Start talking'}
    >
      {on && st.techSpeaking && (
        <span className="absolute inset-0 animate-[ripple_1.4s_ease-out_infinite] rounded-full border border-ink/40" />
      )}
      {on ? <Mic size={28} /> : <MicOff size={28} />}
    </button>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-ink-3"
          style={{ animation: `dots 1.2s ${i * 0.16}s infinite` }}
        />
      ))}
    </span>
  );
}

/** The customer, as their color orb. It breathes while waiting, swells as they talk, and dims when they step away. */
function CustomerOrb({
  name,
  size,
  speaking,
  listening,
  techSpeaking,
  thinking,
  away,
}: {
  name: OrbName;
  size: number;
  speaking: boolean;
  listening: boolean;
  techSpeaking: boolean;
  thinking: boolean;
  away: boolean;
}) {
  const ring = size + 28;
  return (
    <div className="relative grid place-items-center" style={{ width: ring, height: ring }}>
      {speaking && (
        <>
          <span
            className="absolute animate-[ripple_1.8s_ease-out_infinite] rounded-full border border-ink/15"
            style={{ width: size, height: size }}
          />
          <span
            className="absolute animate-[ripple_1.8s_0.6s_ease-out_infinite] rounded-full border border-ink/10"
            style={{ width: size, height: size }}
          />
        </>
      )}
      {listening && (
        <span
          className={cn(
            'absolute rounded-full border-[1.5px] transition-colors duration-300',
            techSpeaking ? 'border-ink' : 'border-ink/15',
          )}
          style={{
            width: ring,
            height: ring,
            animation: techSpeaking ? 'breathe 0.9s ease-in-out infinite' : undefined,
          }}
        />
      )}
      <span
        className={cn(
          'block rounded-full transition-[opacity,transform,filter] duration-700',
          away && 'scale-[0.94] opacity-40 grayscale',
          thinking && 'opacity-85',
        )}
        style={{
          animation: speaking
            ? 'speak 1.1s ease-in-out infinite'
            : away
              ? undefined
              : 'breathe 4s ease-in-out infinite',
        }}
      >
        <Orb name={name} size={size} live />
      </span>
    </div>
  );
}
