'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, deleteSession } from '@/lib/auth/session';
import { rateLimit, resetRateLimit, type RateLimitResult } from '@/lib/auth/rate-limit';
import { runAction } from '@/lib/safe-action';
import { safeRedirectPath } from '@/lib/utils';
import { loginSchema, signupSchema, type ActionResult } from '@/lib/validations';

const BCRYPT_ROUNDS = 10;
const MINUTE = 60 * 1000;

async function getClientIp() {
  const h = await headers();
  // Diisi reverse proxy / hosting. Tanpa proxy, header ini bisa dipalsukan klien,
  // karena itu login juga dibatasi per email (lihat login di bawah).
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

function tooManyAttempts(...results: RateLimitResult[]): ActionResult | null {
  const retryAfterMs = Math.max(0, ...results.map((r) => (r.ok ? 0 : r.retryAfterMs)));
  if (!retryAfterMs) return null;
  const minutes = Math.ceil(retryAfterMs / MINUTE);
  return { ok: false, error: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.` };
}

// Hash acak untuk dibandingkan saat email tidak terdaftar, supaya waktu respons sama dengan
// email yang terdaftar dan tidak bisa dipakai untuk menebak email mana yang ada.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hash(crypto.randomUUID(), BCRYPT_ROUNDS));

export async function signup(input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = signupSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
    }

    const limited = tooManyAttempts(rateLimit(`signup:${await getClientIp()}`, 10, 60 * MINUTE));
    if (limited) return limited;

    const { name, email, password } = parsed.data;

    // Constraint UNIQUE di kolom email yang memutuskan, jadi dua pendaftaran bersamaan
    // dengan email yang sama tidak bisa sama-sama lolos (dan tidak melempar error).
    const [user] = await db
      .insert(users)
      .values({ name, email, password: await bcrypt.hash(password, BCRYPT_ROUNDS) })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id });

    if (!user) {
      return { ok: false, fieldErrors: { email: ['Email sudah terdaftar'] } };
    }

    await createSession(user.id);
    redirect('/dashboard');
  });
}

export async function login(input: unknown, redirectTo?: string): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
    }

    const { email, password } = parsed.data;

    // Per IP + email: membatasi tebakan password dari satu sumber.
    // Per email saja: batas atas jika IP dipalsukan / berganti-ganti.
    const ipKey = `login:${await getClientIp()}:${email}`;
    const emailKey = `login:${email}`;
    const limited = tooManyAttempts(rateLimit(ipKey, 5, 15 * MINUTE), rateLimit(emailKey, 20, 15 * MINUTE));
    if (limited) return limited;

    const [user] = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const valid = await bcrypt.compare(password, user?.password ?? (await getDummyHash()));
    if (!user || !valid) {
      return { ok: false, error: 'Email atau password salah' };
    }

    resetRateLimit(ipKey);
    resetRateLimit(emailKey);
    await createSession(user.id);
    redirect(safeRedirectPath(redirectTo));
  });
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
