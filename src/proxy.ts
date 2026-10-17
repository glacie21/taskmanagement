import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, decrypt } from '@/lib/auth/session';

const protectedRoutes = ['/dashboard', '/projects', '/tasks'];
const authRoutes = ['/login', '/register'];

const matches = (path: string, routes: string[]) =>
  routes.some((route) => path === route || path.startsWith(`${route}/`));

// Pengecekan optimis berdasarkan cookie saja (tanpa query DB).
// Verifikasi sesungguhnya tetap dilakukan di Data Access Layer (src/lib/auth/dal.ts).
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session && matches(path, protectedRoutes)) {
    const url = new URL('/login', request.nextUrl);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  if (session && matches(path, authRoutes)) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
