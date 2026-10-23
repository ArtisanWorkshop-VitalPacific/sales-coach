import { NextResponse } from 'next/server';
import { capabilities } from '@/lib/capabilities';

export const dynamic = 'force-dynamic';

/** What this deployment can do, plus which commit is live. Never exposes key values. */
export function GET() {
  return NextResponse.json(
    { ...capabilities(), version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local' },
    { headers: { 'cache-control': 'no-store' } },
  );
}
