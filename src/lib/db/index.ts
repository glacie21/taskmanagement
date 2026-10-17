import 'server-only';
import { Pool } from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

export const PGLITE_DATA_DIR = './.pglite';

function createDb(): Database {
  const url = process.env.DATABASE_URL;

  if (url) {
    return drizzlePg(new Pool({ connectionString: url }), { schema });
  }

  // Tanpa DATABASE_URL: pakai PGlite (Postgres embedded, disimpan di ./.pglite)
  // API query-nya sama dengan node-postgres, jadi cukup di-cast ke tipe yang sama.
  return drizzlePglite(new PGlite(PGLITE_DATA_DIR), { schema }) as unknown as Database;
}

// Simpan instance di globalThis agar hot reload saat dev tidak membuat koneksi baru terus-menerus
const globalForDb = globalThis as unknown as { db?: Database };

function getDb() {
  return (globalForDb.db ??= createDb());
}

// Koneksi dibuat saat query pertama, bukan saat modul di-import. Penting untuk PGlite:
// `next build` meng-import modul di banyak worker sekaligus, dan PGlite tidak boleh
// dibuka oleh beberapa proses pada folder yang sama.
export const db = new Proxy({} as Database, {
  get(_, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
