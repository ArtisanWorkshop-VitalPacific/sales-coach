'use client';

import type { SessionRecord } from '@sales-coach/engine';
import { ArrowLeft, PhoneOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Orb, orbFor } from '@/components/orb';
import { cn } from '@/components/ui';
import { contentIndex } from '@/lib/content';
import { storeFinishedCall } from '@/lib/sessions';

interface Props {
  scenarioId?: string;
  drillId?: string;
  difficulty?: number;
  companyId?: string;
}

interface Caption {
  speaker: 'tech' | 'customer' | 'secondary';
  name?: string;
  text: string;
  final: boolean;
}

type Status = 'ready' | 'connecting' | 'live' | 'ending' | 'error';

/**
 * Live mode: full-duplex voice over WebRTC. The LiveKit agent worker plays the customer with
 * the same engine; this page only carries audio, captions, and the final record.
 */
export function LiveScreen(p: Props) {
  const router = useRouter();
  const index = contentIndex();
  const drill = p.drillId ? index.drills.get(p.drillId) : undefined;
  const scenario = index.scenarios.get(drill?.scenarioId ?? p.scenarioId ?? '');
  const persona = scenario ? index.persona(drill?.personaId ?? scenario.personaId) : undefined;
  const [status, setStatus] = useState<Status>('ready');
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const roomRef = useRef<import('livekit-client').Room | null>(null);
  const recordRef = useRef<((r: SessionRecord) => void) | null>(null);

  useEffect(
    () => () => {
      void roomRef.current?.disconnect();
    },
    [],
  );

  async function start() {
    setStatus('connecting');
    setError(null);
    try {
      const { Room, RoomEvent, Track } = await import('livekit-client');
      const res = await fetch('/api/live/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          request: {
            ...(p.drillId ? { drillId: p.drillId } : { scenarioId: p.scenarioId }),
            companyId: p.companyId,
            difficulty: p.difficulty,
          },
        }),
      });
      const json = (await res.json()) as { url?: string; token?: string; error?: string };
      if (!res.ok || !json.url || !json.token)
        throw new Error(json.error ?? 'Could not start Live mode');
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;
      const decoder = new TextDecoder();
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          const el = track.attach();
          el.style.display = 'none';
          document.body.appendChild(el);
        }
      });
      room.on(RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
        if (topic !== 'captions') return;
        try {
          const c = JSON.parse(decoder.decode(payload)) as Caption;
          setCaptions((prev) => [...prev, c].slice(-12));
        } catch {
          /* ignore */
        }
      });
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        setSpeaking(speakers.some((s) => s.identity !== room.localParticipant.identity));
      });
      room.registerTextStreamHandler('record', async (reader) => {
        const text = await reader.readAll();
        try {
          const { record } = JSON.parse(text) as { record: SessionRecord };
          recordRef.current?.(record);
        } catch {
          /* ignore */
        }
      });
      await room.connect(json.url, json.token);
      await room.startAudio();
      await room.localParticipant.setMicrophoneEnabled(true);
      setStatus('live');
    } catch (e) {
      setStatus('error');
      setError((e as Error).message);
    }
  }

  async function end() {
    const room = roomRef.current;
    if (!room) return;
    setStatus('ending');
    const record = await new Promise<SessionRecord | null>((resolve) => {
      recordRef.current = resolve;
      void room.localParticipant
        .publishData(new TextEncoder().encode(JSON.stringify({ type: 'end' })), {
          reliable: true,
          topic: 'control',
        })
        .catch(() => resolve(null));
      setTimeout(() => resolve(null), 10000);
    });
    await room.disconnect();
    if (record) {
      const stored = await storeFinishedCall(record);
      router.replace(`/debrief/${stored.id}`);
    } else {
      setStatus('error');
      setError('The call ended, but the record did not arrive. Check the agent worker logs.');
    }
  }

  if (!scenario || !persona) {
    return (
      <div className="grid min-h-dvh place-items-center p-8 text-center text-ink">
        <Link href="/practice" className="btn btn-primary">
          Pick a customer
        </Link>
      </div>
    );
  }

  const first = persona.name.split(' ')[0];
  return (
    <div className="flex min-h-dvh flex-col px-5 pt-[max(16px,env(safe-area-inset-top))] text-ink">
      <div className="mx-auto flex h-12 w-full max-w-[920px] items-center justify-between">
        {status === 'live' || status === 'ending' ? (
          <button
            type="button"
            onClick={end}
            disabled={status === 'ending'}
            className="btn btn-sm btn-danger"
          >
            <PhoneOff size={16} /> {status === 'ending' ? 'Ending' : 'End'}
          </button>
        ) : (
          <Link href={`/practice/${scenario.id}`} className="btn btn-sm btn-glass">
            <ArrowLeft size={16} /> Back
          </Link>
        )}
        <span className="flex items-center gap-1.5 rounded-pill bg-glass-strong px-2.5 py-1 text-[13px] text-ink-2 shadow-ring">
          <span className="h-1.5 w-1.5 rounded-full bg-ink" /> Live
        </span>
        <span className="w-16" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative grid h-[196px] w-[196px] place-items-center">
          {speaking && (
            <span className="absolute h-[168px] w-[168px] animate-[ripple_1.8s_ease-out_infinite] rounded-full border border-ink/15" />
          )}
          <span
            className="block rounded-full"
            style={{
              animation: speaking
                ? 'speak 1.1s ease-in-out infinite'
                : 'breathe 4s ease-in-out infinite',
            }}
          >
            <Orb name={orbFor(persona.id)} size={168} live />
          </span>
        </div>
        <h1 className="mt-10 text-[34px] leading-tight font-light tracking-[-0.022em]">
          {persona.name}
        </h1>
        <p className="mt-2 text-[15px] text-ink-3">
          {status === 'ready'
            ? 'Live mode. Talk like it is a real call.'
            : status === 'connecting'
              ? `Calling on ${first}`
              : status === 'ending'
                ? 'Wrapping up'
                : status === 'error'
                  ? 'Live mode is not available'
                  : speaking
                    ? `${first} is talking`
                    : 'Go ahead'}
        </p>
        {error && <p className="mt-4 max-w-sm text-[14px] text-negative">{error}</p>}
      </div>
      <div
        className={cn(
          'mx-auto mb-4 w-full max-w-[920px] space-y-3',
          captions.length > 0 && 'card px-5 py-4',
        )}
      >
        {captions.slice(-3).map((c, i) => (
          <p
            key={i}
            className={cn('text-[19px]', c.speaker === 'tech' ? 'text-ink-3' : 'text-ink')}
          >
            <span
              className={cn('mr-2 font-semibold', c.speaker === 'tech' ? 'text-ink-3' : 'text-ink')}
            >
              {c.speaker === 'tech' ? 'You' : (c.name ?? first)}
            </span>
            {c.text}
          </p>
        ))}
      </div>
      <div className="safe-bottom mx-auto w-full max-w-sm pb-4">
        {(status === 'ready' || status === 'error') && (
          <button type="button" onClick={start} className="btn btn-primary btn-lg w-full">
            {status === 'error' ? 'Try again' : 'Start the live call'}
          </button>
        )}
      </div>
    </div>
  );
}
