import { type SessionRecord, scoreRecord } from '@sales-coach/engine';
import { NextResponse } from 'next/server';
import { contentIndex } from '@/lib/content';
import { serverAdapters } from '@/lib/server/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Fluid compute allows 300 seconds on every plan. The coach usually finishes in well under 60.
export const maxDuration = 300;

/** The Coach: Claude reviews the whole call. Falls back to the rubric score without a key. */
export async function POST(req: Request) {
  let record: SessionRecord;
  try {
    const body = (await req.json()) as { record?: SessionRecord };
    if (!body.record?.transcript) throw new Error('missing record');
    record = body.record;
  } catch (e) {
    return NextResponse.json({ error: `Bad request: ${(e as Error).message}` }, { status: 400 });
  }
  const index = contentIndex();
  const adapters = serverAdapters();
  // Certification calls are judged by the strongest model; practice by the Opus coach.
  const coach = record.kind === 'exam' ? (adapters.examCoach ?? adapters.coach) : adapters.coach;
  if (!coach) return NextResponse.json({ debrief: scoreRecord(record, index) });
  try {
    // Leave room to answer with the quick score if the review runs long.
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(280_000)]);
    const debrief = await coach.debrief(record, index, signal);
    return NextResponse.json({ debrief });
  } catch (e) {
    console.error('[api/score]', e);
    return NextResponse.json({
      debrief: scoreRecord(record, index),
      warning: (e as Error).message,
    });
  }
}
