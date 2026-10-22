/** Optional shared passcode gate (SALES_COACH_PASSCODE). Keeps a public URL from spending your Claude credits. */
export const PASS_COOKIE = 'sc_pass';

export async function passDigest(passcode: string): Promise<string> {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`sales-coach:${passcode}`),
  );
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
