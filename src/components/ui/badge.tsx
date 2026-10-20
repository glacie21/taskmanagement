import { Circle, CircleCheck, CircleDot } from 'lucide-react';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/constants';
import type { TaskPriority, TaskStatus } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset';

const statusStyles: Record<TaskStatus, string> = {
  TODO: 'bg-zinc-50 text-zinc-700 ring-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-300 dark:ring-zinc-700',
  IN_PROGRESS:
    'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30',
  DONE: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
};

const statusIcons: Record<TaskStatus, typeof Circle> = {
  TODO: Circle,
  IN_PROGRESS: CircleDot,
  DONE: CircleCheck,
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const Icon = statusIcons[status];
  return (
    <span className={cn(base, statusStyles[status])}>
      <Icon className="h-3 w-3" aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'bg-zinc-50 text-zinc-600 ring-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:ring-zinc-700',
  MEDIUM:
    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  HIGH: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={cn(base, priorityStyles[priority])}>{PRIORITY_LABELS[priority]}</span>;
}
