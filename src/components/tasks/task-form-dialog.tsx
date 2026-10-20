'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createTask, updateTask } from '@/app/actions/tasks';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Select, Textarea } from '@/components/ui/form';
import { FormAlert, applyServerErrors } from '@/components/ui/form-feedback';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/constants';
import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from '@/lib/db/schema';
import type { ProjectOption } from '@/lib/data/projects';
import { toDateInputValue } from '@/lib/utils';
import { taskSchema, type TaskInput } from '@/lib/validations';

export type EditableTask = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string | null;
};

export function TaskFormDialog({
  open,
  onClose,
  task,
  projects,
  defaultProjectId,
}: {
  open: boolean;
  onClose: () => void;
  task?: EditableTask;
  projects: ProjectOption[];
  defaultProjectId?: string;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={task ? 'Edit tugas' : 'Tugas baru'}>
      <TaskForm
        key={task?.id ?? 'new'}
        task={task}
        projects={projects}
        defaultProjectId={defaultProjectId}
        onDone={onClose}
      />
    </Dialog>
  );
}

function TaskForm({
  task,
  projects,
  defaultProjectId,
  onDone,
}: {
  task?: EditableTask;
  projects: ProjectOption[];
  defaultProjectId?: string;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'TODO',
      priority: task?.priority ?? 'MEDIUM',
      dueDate: toDateInputValue(task?.dueDate),
      projectId: task ? (task.projectId ?? '') : (defaultProjectId ?? ''),
    },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      const result = task ? await updateTask(task.id, values) : await createTask(values);
      if (result.ok) {
        toast.success(task ? 'Tugas diperbarui' : 'Tugas dibuat');
        onDone();
      } else {
        setFormError(applyServerErrors(result, setError));
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={formError} />
      <Field label="Judul" htmlFor="task-title" error={errors.title?.message}>
        <Input
          id="task-title"
          autoFocus
          placeholder="Apa yang perlu dikerjakan?"
          aria-invalid={!!errors.title}
          {...register('title')}
        />
      </Field>
      <Field label="Deskripsi" htmlFor="task-description" error={errors.description?.message}>
        <Textarea
          id="task-description"
          rows={3}
          placeholder="Opsional"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="task-status" error={errors.status?.message}>
          <Select id="task-status" {...register('status')}>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Prioritas" htmlFor="task-priority" error={errors.priority?.message}>
          <Select id="task-priority" {...register('priority')}>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tenggat" htmlFor="task-due" error={errors.dueDate?.message}>
          <Input id="task-due" type="date" aria-invalid={!!errors.dueDate} {...register('dueDate')} />
        </Field>
        <Field label="Proyek" htmlFor="task-project" error={errors.projectId?.message}>
          <Select id="task-project" aria-invalid={!!errors.projectId} {...register('projectId')}>
            <option value="">Tanpa proyek</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone} disabled={pending}>
          Batal
        </Button>
        <Button type="submit" loading={pending}>
          {task ? 'Simpan' : 'Buat tugas'}
        </Button>
      </div>
    </form>
  );
}
