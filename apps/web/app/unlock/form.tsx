'use client';

import { useState } from 'react';
import { Wordmark } from '@/components/logo';

export function UnlockForm({ next }: { next: string }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="card reveal w-full max-w-sm p-8 text-center"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(false);
        const res = await fetch('/api/unlock', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ passcode: code }),
        });
        setBusy(false);
        if (res.ok) window.location.href = next;
        else setError(true);
      }}
    >
      <Wordmark className="justify-center" />
      <p className="t-callout mt-6 text-ink-3">Enter your team passcode.</p>
      <input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mt-4 w-full rounded-md border hairline bg-surface-2 px-4 py-3 text-center text-[17px] outline-none focus:border-accent"
        autoFocus
        autoComplete="current-password"
        aria-label="Passcode"
      />
      {error && <p className="t-caption mt-2 text-negative">That passcode did not work.</p>}
      <button type="submit" className="btn btn-primary mt-5 w-full" disabled={busy || !code}>
        Continue
      </button>
    </form>
  );
}
