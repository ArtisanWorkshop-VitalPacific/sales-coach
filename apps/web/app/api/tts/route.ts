export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MODELS = [process.env.ELEVENLABS_MODEL_ID, 'eleven_v3_conversational', 'eleven_v3', 'eleven_flash_v2_5'].filter(
  (m, i, a): m is string => !!m && a.indexOf(m) === i,
);
let workingModel: string | null = null;

const VOICE_ID = /^[A-Za-z0-9]{10,40}$/;
const stripTags = (t: string) => t.replace(/\[[^\]]{1,24}\]\s*/g, '').trim();

/**
 * Streams a line in an ElevenLabs voice. GET so an <audio> element can start playing
 * the first bytes immediately. Only short lines, only known voice id shapes.
 */
export async function GET(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return new Response('Voice is not configured', { status: 404 });
  const url = new URL(req.url);
  const text = (url.searchParams.get('t') ?? '').slice(0, 1200).trim();
  const voice = url.searchParams.get('v') ?? '';
  if (!text || !VOICE_ID.test(voice)) return new Response('Bad request', { status: 400 });

  const order = workingModel ? [workingModel, ...MODELS.filter((m) => m !== workingModel)] : MODELS;
  let lastError = '';
  for (const model of order) {
    const v3 = model.startsWith('eleven_v3');
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
        body: JSON.stringify({
          text: v3 ? text : stripTags(text),
          model_id: model,
          ...(v3 ? {} : { voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.2 } }),
        }),
        signal: req.signal,
      },
    ).catch((e: Error) => {
      lastError = e.message;
      return null;
    });
    if (res?.ok && res.body) {
      workingModel = model;
      return new Response(res.body, {
        headers: { 'content-type': 'audio/mpeg', 'cache-control': 'no-store', 'x-voice-model': model },
      });
    }
    if (res) {
      lastError = `${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`;
      // Auth and quota problems will not be fixed by another model.
      if (res.status === 401 || res.status === 402 || res.status === 429) break;
    }
  }
  console.error('[api/tts] all voice models failed:', lastError);
  return new Response('Voice unavailable', { status: 502 });
}
