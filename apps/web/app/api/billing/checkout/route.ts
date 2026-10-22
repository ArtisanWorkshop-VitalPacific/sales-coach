import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { quote, TIERS } from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  tier: z.enum(['core', 'pro', 'elite']),
  trucks: z.number().int().min(1).max(2000),
  company: z.string().max(120).optional(),
});

/**
 * Stripe Checkout for an annual license. Prices are computed from the plan, so nothing has to
 * be set up in Stripe first. The Elite build fee is invoiced separately after the scoping call.
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: 'Billing is not connected yet.' }, { status: 501 });
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  const q = quote(body.tier, body.trucks);
  if (q.custom) {
    return NextResponse.json({ error: 'Shops over 60 trucks get a custom quote.' }, { status: 400 });
  }
  const stripe = new Stripe(key);
  const origin = new URL(req.url).origin;
  const tier = TIERS[body.tier];
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: q.annual * 100,
        recurring: { interval: 'year' },
        product_data: {
          name: `Sales Coach ${tier.name} license`,
          description: `${q.band.label}. ${q.pooledMinutes.toLocaleString()} pooled practice minutes a month.`,
        },
      },
    },
  ];
  if (body.tier === 'elite') {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: q.eliteAnnual * 100,
        recurring: { interval: 'year' },
        product_data: {
          name: 'Elite strategy program',
          description: 'Quarterly content refresh and an on-site seminar each year.',
        },
      },
    });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      subscription_data: {
        metadata: {
          tier: body.tier,
          trucks: String(body.trucks),
          company: body.company ?? '',
          ...(q.build ? { elite_build_due: String(q.build) } : {}),
        },
      },
      success_url: `${origin}/portal?tab=billing&checkout=success`,
      cancel_url: `${origin}/portal?tab=billing&checkout=cancel`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('[billing]', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
