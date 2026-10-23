'use client';

import { useEffect } from 'react';
import { useSettings } from '@/lib/store';

/** Applies the theme setting to <html>. Light unless the tech chose Dark or Match device. */
export function ThemeSync() {
  const [settings] = useSettings();
  useEffect(() => {
    const t = settings.theme === 'dark' || settings.theme === 'device' ? settings.theme : 'light';
    document.documentElement.setAttribute('data-theme', t);
  }, [settings.theme]);
  return null;
}
