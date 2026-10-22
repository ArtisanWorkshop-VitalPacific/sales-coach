import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  request: z.object({
    scenarioId: z.string().optional(),
    drillId: z.string().optional(),
    companyId: z.string().optional(),
    difficulty: z.number().min(1).max(5).optional(),
    kind: z.enum(['full', 'drill', 'exam', 'rehearsal']).optional(),
    forcedMoves: z.array(z.string()).optional(),
  }),
});

/**
 * Live mode: a short-lived LiveKit token for one practice room. The session request rides in
 * the participant metadata, where the agent worker reads it.
 */
export async function POST(req: Request) {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return NextResponse.json({ error: 'Live mode is not configured.' }, { status: 501 });
  }
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  const id = crypto.randomUUID().slice(0, 8);
  const room = `sc-${id}`;
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `tech-${id}`,
    name: 'Tech',
    ttl: '30m',
    metadata: JSON.stringify({ ...body.request, appSessionId: id }),
  });
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true });
  return NextResponse.json({ url: LIVEKIT_URL, token: await at.toJwt(), room });
}
