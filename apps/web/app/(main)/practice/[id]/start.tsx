'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Segmented } from '@/components/ui';
import { companies, DIFFICULTY_LABEL } from '@/lib/content';
import { useProfile } from '@/lib/store';

export function BriefingStart({
  scenarioId,
  defaultDifficulty,
}: {
  scenarioId: string;
  defaultDifficulty: number;
}) {
  const router = useRouter();
  const [profile] = useProfile();
  const [d, setD] = useState(String(defaultDifficulty) as '1' | '2' | '3' | '4' | '5');
  const [companyId, setCompanyId] = useState(profile.companyId);
  return (
    <div className="mt-6 space-y-5">
      <div>
        <p className="t-caption mb-2 text-ink-3">Difficulty: {DIFFICULTY_LABEL[Number(d)]}</p>
        <Segmented
          size="sm"
          value={d}
          onChange={setD}
          options={(['1', '2', '3', '4', '5'] as const).map((v) => ({ value: v, label: v }))}
        />
      </div>
      <div>
        <label className="t-caption mb-2 block text-ink-3" htmlFor="company">
          Company process
        </label>
        <select
          id="company"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="w-full rounded-md border hairline bg-surface-2 px-3 py-2.5 text-[15px]"
        >
          {companies().map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <Button
        size="lg"
        className="w-full"
        onClick={() =>
          router.push(`/call?scenario=${scenarioId}&d=${d}&c=${encodeURIComponent(companyId)}`)
        }
      >
        Start the call
      </Button>
    </div>
  );
}
