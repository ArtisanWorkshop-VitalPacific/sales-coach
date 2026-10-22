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
import { type ReactNode, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Avatar } from '@/components/avatar';
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
      <div className="grid min-h-dvh place-items-center bg-[#000] p-8 text-center text-[#f5f5f7]">
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
    <div data-theme="dark" className="relative min-h-dvh overflow-hidden bg-[#000] text-[#f5f5f7]">
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
          <div className="h-2 w-24 animate-pulse rounded-full bg-[#2c2c2e]" />
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

  return (
    <div className="mx-auto flex min-h-dvh max-w-[920px] flex-col px-5 pt-[max(16px,env(safe-area-inset-top))]">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between">
        {live ? (
          <button
            type="button"
            onClick={() => controller.hangUp()}
            className="btn btn-sm bg-[#ff453a] text-white"
            disabled={st.status === 'ended'}
          >
            <PhoneOff size={16} /> End
          </button>
        ) : (
          <Link
            href={spec.drill ? `/drills/${spec.drill.id}` : `/practice/${spec.scenario.id}`}
            className="btn btn-sm bg-[#1d1d1f] text-[#f5f5f7]"
          >
            <ArrowLeft size={16} /> Back
          </Link>
        )}
        <div className="flex items-center gap-2 text-[13px] text-[#a1a1a6]">
          {live && <Timer since={st.startedAt} />}
          <span className="flex items-center gap-1.5 rounded-pill bg-[#1d1d1f] px-2.5 py-1">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                st.mode === 'brain' ? 'bg-voice' : 'bg-[#86868b]',
              )}
            />
            {st.mode === 'brain' ? 'Claude' : 'Demo'}
            {st.voice === 'eleven' ? ' · Voice' : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSettings({ captions: !settings.captions })}
          className="rounded-full p-2 text-[#a1a1a6] hover:text-white"
          aria-label={settings.captions ? 'Hide captions' : 'Show captions'}
        >
          {settings.captions ? <Captions size={20} /> : <CaptionsOff size={20} />}
        </button>
      </div>

      {/* Customer */}
      <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
        <Orb
          speaking={speaking}
          listening={listening && st.micOn}
          techSpeaking={st.techSpeaking}
          thinking={st.status === 'thinking' || st.status === 'connecting'}
          away={st.status === 'hold' && st.holdKind === 'away'}
        >
          <Avatar name={p.name} seed={p.id} size={tv ? 168 : 128} />
        </Orb>
        <h1
          className={cn(
            'mt-8 font-semibold tracking-[-0.02em]',
            tv ? 'text-[44px]' : 'text-[28px]',
          )}
        >
          {p.name}
        </h1>
        <p className={cn('mt-1 text-[#a1a1a6]', tv ? 'text-[22px]' : 'text-[15px]')}>
          {st.status === 'thinking' ? <Dots /> : statusLine(st, first, typing)}
        </p>
        {!live && (
          <div className="reveal mt-8 max-w-md">
            <p className="text-[15px] text-[#a1a1a6]">
              {spec.drill ? spec.drill.title : spec.scenario.title} ·{' '}
              {jobLabel(spec.scenario.jobType)} · {DIFFICULTY_LABEL[spec.difficulty]}
            </p>
            {spec.drill && (
              <p className="mt-3 text-[17px] text-[#f5f5f7]">{spec.drill.techPrompt}</p>
            )}
            {spec.job && <p className="mt-3 text-[17px] text-[#f5f5f7]">{spec.job.summary}</p>}
          </div>
        )}
      </div>

      {/* Captions */}
      {live && settings.captions && (
        <div
          ref={captionsRef}
          className={cn('no-scrollbar mb-4 max-h-[30vh] overflow-y-auto', tv && 'max-h-[36vh]')}
          aria-live="polite"
        >
          <div className="space-y-3">
            {lastCaptions.map((c) => (
              <div key={c.id} className="fade">
                {c.who === 'cue' ? (
                  <p className="text-center text-[13px] text-[#86868b] italic">{c.text}</p>
                ) : (
                  <p
                    className={cn(
                      tv ? 'text-[30px] leading-snug' : 'text-[19px] leading-normal',
                      c.who === 'tech' ? 'text-[#a1a1a6]' : 'text-[#f5f5f7]',
                    )}
                  >
                    <span
                      className={cn(
                        'mr-2 font-semibold',
                        c.who === 'tech' ? 'text-[#2997ff]' : 'text-voice',
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
              <p className={cn('text-[#86868b]', tv ? 'text-[30px]' : 'text-[19px]')}>
                <span className="mr-2 font-semibold text-[#2997ff]">You</span>
                {st.interim}
              </p>
            )}
          </div>
        </div>
      )}

      {st.notice && !(typing && st.notice.startsWith('Tap the mic')) && (
        <p className="mb-3 text-center text-[13px] text-[#ffb340]">{st.notice}</p>
      )}
      {st.error && (
        <div className="mb-3 text-center text-[14px] text-[#ff6961]">
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
            <div className="flex items-center gap-2 text-[13px] text-[#a1a1a6]">
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    inputMode: settings.inputMode === 'hands-free' ? 'push' : 'hands-free',
                  })
                }
                className="rounded-pill bg-[#1d1d1f] px-3 py-1.5"
              >
                {settings.inputMode === 'hands-free' ? 'Hands-free' : 'Tap to talk'}
              </button>
              <span>·</span>
              <span>{st.micAvailable ? 'Mic ready' : 'Typing mode'}</span>
            </div>
            {liveHref && (
              <Link href={liveHref} className="text-[13px] text-[#c8a0ff] hover:underline">
                Try Live mode (instant voice)
              </Link>
            )}
            {!st.micAvailable && (
              <p className="max-w-sm text-center text-[13px] text-[#86868b]">
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
                className="rounded-full bg-[#1d1d1f] p-3"
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
              className="min-w-0 flex-1 rounded-pill bg-[#1d1d1f] px-5 py-3.5 text-[17px] text-white outline-none placeholder:text-[#6e6e73] focus:ring-2 focus:ring-[#2997ff]"
              disabled={st.status === 'ended'}
            />
            <button
              type="submit"
              className="rounded-full bg-[#2997ff] p-3.5 text-white disabled:opacity-40"
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
              className="rounded-full bg-[#1d1d1f] p-4 text-[#a1a1a6]"
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
                'rounded-pill bg-[#1d1d1f] px-5 py-4 text-[15px] font-medium transition-opacity',
                st.techSpeaking ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              Done
            </button>
          </div>
        )}
      </div>

      {saving && (
        <div className="fade fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-[spin-slow_1.2s_linear_infinite] rounded-full border-2 border-[#2c2c2e] border-t-[#c8a0ff]" />
            <p className="mt-5 text-[19px]">Scoring your call</p>
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
        on ? 'bg-[#f5f5f7] text-black' : 'bg-[#2c2c2e] text-[#f5f5f7]',
        'disabled:opacity-40',
      )}
      aria-label={on ? 'Finish talking' : 'Start talking'}
    >
      {on && st.techSpeaking && (
        <span className="absolute inset-0 animate-[ripple_1.4s_ease-out_infinite] rounded-full bg-[#f5f5f7]" />
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
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#a1a1a6]"
          style={{ animation: `dots 1.2s ${i * 0.16}s infinite` }}
        />
      ))}
    </span>
  );
}

function Orb({
  children,
  speaking,
  listening,
  techSpeaking,
  thinking,
  away,
}: {
  children: ReactNode;
  speaking: boolean;
  listening: boolean;
  techSpeaking: boolean;
  thinking: boolean;
  away: boolean;
}) {
  return (
    <div className="relative grid place-items-center">
      <div
        className={cn(
          'absolute h-[260px] w-[260px] rounded-full bg-voice blur-3xl transition-opacity duration-700',
          speaking ? 'opacity-55' : thinking ? 'opacity-25' : 'opacity-15',
        )}
        style={{
          animation: speaking
            ? 'speak 1.1s ease-in-out infinite'
            : 'breathe 4s ease-in-out infinite',
        }}
      />
      {speaking && (
        <>
          <span className="absolute h-[150px] w-[150px] animate-[ripple_1.6s_ease-out_infinite] rounded-full border border-[#c8a0ff]/60" />
          <span className="absolute h-[150px] w-[150px] animate-[ripple_1.6s_0.5s_ease-out_infinite] rounded-full border border-[#7ab8ff]/50" />
        </>
      )}
      {listening && (
        <span
          className={cn(
            'absolute h-[156px] w-[156px] rounded-full border-2 transition-colors duration-300',
            techSpeaking ? 'border-[#2997ff]' : 'border-[#2997ff]/30',
          )}
          style={{ animation: techSpeaking ? 'breathe 0.9s ease-in-out infinite' : undefined }}
        />
      )}
      <div
        className={cn('relative transition-all duration-700', away && 'opacity-40 grayscale')}
        style={{ animation: speaking ? 'speak 1.1s ease-in-out infinite' : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
