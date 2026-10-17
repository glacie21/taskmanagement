import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/auth-forms';

export const metadata: Metadata = { title: 'Daftar' };

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Buat akun baru</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Mulai kelola proyek dan tugasmu.</p>
      </div>
      <RegisterForm />
    </>
  );
}
