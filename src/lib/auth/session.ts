import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export type SessionPayload = {
  userId: string;
  expiresAt: string;
};

// Nilai contoh yang dulu ada di .env.example / README. Siapa pun bisa membacanya,
// jadi jangan sampai terpakai walaupun panjangnya lolos.
const PLACEHOLDER_SECRETS = [
  'your_super_secret_jwt_key_change_me_in_production',
  'super_secret_jwt_key_silakan_ganti_dengan_string_acak',
];

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || PLACEHOLDER_SECRETS.includes(secret)) {
    throw new Error(
      'JWT_SECRET belum diatur, kurang dari 32 karakter, atau masih nilai contoh. ' +
        'Buat dengan `openssl rand -base64 32`, lihat .env.example.',
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(payload.expiresAt))
    .sign(getKey());
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  // Di luar try: konfigurasi yang salah harus gagal dengan jelas, bukan dianggap "belum login"
  const key = getKey();
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encrypt({ userId, expiresAt: expiresAt.toISOString() });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
