/**
 * Server only. The ElevenLabs key under its standard name or a common alternative, so a key
 * saved in Vercel as SALES_COACH_11LABS works the same as ELEVENLABS_API_KEY.
 */
const ELEVENLABS_NAMES = [
  'ELEVENLABS_API_KEY',
  'SALES_COACH_11LABS',
  'SALES_COACH_ELEVENLABS',
  'ELEVEN_LABS_API_KEY',
  'ELEVENLABS_KEY',
  'XI_API_KEY',
];

export function elevenLabsKey(): string | undefined {
  for (const name of ELEVENLABS_NAMES) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}
