'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button, ButtonLink } from '@/components/ui';
import { Speaker } from '@/lib/speech/speaker';
import { useProfile } from '@/lib/store';
import { useCapabilities } from '@/lib/use-capabilities';
import { COACH_BROWSER, COACH_VOICE } from '@/lib/voices';

export function DrillActions({ drillId, why }: { drillId: string; why: string }) {
  const [profile] = useProfile();
  const { caps } = useCapabilities();
  const sp = useRef<Speaker | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => sp.current?.stop(), []);
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <ButtonLink
        href={`/call?drill=${drillId}&c=${encodeURIComponent(profile.companyId)}`}
        size="lg"
      >
        Start the drill
      </ButtonLink>
      <Button
        variant="secondary"
        size="lg"
        onClick={async () => {
          if (playing) {
            sp.current?.stop();
            setPlaying(false);
            return;
          }
          sp.current ??= new Speaker(!!caps?.voice);
          sp.current.unlock();
          setPlaying(true);
          await sp.current.speak(why, { eleven: COACH_VOICE, browser: COACH_BROWSER });
          setPlaying(false);
        }}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />} {playing ? 'Pause' : 'Hear the lesson'}
      </Button>
    </div>
  );
}
