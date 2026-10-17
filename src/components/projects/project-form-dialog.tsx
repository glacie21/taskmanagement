'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { createProject, updateProject } from '@/app/actions/projects';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Label, Textarea } from '@/components/ui/form';
import { FormAlert, applyServerErrors } from '@/components/ui/form-feedback';
import { PROJECT_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { projectSchema, type ProjectInput } from '@/lib/validations';

export type EditableProject = {
  id: string;
  name: string;
  description: string | null;
  color: string;
};

export function ProjectFormDialog({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project?: EditableProject;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={project ? 'Edit proyek' : 'Proyek baru'}
      description={project ? undefined : 'Kelompokkan tugas berdasarkan proyek.'}
    >
      {/* key: form di-reset setiap kali dialog dibuka untuk proyek yang berbeda */}
      <ProjectForm key={project?.id ?? 'new'} project={project} onDone={onClose} />
    </Dialog>
  );
}

function ProjectForm({ project, onDone }: { project?: EditableProject; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
      color: project?.color ?? PROJECT_COLORS[0],
    },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      const result = project ? await updateProject(project.id, values) : await createProject(values);
      if (result.ok) {
        toast.success(project ? 'Proyek diperbarui' : 'Proyek dibuat');
        onDone();
      } else {
        setFormError(applyServerErrors(result, setError));
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={formError} />
      <Field label="Nama proyek" htmlFor="project-name" error={errors.name?.message}>
        <Input id="project-name" autoFocus aria-invalid={!!errors.name} {...register('name')} />
      </Field>
      <Field label="Deskripsi" htmlFor="project-description" error={errors.description?.message}>
        <Textarea
          id="project-description"
          rows={3}
          placeholder="Opsional"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
      </Field>
      <div className="flex flex-col gap-1.5">
        <Label id="project-color-label">Warna</Label>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div role="radiogroup" aria-labelledby="project-color-label" className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((color) => {
                const selected = field.value.toLowerCase() === color;
                return (
                  <button
                    key={color}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={color}
                    onClick={() => field.onChange(color)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-white transition-transform hover:scale-110 dark:ring-offset-zinc-900',
                      selected && 'ring-2 ring-zinc-900 dark:ring-zinc-100',
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {selected && <Check className="h-4 w-4 text-white" />}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone} disabled={pending}>
          Batal
        </Button>
        <Button type="submit" loading={pending}>
          {project ? 'Simpan' : 'Buat proyek'}
        </Button>
      </div>
    </form>
  );
}
