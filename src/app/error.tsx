'use client';

import { ErrorState } from '@/components/error-state';

// Menangkap error di halaman publik/auth dan di layout (app) (mis. database mati saat cek user)
export default function RootError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <ErrorState {...props} />
    </main>
  );
}
