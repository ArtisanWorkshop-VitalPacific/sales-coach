import { UnlockForm } from './form';

export const metadata = { title: 'Unlock' };

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safe = next?.startsWith('/') && !next.startsWith('//') ? next : '/';
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-6">
      <UnlockForm next={safe} />
    </div>
  );
}
