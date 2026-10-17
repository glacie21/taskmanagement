'use client';

import { useOptimistic, useState, useTransition } from 'react';
import Link from 'next/link';
import { CalendarClock, Circle, CircleCheck, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteTask, updateTaskStatus } from '@/app/actions/tasks';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Select } from '@/components/ui/form';
import { STATUS_LABELS } from '@/lib/constants';
import { TASK_STATUSES, type TaskStatus } from '@/lib/db/schema';
import type { ProjectOption } from '@/lib/data/projects';
import type { TaskWithProject } from '@/lib/data/tasks';
import { cn, formatDate, startOfTodayUTC } from '@/lib/utils';
import { TaskFormDialog } from './task-form-dialog';

export function TaskList({
  tasks,
  projects,
  showProject = true,
}: {
  tasks: TaskWithProject[];
  projects: ProjectOption[];
  showProject?: boolean;
}) {
  const [editing, setEditing] = useState<TaskWithProject | null>(null);
  const [deleting, setDeleting] = useState<TaskWithProject | null>(null);
  const [deletePending, startDelete] = useTransition();

  const onDelete = () => {
    if (!deleting) return;
    startDelete(async () => {
      const result = await deleteTask(deleting.id);
      if (result.ok) {
        toast.success('Tugas dihapus');
        setDeleting(null);
      } else {
        toast.error(result.error ?? 'Gagal menghapus tugas');
      }
    });
  };

  return (
    <>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            showProject={showProject}
            onEdit={() => setEditing(task)}
            onDelete={() => setDeleting(task)}
          />
        ))}
      </ul>

      <TaskFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        task={editing ?? undefined}
        projects={projects}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={onDelete}
        pending={deletePending}
        title="Hapus tugas?"
        description={deleting ? `Tugas "${deleting.title}" akan dihapus permanen.` : ''}
      />
    </>
  );
}

function TaskRow({
  task,
  showProject,
  onEdit,
  onDelete,
}: {
  task: TaskWithProject;
  showProject: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // Status langsung berubah di UI, lalu disinkronkan dengan server
  const [status, setOptimisticStatus] = useOptimistic(task.status);
  const [, startTransition] = useTransition();

  const changeStatus = (next: TaskStatus) =>
    startTransition(async () => {
      setOptimisticStatus(next);
      const result = await updateTaskStatus(task.id, next);
      if (!result.ok) toast.error(result.error ?? 'Gagal mengubah status');
    });

  const done = status === 'DONE';
  const overdue = !done && task.dueDate && task.dueDate < startOfTodayUTC();

  return (
    <li className="group flex flex-wrap items-start gap-x-3 gap-y-2 px-5 py-3.5">
      <button
        type="button"
        onClick={() => changeStatus(done ? 'TODO' : 'DONE')}
        aria-label={done ? `Tandai "${task.title}" belum selesai` : `Tandai "${task.title}" selesai`}
        className={cn(
          'mt-0.5 shrink-0 rounded-full transition-colors',
          done
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-300 hover:text-emerald-600 dark:text-zinc-600 dark:hover:text-emerald-400',
        )}
      >
        {done ? <CircleCheck className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium break-words text-zinc-900 dark:text-zinc-100',
            done && 'text-zinc-400 line-through dark:text-zinc-500',
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs',
                overdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400',
              )}
            >
              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
              {overdue && 'Terlambat · '}
              {formatDate(task.dueDate)}
            </span>
          )}
          {showProject && task.project && (
            <Link
              href={`/projects/${task.project.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: task.project.color }} aria-hidden />
              {task.project.name}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile: aksi pindah ke baris sendiri di bawah judul */}
      <div className="flex w-full items-center gap-1 pl-8 sm:w-auto sm:pl-0">
        <Select
          value={status}
          onChange={(e) => changeStatus(e.target.value as TaskStatus)}
          aria-label={`Status "${task.title}"`}
          className="h-8 w-32 text-xs"
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit "${task.title}"`}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={`Hapus "${task.title}"`}
          className="hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
