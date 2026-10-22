import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sales-coach/engine', '@sales-coach/content', '@sales-coach/design'],
  outputFileTracingRoot: root,
  turbopack: { root },
  serverExternalPackages: ['@anthropic-ai/sdk', 'stripe'],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'microphone=(self), camera=()' },
        ],
      },
    ];
  },
};

export default config;
