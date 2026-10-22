import type { Metadata } from 'next';
import { LiveScreen } from './screen';

export const metadata: Metadata = { title: 'Live call' };

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function LivePage({ searchParams }: { searchParams: Promise<Search> }) {
  const q = await searchParams;
  return (
    <LiveScreen
      scenarioId={one(q.scenario)}
      drillId={one(q.drill)}
      difficulty={one(q.d) ? Number(one(q.d)) : undefined}
      companyId={one(q.c)}
    />
  );
}
