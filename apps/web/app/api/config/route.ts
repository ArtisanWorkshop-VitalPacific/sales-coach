import { NextResponse } from 'next/server';
import { capabilities } from '@/lib/capabilities';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(capabilities(), { headers: { 'cache-control': 'no-store' } });
}
