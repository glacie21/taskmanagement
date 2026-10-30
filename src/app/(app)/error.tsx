'use client';

import { ErrorState } from '@/components/error-state';

// Menangkap error di halaman dalam app; sidebar & header dari layout tetap tampil
export default function AppError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState {...props} />;
}
