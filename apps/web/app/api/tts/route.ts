import { elevenLabsKey } from '@/lib/server/keys';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MODELS = [
  process.env.ELEVENLABS_MODEL_ID,
  'eleven_v4_turbo',
  'eleven_v3_conversational',
  'eleven_v3',
  'eleven_flash_v2_5',
].filter((m, i, a): m is string => !!m && a.indexOf(m) === i);
let workingModel: string | null = null;

const VOICE_ID = /^[A-Za-z0-9]{10,40}$/;
const stripTags = (t: string) => t.replace(/\[[^\]]{1,24}\]\s*/g, '').trim();
const API = 'https://api.elevenlabs.io/v1';

/** Voices this account can actually use, fetched once if a cast voice is missing. */
let library: { voice_id: string; labels?: Record<string, string> }[] | null = null;
const substitutes = new Map<string, string>();

async function substituteFor(
  voice: string,
  key: string,
  gender: string | null,
): Promise<string | null> {
  if (substitutes.has(voice)) return substitutes.get(voice)!;
  if (!library) {
    const res = await fetch(`${API}/voices`, { headers: { 'xi-api-key': key } }).catch(() => null);
    if (!res?.ok) return null;
    library = ((await res.json()) as { voices?: typeof library }).voices ?? [];
  }
  const pick =
    library.find((v) => v.voice_id !== voice && (!gender || v.labels?.gender === gender)) ??
    library.find((v) => v.voice_id !== voice);
  if (pick) substitutes.set(voice, pick.voice_id);
  return pick?.voice_id ?? null;
}

async function synth(voice: string, text: string, model: string, key: string, signal: AbortSignal) {
  const v3 = /^eleven_v[3-9]/.test(model);
  return fetch(`${API}/text-to-speech/${voice}/stream?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: v3 ? text : stripTags(text),
      model_id: model,
      ...(v3 ? {} : { voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.2 } }),
    }),
    signal,
  }).catch(() => null);
}

/**
 * Streams a line in an ElevenLabs voice. GET so an <audio> element can start playing the
 * first bytes immediately. Falls back across models, and to another voice if a cast voice
 * is not in this account.
 */
export async function GET(req: Request) {
  const key = elevenLabsKey();
  if (!key) return new Response('Voice is not configured', { status: 404 });
  const url = new URL(req.url);
  const text = (url.searchParams.get('t') ?? '').slice(0, 1200).trim();
  let voice = url.searchParams.get('v') ?? '';
  const gender = url.searchParams.get('g');
  if (!text || !VOICE_ID.test(voice)) return new Response('Bad request', { status: 400 });
  voice = substitutes.get(voice) ?? voice;

  const order = workingModel ? [workingModel, ...MODELS.filter((m) => m !== workingModel)] : MODELS;
  let lastError = '';
  let swappedVoice = false;
  for (let i = 0; i < order.length; i++) {
    const model = order[i]!;
    const res = await synth(voice, text, model, key, req.signal);
    if (res?.ok && res.body) {
      workingModel = model;
      return new Response(res.body, {
        headers: {
          'content-type': 'audio/mpeg',
          'cache-control': 'no-store',
          'x-voice-model': model,
        },
      });
    }
    if (!res) {
      lastError = 'network';
      continue;
    }
    const detail = (await res.text().catch(() => '')).slice(0, 300);
    lastError = `${res.status} ${detail}`;
    // Auth and quota problems will not be fixed by another model or voice.
    if (res.status === 401 || res.status === 402 || res.status === 429) break;
    if (
      !swappedVoice &&
      (res.status === 404 ||
        /voice[_ ]?not[_ ]?found|voice.{0,20}(does not exist|not available)|invalid voice/i.test(
          detail,
        ))
    ) {
      const sub = await substituteFor(voice, key, gender);
      if (sub) {
        voice = sub;
        swappedVoice = true;
        i--; // retry the same model with the substitute voice
      }
    }
  }
  console.error('[api/tts] voice failed:', lastError);
  return new Response('Voice unavailable', { status: 502 });
}
