'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BillingTab, SetupTab } from '@/components/portal-account';
import { CompanyTab, LibraryTab } from '@/components/portal-company';
import { Segmented, Skeleton } from '@/components/ui';

const TABS = [
  { value: 'company', label: 'Company' },
  { value: 'library', label: 'Library' },
  { value: 'billing', label: 'Billing' },
  { value: 'setup', label: 'Setup' },
] as const;

type Tab = (typeof TABS)[number]['value'];
const isTab = (v: string | null): v is Tab => TABS.some((t) => t.value === v);

export default function PortalPage() {
  return (
    <div>
      <header className="reveal mb-8 md:mb-10">
        <p className="t-callout font-semibold text-ink-3">Company portal</p>
        <h1 className="t-hero mt-2 text-ink">Your shop. Your way.</h1>
        <p className="t-body-lg mt-4 max-w-xl text-ink-3">
          Your process. Your prices. Your words. Every practice call runs on them.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-80 max-w-full rounded-pill" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <PortalTabs />
      </Suspense>
    </div>
  );
}

function PortalTabs() {
  const params = useSearchParams();
  const router = useRouter();
  const raw = params.get('tab');
  const tab: Tab = isTab(raw) ? raw : 'company';
  const checkout = params.get('checkout');

  return (
    <>
      <div className="no-scrollbar -mx-5 mb-8 overflow-x-auto px-5 md:mb-10">
        <Segmented
          options={TABS.map((t) => ({ value: t.value, label: t.label }))}
          value={tab}
          onChange={(v) => router.replace(`/portal?tab=${v}`, { scroll: false })}
        />
      </div>
      <div key={tab} className="fade">
        {tab === 'company' && <CompanyTab />}
        {tab === 'library' && <LibraryTab />}
        {tab === 'billing' && <BillingTab checkout={checkout} />}
        {tab === 'setup' && <SetupTab />}
      </div>
    </>
  );
}
