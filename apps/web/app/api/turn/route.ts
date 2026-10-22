import type { SessionSnapshot, SpecRequest, TechTurnInput } from '@sales-coach/engine';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CustomerSession, sessionOptions } from '@/lib/server/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const Body = z.discriminatedUnion('op', [
  z.object({
    op: z.literal('start'),
    request: z.object({
      scenarioId: z.string().optional(),
      drillId: z.string().optional(),
      personaId: z.string().optional(),
      companyId: z.string().optional(),
      difficulty: z.number().min(1).max(5).optional(),
      seed: z.number().optional(),
      kind: z.enum(['full', 'drill', 'exam', 'rehearsal']).optional(),
      forcedMoves: z.array(z.string()).optional(),
      job: z.any().optional(),
    }),
  }),
  z.object({
    op: z.literal('tech'),
    snapshot: z.any(),
    input: z.object({
      text: z.string().min(1).max(4000),
      startedAtMs: z.number().optional(),
      endedAtMs: z.number().optional(),
      interruptedCustomer: z.boolean().optional(),
      holdElapsedMs: z.number().optional(),
    }),
  }),
  z.object({ op: z.literal('hold'), snapshot: z.any() }),
  z.object({ op: z.literal('end'), snapshot: z.any() }),
]);

/**
 * One customer turn. Stateless: the client sends the call's snapshot and gets the next one back,
 * so any server instance can answer and nothing is stored here.
 */
export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: `Bad request: ${(e as Error).message}` }, { status: 400 });
  }
  try {
    if (body.op === 'start') {
      const request = body.request as SpecRequest;
      const seed = request.seed ?? Math.floor(Math.random() * 2 ** 31);
      const session = new CustomerSession({ ...request, seed }, sessionOptions(seed));
      const turn = await session.start();
      return NextResponse.json({ snapshot: session.snapshot(), turn });
    }
    const snapshot = body.snapshot as SessionSnapshot;
    if (!snapshot || snapshot.v !== 1) {
      return NextResponse.json({ error: 'Missing or invalid snapshot' }, { status: 400 });
    }
    const session = CustomerSession.restore(snapshot, sessionOptions(snapshot.request.seed));
    if (body.op === 'tech') {
      const turn = await session.techTurn(body.input as TechTurnInput);
      return NextResponse.json({ snapshot: session.snapshot(), turn });
    }
    if (body.op === 'end') {
      // The finished call record, built where the turns ran. Used by checks and server saves.
      const record = session.end();
      record.adapters = snapshot.adapters ?? record.adapters;
      return NextResponse.json({ record });
    }
    const turn = await session.holdElapsed();
    return NextResponse.json({ snapshot: session.snapshot(), turn });
  } catch (e) {
    console.error('[api/turn]', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
