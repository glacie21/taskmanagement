'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProject } from '@/app/actions/projects';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ProjectFormDialog, type EditableProject } from './project-form-dialog';

export function NewProjectButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Proyek baru
      </Button>
      <ProjectFormDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Tombol edit & hapus untuk satu proyek */
export function ProjectActions({
  project,
  redirectAfterDelete,
}: {
  project: EditableProject;
  redirectAfterDelete?: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const onDelete = () =>
    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (result.ok) {
        toast.success('Proyek dihapus');
        setConfirming(false);
        if (redirectAfterDelete) router.push(redirectAfterDelete);
      } else {
        toast.error(result.error ?? 'Gagal menghapus proyek');
      }
    });

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => setEditing(true)} aria-label={`Edit ${project.name}`}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setConfirming(true)}
        aria-label={`Hapus ${project.name}`}
        className="hover:text-red-600 dark:hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ProjectFormDialog open={editing} onClose={() => setEditing(false)} project={project} />
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={onDelete}
        pending={pending}
        title="Hapus proyek?"
        description={`Proyek "${project.name}" beserta semua tugas di dalamnya akan dihapus permanen.`}
      />
    </div>
  );
}
