import type { TaskPriority, TaskStatus } from '@/lib/db/schema';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'Dikerjakan',
  DONE: 'Selesai',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi',
};

// Warna isi grafik per status (lihat --chart-status-* di globals.css)
export const STATUS_CHART_VARS: Record<TaskStatus, string> = {
  TODO: 'var(--chart-status-todo)',
  IN_PROGRESS: 'var(--chart-status-progress)',
  DONE: 'var(--chart-status-done)',
};

export const PROJECT_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#64748b',
];
