'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProjectOption } from '@/lib/data/projects';
import { TaskFormDialog } from './task-form-dialog';

export function NewTaskButton({
  projects,
  defaultProjectId,
}: {
  projects: ProjectOption[];
  defaultProjectId?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Tugas baru
      </Button>
      <TaskFormDialog
        open={open}
        onClose={() => setOpen(false)}
        projects={projects}
        defaultProjectId={defaultProjectId}
      />
    </>
  );
}
