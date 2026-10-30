import 'server-only';

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = { ok: true } | { ok: false; retryAfterMs: number };

// Disimpan di memori proses: cukup untuk satu instance server (termasuk PGlite).
// Kalau aplikasi dijalankan di beberapa instance / serverless, pindahkan ke penyimpanan
// bersama (Redis atau tabel di database) agar batasnya berlaku di semua instance.
const globalForRateLimit = globalThis as unknown as { rateLimitBuckets?: Map<string, Bucket> };
const buckets = (globalForRateLimit.rateLimitBuckets ??= new Map<string, Bucket>());

const MAX_BUCKETS = 10_000;

/** Catat satu percobaan untuk `key`. Ditolak jika sudah lebih dari `limit` kali dalam jendela waktu. */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) pruneExpired(now);
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count++;
  return bucket.count > limit ? { ok: false, retryAfterMs: bucket.resetAt - now } : { ok: true };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
