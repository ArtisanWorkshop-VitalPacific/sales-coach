import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { PASS_COOKIE, passDigest } from '@/lib/passcode';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const pass = process.env.SALES_COACH_PASSCODE;
  if (!pass) return NextResponse.json({ ok: true });
  const body = (await req.json().catch(() => ({}))) as { passcode?: string };
  const given = Buffer.from(String(body.passcode ?? ''));
  const want = Buffer.from(pass);
  const ok = given.length === want.length && timingSafeEqual(given, want);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PASS_COOKIE, await passDigest(pass), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
