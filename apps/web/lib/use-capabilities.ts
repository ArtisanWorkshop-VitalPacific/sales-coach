'use client';

import { useEffect, useState } from 'react';
import type { Capabilities } from './capabilities';

let cache: Capabilities | null = null;
let inflight: Promise<Capabilities | null> | null = null;

export function fetchCapabilities(): Promise<Capabilities | null> {
  if (cache) return Promise.resolve(cache);
  inflight ??= fetch('/api/config', { cache: 'no-store' })
    .then((r) => (r.ok ? (r.json() as Promise<Capabilities>) : null))
    .then((c) => {
      cache = c;
      return c;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** What this deployment can do (Claude, voices, billing...). null while loading. */
export function useCapabilities() {
  const [caps, setCaps] = useState<Capabilities | null>(cache);
  const [loaded, setLoaded] = useState(!!cache);
  useEffect(() => {
    let live = true;
    fetchCapabilities().then((c) => {
      if (!live) return;
      setCaps(c);
      setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, []);
  return { caps, loaded };
}
