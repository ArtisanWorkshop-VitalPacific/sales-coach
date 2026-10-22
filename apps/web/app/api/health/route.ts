import {
  createClaudeClient,
  PRESETS,
  presetFromEnv,
  recoverable,
  requestFields,
} from '@sales-coach/engine/claude';
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
  note?: string;
}

const short = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 160);

/**
 * Tiny live checks after adding keys. Each role is called with the exact settings a real call
 * uses (model, effort, thinking, fast mode), so a pass here means a pass in practice.
 */
export async function GET(req: Request) {
  const check = new URL(req.url).searchParams.get('check');
  if (check === 'claude') {
    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY is not set' });
    const client = createClaudeClient();
    const roles = PRESETS[presetFromEnv(process.env.SALES_COACH_PRESET)];
    const targets = [
      ['Listens', roles.perceive],
      ['Speaks', roles.write],
      ['Coaches', roles.coach],
    ] as const;
    const probes: Probe[] = await Promise.all(
      targets.map(async ([role, config]) => {
        const params: Record<string, unknown> = {
          ...requestFields(config),
          max_tokens: 256,
          messages: [{ role: 'user', content: 'Reply with OK.' }],
        };
        const t = Date.now();
        try {
          await client.messages.create(params as never, { timeout: 30_000 });
          return {
            role,
            model: config.model + (config.speed === 'fast' ? ' (fast)' : ''),
            ok: true,
            ms: Date.now() - t,
          };
        } catch (e) {
          const next = recoverable(e, params);
          if (next) {
            try {
              await client.messages.create(next as never, { timeout: 30_000 });
              return {
                role,
                model: String(next.model),
                ok: true,
                ms: Date.now() - t,
                note: `Works with an automatic adjustment: ${short(e)}`,
              };
            } catch (e2) {
              return { role, model: config.model, ok: false, ms: Date.now() - t, error: short(e2) };
            }
          }
          return { role, model: config.model, ok: false, ms: Date.now() - t, error: short(e) };
        }
      }),
    );
    return NextResponse.json({ ok: probes.every((p) => p.ok), probes });
  }
  if (check === 'voice') {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) return NextResponse.json({ ok: false, error: 'ELEVENLABS_API_KEY is not set' });
    const models = [
      process.env.ELEVENLABS_MODEL_ID,
      'eleven_v3_conversational',
      'eleven_v3',
      'eleven_flash_v2_5',
    ].filter((m, i, a): m is string => !!m && a.indexOf(m) === i);
    const probes: Probe[] = [];
    for (const model of models) {
      const t = Date.now();
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN.matilda}?output_format=mp3_22050_32`,
        {
          method: 'POST',
          headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
          body: JSON.stringify({ text: 'Hello.', model_id: model }),
        },
      ).catch(() => null);
      if (res?.ok) {
        probes.push({ role: 'Voice', model, ok: true, ms: Date.now() - t });
        break;
      }
      const detail = res
        ? `${res.status} ${(await res.text().catch(() => '')).slice(0, 140)}`
        : 'network error';
      probes.push({ role: 'Voice', model, ok: false, ms: Date.now() - t, error: detail });
    }
    return NextResponse.json({ ok: probes.some((p) => p.ok), probes });
  }
  return NextResponse.json({ error: 'Use ?check=claude or ?check=voice' }, { status: 400 });
}
