'use client';

import type { Debrief, SessionRecord } from '@sales-coach/engine';
import { createStore, del, get, set, values } from 'idb-keyval';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/* ------------------------------------------------------------ sessions (IndexedDB) */

export interface StoredSession {
  id: string;
  createdAt: string;
  techName: string;
  scenarioId: string;
  scenarioTitle: string;
  personaId: string;
  personaName: string;
  drillId?: string;
  kind: SessionRecord['kind'];
  difficulty: number;
  durationMs: number;
  record: SessionRecord;
  debrief: Debrief;
}

let idb: ReturnType<typeof createStore> | null = null;
const db = () => {
  if (typeof indexedDB === 'undefined') return null;
  idb ??= createStore('sales-coach', 'sessions');
  return idb;
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export async function saveSession(s: StoredSession) {
  const d = db();
  if (!d) return;
  await set(s.id, s, d);
  emit();
}

export async function getSession(id: string): Promise<StoredSession | undefined> {
  const d = db();
  return d ? get<StoredSession>(id, d) : undefined;
}

export async function deleteSession(id: string) {
  const d = db();
  if (!d) return;
  await del(id, d);
  emit();
}

export async function listSessions(): Promise<StoredSession[]> {
  const d = db();
  if (!d) return [];
  const all = await values<StoredSession>(d);
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function useSessions() {
  const [sessions, setSessions] = useState<StoredSession[] | null>(null);
  const reload = useCallback(() => {
    listSessions()
      .then(setSessions)
      .catch(() => setSessions([]));
  }, []);
  useEffect(() => {
    reload();
    listeners.add(reload);
    return () => {
      listeners.delete(reload);
    };
  }, [reload]);
  return { sessions, reload };
}

/* ------------------------------------------------------- profile + settings (local) */

export interface Profile {
  name: string;
  companyId: string;
  role: 'tech' | 'manager' | 'owner';
  onboarded: boolean;
}

export interface Settings {
  captions: boolean;
  /** Hands-free listens automatically; push-to-talk waits for the mic button. */
  inputMode: 'hands-free' | 'push';
  /** Let the tech talk over the customer (headphones recommended). */
  bargeIn: boolean;
  /** auto uses ElevenLabs when the deployment has a key. */
  voice: 'auto' | 'browser';
  /** auto uses Claude when the deployment has a key. */
  brain: 'auto' | 'demo';
  /** Silence before your turn is sent, in ms. */
  endpointMs: number;
  theme: 'system' | 'light' | 'dark';
}

export const DEFAULT_PROFILE: Profile = {
  name: '',
  companyId: 'demo-company',
  role: 'tech',
  onboarded: false,
};
export const DEFAULT_SETTINGS: Settings = {
  captions: true,
  inputMode: 'hands-free',
  bargeIn: false,
  voice: 'auto',
  brain: 'auto',
  endpointMs: 1100,
  theme: 'system',
};

function localStore<T extends object>(key: string, fallback: T) {
  const subs = new Set<() => void>();
  let cache: T | null = null;
  let raw: string | null = null;
  const read = (): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const r = window.localStorage.getItem(key);
      if (r === raw && cache) return cache;
      raw = r;
      cache = r ? { ...fallback, ...(JSON.parse(r) as Partial<T>) } : fallback;
      return cache;
    } catch {
      return fallback;
    }
  };
  const write = (patch: Partial<T>) => {
    const next = { ...read(), ...patch };
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* private mode */
    }
    cache = next;
    raw = JSON.stringify(next);
    subs.forEach((s) => s());
  };
  const subscribe = (cb: () => void) => {
    subs.add(cb);
    const onStorage = (e: StorageEvent) => e.key === key && cb();
    window.addEventListener('storage', onStorage);
    return () => {
      subs.delete(cb);
      window.removeEventListener('storage', onStorage);
    };
  };
  return { read, write, subscribe, fallback };
}

const profileStore = localStore<Profile>('sc.profile', DEFAULT_PROFILE);
const settingsStore = localStore<Settings>('sc.settings', DEFAULT_SETTINGS);

export function useProfile(): [Profile, (p: Partial<Profile>) => void] {
  const p = useSyncExternalStore(
    profileStore.subscribe,
    profileStore.read,
    () => profileStore.fallback,
  );
  return [p, profileStore.write];
}

export function useSettings(): [Settings, (s: Partial<Settings>) => void] {
  const s = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.read,
    () => settingsStore.fallback,
  );
  return [s, settingsStore.write];
}

export const readSettings = () => settingsStore.read();
export const readProfile = () => profileStore.read();
