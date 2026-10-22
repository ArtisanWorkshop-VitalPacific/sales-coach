import { createClaudeClient, PRESETS, presetFromEnv } from '@sales-coach/engine/claude';
import { NextResponse } from 'next/server';
import { ELEVEN } from '@/lib/voices';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface Probe {
  role: string;
  model: string;
  ok: boolean;
  ms: number;
  error?: string;
}

const short = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 160);

/** Tiny live checks after adding keys: can each configured model and the voice answer? */
export async function GET(req: Request) {
  const check = new URL(req.url).searchParams.get('check');
  if (check === 'claude') {
    if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY is not set' });
    const client = createClaudeClient();
    const roles = PRESETS[presetFromEnv(process.env.SALES_COACH_PRESET)];
    const targets: [string, string][] = [
      ['Listens', roles.perceive.model],
      ['Speaks', roles.write.model],
      ['Coaches', roles.coach.model],
    ];
    const probes: Probe[] = await Promise.all(
      targets.map(async ([role, model]) => {
        const t = Date.now();
        try {
          await client.messages.create({ model, max_tokens: 8, messages: [{ role: 'user', content: 'Reply with OK.' }] });
          return { role, model, ok: true, ms: Date.now() - t };
        } catch (e) {
          return { role, model, ok: false, ms: Date.now() - t, error: short(e) };
        }
      }),
    );
    return NextResponse.json({ ok: probes.every((p) => p.ok), probes });
  }
  if (check === 'voice') {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) return NextResponse.json({ ok: false, error: 'ELEVENLABS_API_KEY is not set' });
    const models = [process.env.ELEVENLABS_MODEL_ID, 'eleven_v3_conversational', 'eleven_v3', 'eleven_flash_v2_5'].filter(
      (m, i, a): m is string => !!m && a.indexOf(m) === i,
    );
    const probes: Probe[] = [];
    for (const model of models) {
      const t = Date.now();
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN.matilda}?output_format=mp3_22050_32`, {
        method: 'POST',
        headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
        body: JSON.stringify({ text: 'Hello.', model_id: model }),
      }).catch((e: unknown) => ({ ok: false, status: 0, text: async () => short(e) }) as const);
      const ok = res.ok;
      probes.push({ role: 'Voice', model, ok, ms: Date.now() - t, ...(ok ? {} : { error: `${res.status} ${(await res.text()).slice(0, 140)}` }) });
      if (ok) break;
    }
    return NextResponse.json({ ok: probes.some((p) => p.ok), probes });
  }
  return NextResponse.json({ error: 'Use ?check=claude or ?check=voice' }, { status: 400 });
}
