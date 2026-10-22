import type { Metadata } from 'next';
import { DebriefView } from './view';

export const metadata: Metadata = { title: 'Debrief' };

export default async function DebriefPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const q = await searchParams;
  return <DebriefView id={id} tv={q.tv === '1'} />;
}
