'use client';

import './globals.css';

// Menggantikan root layout jika root layout itu sendiri gagal. Providers (tema) tidak ikut,
// jadi tampilan dibuat netral tanpa varian dark.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center font-sans">
        <title>Terjadi kesalahan · TaskFlow</title>
        <h1 className="text-lg font-semibold">Terjadi kesalahan</h1>
        <p className="text-sm text-zinc-500">
          Aplikasi gagal dimuat{error.digest ? ` (kode: ${error.digest})` : ''}.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
        >
          Coba lagi
        </button>
      </body>
    </html>
  );
}
