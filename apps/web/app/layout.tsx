import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeSync } from '@/components/theme';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Sales Coach', template: '%s · Sales Coach' },
  description: 'Practice the call before the call. Real conversations with customers who push back, then a coach who tells you exactly what to fix.',
  applicationName: 'Sales Coach',
  appleWebApp: { capable: true, title: 'Sales Coach', statusBarStyle: 'default' },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
