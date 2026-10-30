import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import type { ActionResult } from '@/lib/validations';

export const SERVER_ERROR_MESSAGE = 'Terjadi kesalahan di server. Coba lagi beberapa saat lagi.';

/**
 * Jalankan isi server action. Error tak terduga (mis. database tidak bisa dihubungi) dicatat di log
 * server dan dikembalikan sebagai pesan ke form, bukan dilempar ke client sebagai crash.
 */
export async function runAction(fn: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await fn();
  } catch (error) {
    // redirect(), notFound(), dsb. bekerja dengan melempar error: teruskan ke Next.js
    unstable_rethrow(error);
    console.error(error);
    return { ok: false, error: SERVER_ERROR_MESSAGE };
  }
}
