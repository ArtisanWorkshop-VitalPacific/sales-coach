'use client';

import { useState } from 'react';
import { Button, Chip } from './ui';

interface Probe {
  role: string;
  model: string;
  ok: boolean;
  ms: number;
  error?: string;
}

/** One tap after adding a key: proves the key works and shows which models answered. */
export function HealthCheck({ kind }: { kind: 'claude' | 'voice' }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; probes?: Probe[]; error?: string } | null>(null);
  return (
    <div className="mt-4">
      <Button
        variant="secondary"
        size="sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setResult(null);
          try {
            const res = await fetch(`/api/health?check=${kind}`, { cache: 'no-store' });
            setResult(await res.json());
          } catch (e) {
            setResult({ ok: false, error: (e as Error).message });
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? 'Testing...' : 'Run a live test'}
      </Button>
      {result && (
        <div className="mt-3 space-y-1.5">
          <Chip tone={result.ok ? 'positive' : 'negative'}>{result.ok ? 'Working' : 'Needs attention'}</Chip>
          {result.error && <p className="t-caption text-negative">{result.error}</p>}
          {result.probes?.map((p) => (
            <p key={`${p.role}-${p.model}`} className="t-caption text-ink-3">
              <span className={p.ok ? 'text-positive' : 'text-negative'}>{p.ok ? 'OK' : 'Failed'}</span> · {p.role} · {p.model} · {p.ms} ms
              {p.error ? ` · ${p.error}` : ''}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
