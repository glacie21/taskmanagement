'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, EmptyState } from '@/components/ui/card';

/** Tampilan bersama untuk file error.tsx */
export function ErrorState({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon={<TriangleAlert className="h-5 w-5" />}
        title="Terjadi kesalahan"
        description={
          // Di production pesan error dari server disembunyikan Next.js; digest dipakai untuk mencocokkan log server
          error.digest ? `Halaman gagal dimuat (kode: ${error.digest}).` : 'Halaman gagal dimuat.'
        }
        action={
          <Button variant="secondary" size="sm" onClick={() => retry()}>
            Coba lagi
          </Button>
        }
      />
    </Card>
  );
}
