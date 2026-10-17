import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { SESSION_COOKIE, decrypt } from './session';

// Data Access Layer: satu-satunya tempat pengecekan sesi yang "sebenarnya".
// Proxy hanya melakukan pengecekan optimis; halaman & server action wajib memanggil ini.

export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decrypt(token);
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return user ?? null;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Mengembalikan user yang login, atau redirect ke /login. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    // Sesi valid tapi user sudah dihapus → bersihkan cookie dulu agar tidak loop dengan proxy
    redirect((await getSession()) ? '/api/auth/signout' : '/login');
  }
  return user;
}
