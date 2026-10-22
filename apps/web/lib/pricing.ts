/** Pricing from the business plan. License by trucks, billed annually, pooled practice minutes. */

export const BANDS = [
  { id: 'small', label: 'Up to 10 trucks', max: 10, monthly: 990, minutes: 2500 },
  { id: 'mid', label: '11 to 25 trucks', max: 25, monthly: 1990, minutes: 6000 },
  { id: 'large', label: '26 to 60 trucks', max: 60, monthly: 3990, minutes: 14000 },
] as const;

export const OVERAGE_PER_MINUTE = 0.15;
export const SEMINAR_PER_DAY = 7500;

export const TIERS = {
  core: {
    name: 'Core',
    tagline: 'Every tech. Every objection. Every day.',
    multiplier: 1,
    includes: [
      'Industry objection library: 40 plumbing objections in 7 groups',
      '12 customer personas and 30 real-world scenarios',
      'Drills with try-again, full calls at 5 difficulty levels',
      'Spoken debrief after every call',
      'Progress, manager digest, assignments',
      'Training-day mode for the shop TV',
      'English and Spanish',
    ],
  },
  pro: {
    name: 'Pro',
    tagline: 'Practice the job before you knock.',
    multiplier: 1.4,
    includes: [
      'Everything in Core',
      'ServiceTitan job loop: rehearse the next job, review the outcome',
      'Certification exams and levels',
      'Hiring assessments',
      'Company portal: your objections, scripts, and price book',
    ],
  },
  elite: {
    name: 'Elite',
    tagline: 'Your team. Your objections. Built for you.',
    multiplier: 1.4,
    build: 30000,
    annual: 15000,
    includes: [
      'Everything in Pro',
      'A sales strategy team on site for 2 days: ride-alongs and interviews',
      'Custom personas, moves, and scoring from your team’s own objections',
      'A 1-day in-person sales seminar for the whole team',
      'Quarterly content refresh and one on-site seminar a year',
    ],
  },
} as const;

export type TierId = keyof typeof TIERS;

export function bandFor(trucks: number) {
  return BANDS.find((b) => trucks <= b.max) ?? null;
}

export function quote(tier: TierId, trucks: number, _billing: 'monthly' | 'annual' = 'annual') {
  const band = bandFor(trucks);
  if (!band) {
    return { custom: true as const, band: null, monthly: 0, annual: 0, pooledMinutes: 0, build: 0, eliteAnnual: 0 };
  }
  const monthly = Math.round(band.monthly * TIERS[tier].multiplier);
  return {
    custom: false as const,
    band,
    monthly,
    annual: monthly * 12,
    pooledMinutes: band.minutes,
    build: tier === 'elite' ? TIERS.elite.build : 0,
    eliteAnnual: tier === 'elite' ? TIERS.elite.annual : 0,
  };
}

export const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
