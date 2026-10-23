import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sales Coach',
    short_name: 'Sales Coach',
    description: 'Practice the call before the call.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFCFC',
    theme_color: '#FDFCFC',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
