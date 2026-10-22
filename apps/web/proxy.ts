import { type NextRequest, NextResponse } from 'next/server';
import { PASS_COOKIE, passDigest } from './lib/passcode';

/**
 * When SALES_COACH_PASSCODE is set, everything except the unlock page needs the passcode cookie.
 * Without it the app is open (protect it with Vercel Authentication instead).
 */
export async function proxy(req: NextRequest) {
  const pass = process.env.SALES_COACH_PASSCODE;
  if (!pass) return NextResponse.next();
  const { pathname, search } = req.nextUrl;
  if (pathname === '/unlock' || pathname === '/api/unlock') return NextResponse.next();
  if (req.cookies.get(PASS_COOKIE)?.value === (await passDigest(pass))) return NextResponse.next();
  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Locked' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/unlock';
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.svg|apple-icon.png|manifest.webmanifest|favicon.ico|robots.txt).*)'],
};
