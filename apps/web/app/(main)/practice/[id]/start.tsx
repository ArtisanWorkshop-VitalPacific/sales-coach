'use client';

import { planPrice } from '@sales-coach/engine';
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
  // Follows the tech's company once their profile loads, until they pick another here.
  const [picked, setCompanyId] = useState<string | null>(null);
  const companyId = picked ?? profile.companyId;
  const plans = companies().find((c) => c.id === companyId)?.memberships ?? [];
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
          className="w-full rounded-md border hairline bg-surface-2 py-2.5 pr-10 pl-3.5 text-[15px]"
        >
          {companies().map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {plans.length > 0 && (
          <div className="well mt-3 px-3.5 py-3">
            <p className="t-caption text-ink-3">
              {plans.length > 1 ? 'Plans you can offer' : 'Plan you can offer'}
            </p>
            <ul className="mt-1.5 space-y-1">
              {plans.map((m) => (
                <li key={m.id} className="t-callout flex items-baseline justify-between gap-3">
                  <span className="font-medium text-ink">{m.name}</span>
                  <span className="text-right tabular-nums text-ink-2">{planPrice(m)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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
