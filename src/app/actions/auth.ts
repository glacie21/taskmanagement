'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createSession, deleteSession } from '@/lib/auth/session';
import { safeRedirectPath } from '@/lib/utils';
import { loginSchema, signupSchema, type ActionResult } from '@/lib/validations';

export async function signup(input: unknown): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { name, email, password } = parsed.data;

  // Constraint UNIQUE di kolom email yang memutuskan, jadi dua pendaftaran bersamaan
  // dengan email yang sama tidak bisa sama-sama lolos (dan tidak melempar error).
  const [user] = await db
    .insert(users)
    .values({ name, email, password: await bcrypt.hash(password, 10) })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });

  if (!user) {
    return { ok: false, fieldErrors: { email: ['Email sudah terdaftar'] } };
  }

  await createSession(user.id);
  redirect('/dashboard');
}

export async function login(input: unknown, redirectTo?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { ok: false, error: 'Email atau password salah' };
  }

  await createSession(user.id);
  redirect(safeRedirectPath(redirectTo));
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
