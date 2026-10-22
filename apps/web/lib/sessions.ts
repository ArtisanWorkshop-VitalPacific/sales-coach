'use client';

import { type Debrief, type SessionRecord, scoreRecord } from '@sales-coach/engine';
import { contentIndex } from './content';
import { getSession, readProfile, type StoredSession, saveSession } from './store';

/** Score a finished call with the rubric right away and store it on this device. */
export async function storeFinishedCall(
  record: SessionRecord,
  opts: { techName?: string } = {},
): Promise<StoredSession> {
  const index = contentIndex();
  const debrief = scoreRecord(record, index);
  const scenario = index.scenarios.get(record.scenarioId);
  const persona = index.personas.get(record.personaId);
  const stored: StoredSession = {
    id: record.id,
    createdAt: record.startedAt,
    techName: opts.techName || readProfile().name || 'You',
    scenarioId: record.scenarioId,
    scenarioTitle: scenario?.title ?? record.scenarioId,
    personaId: record.personaId,
    personaName: persona?.name ?? record.personaId,
    drillId: record.drillId,
    kind: record.kind,
    difficulty: record.difficulty,
    durationMs: record.durationMs,
    record,
    debrief,
  };
  await saveSession(stored);
  return stored;
}

/** Ask the Claude Coach for the full review. Returns null when it is not available. */
export async function requestCoachDebrief(id: string): Promise<Debrief | null> {
  const s = await getSession(id);
  if (!s) return null;
  const res = await fetch('/api/score', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ record: s.record }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { debrief?: Debrief };
  if (!json.debrief || json.debrief.scoredBy !== 'claude') return null;
  await saveSession({ ...s, debrief: json.debrief });
  return json.debrief;
}

export function decisionLine(name: string, decision: SessionRecord['decision']) {
  const first = name.split(' ')[0];
  if (decision === 'yes') return `${first} said yes.`;
  if (decision === 'later') return `${first} wants to think about it.`;
  if (decision === 'no') return `${first} said no.`;
  return 'No decision yet.';
}

export const formatDuration = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function relativeDay(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86400000);
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (days <= 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
