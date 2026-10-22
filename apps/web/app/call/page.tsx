import type { Metadata } from 'next';
import { CallScreen } from './screen';

export const metadata: Metadata = { title: 'Call' };

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CallPage({ searchParams }: { searchParams: Promise<Search> }) {
  const q = await searchParams;
  return (
    <CallScreen
      scenarioId={one(q.scenario)}
      drillId={one(q.drill)}
      difficulty={one(q.d) ? Number(one(q.d)) : undefined}
      companyId={one(q.c)}
      job={one(q.job)}
      retryMove={one(q.retry)}
      tv={one(q.tv) === '1'}
      exam={one(q.kind) === 'exam'}
    />
  );
}
