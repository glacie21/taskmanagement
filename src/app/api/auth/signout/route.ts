import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session';

// Dipakai saat cookie sesi masih valid tetapi user-nya sudah tidak ada di database.
// Server Component tidak bisa menghapus cookie, jadi diarahkan ke sini dulu.
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.nextUrl));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
