import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/auth-forms';

export const metadata: Metadata = { title: 'Masuk' };

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { from } = await searchParams;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Selamat datang kembali</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Masuk untuk melanjutkan pekerjaanmu.</p>
      </div>
      <LoginForm redirectTo={typeof from === 'string' ? from : undefined} />
    </>
  );
}
