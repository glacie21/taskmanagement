import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';

// Baca .env, .env.local, dst. dengan aturan yang sama seperti Next.js
loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL;

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  // Tanpa DATABASE_URL, drizzle-kit memakai database PGlite lokal yang sama dengan aplikasi
  ...(url ? { dbCredentials: { url } } : { driver: 'pglite', dbCredentials: { url: './.pglite' } }),
});
