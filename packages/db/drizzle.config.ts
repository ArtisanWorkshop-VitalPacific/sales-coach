import { defineConfig } from 'drizzle-kit';

// `generate` works offline. `migrate` needs DATABASE_URL (the Neon connection string).
const url = process.env.DATABASE_URL;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  ...(url ? { dbCredentials: { url } } : {}),
  strict: true,
  verbose: true,
});
