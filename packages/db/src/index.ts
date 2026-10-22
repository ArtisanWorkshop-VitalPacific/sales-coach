import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export * from './schema';
export { schema };

/** A Drizzle client over Neon's HTTP driver. One per request is fine; it holds no pool. */
export function createDb(url: string = process.env.DATABASE_URL ?? '') {
  if (!url) throw new Error('DATABASE_URL is not set');
  return drizzle({ client: neon(url), schema });
}

export type Db = ReturnType<typeof createDb>;
