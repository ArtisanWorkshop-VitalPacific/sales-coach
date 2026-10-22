'use client';

import { useEffect } from 'react';
import { useSettings } from '@/lib/store';

/** Applies the theme setting to <html>. System follows the device. */
export function ThemeSync() {
  const [settings] = useSettings();
  useEffect(() => {
    const el = document.documentElement;
    if (settings.theme === 'system') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);
  return null;
}
