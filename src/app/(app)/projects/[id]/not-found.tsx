import Link from 'next/link';
import { FolderKanban } from 'lucide-react';
import { Card, EmptyState } from '@/components/ui/card';
import { buttonClasses } from '@/components/ui/button';

export default function ProjectNotFound() {
  return (
    <Card>
      <EmptyState
        icon={<FolderKanban className="h-5 w-5" />}
        title="Proyek tidak ditemukan"
        description="Proyek ini mungkin sudah dihapus atau bukan milikmu."
        action={
          <Link href="/projects" className={buttonClasses('secondary', 'sm')}>
            Kembali ke daftar proyek
          </Link>
        }
      />
    </Card>
  );
}
