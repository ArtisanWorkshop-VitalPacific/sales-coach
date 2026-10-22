import { type ContentBundle, ContentIndex } from '@sales-coach/engine';
import raw from '../generated/bundle.json';

/** The validated content library, built by `pnpm content:build`. */
export const bundle = raw as unknown as ContentBundle;
export const CONTENT_VERSION = bundle.version;

let cached: ContentIndex | null = null;

/** Shared lookup index over the bundle. */
export function contentIndex(): ContentIndex {
  if (!cached) cached = new ContentIndex(bundle);
  return cached;
}
