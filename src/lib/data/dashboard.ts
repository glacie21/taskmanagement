import 'server-only';
import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from '@/lib/db/schema';
import { startOfTodayUTC } from '@/lib/utils';
import { getProjectOptions, type ProjectOption } from './projects';
import { getTaskStatsRows } from './tasks';

export type StatusCounts = Record<TaskStatus, number>;

export type ProjectStatusRow = StatusCounts & { id: string; name: string; total: number };

export type PriorityRow = { priority: TaskPriority; count: number };

type TaskStatsRow = Awaited<ReturnType<typeof getTaskStatsRows>>[number];

export async function getDashboardData(userId: string) {
  const [rows, projectOptions] = await Promise.all([getTaskStatsRows(userId), getProjectOptions(userId)]);
  return summarizeTasks(rows, projectOptions, startOfTodayUTC());
}

/** Hitung statistik dashboard dari data mentah (tanpa akses DB, mudah dites) */
export function summarizeTasks(rows: TaskStatsRow[], projectOptions: ProjectOption[], today: Date) {
  const emptyCounts = (): StatusCounts => ({ TODO: 0, IN_PROGRESS: 0, DONE: 0 });

  const statusCounts = emptyCounts();
  const priorityCounts = Object.fromEntries(TASK_PRIORITIES.map((p) => [p, 0])) as Record<TaskPriority, number>;
  const byProject = new Map<string | null, StatusCounts>();
  let overdue = 0;

  for (const row of rows) {
    statusCounts[row.status]++;
    if (row.status !== 'DONE') {
      priorityCounts[row.priority]++;
      if (row.dueDate && row.dueDate < today) overdue++;
    }
    const counts = byProject.get(row.projectId) ?? emptyCounts();
    counts[row.status]++;
    byProject.set(row.projectId, counts);
  }

  const toRow = (id: string, name: string, counts: StatusCounts): ProjectStatusRow => ({
    id,
    name,
    ...counts,
    total: TASK_STATUSES.reduce((sum, s) => sum + counts[s], 0),
  });

  const projectRows = projectOptions
    .map((p) => toRow(p.id, p.name, byProject.get(p.id) ?? emptyCounts()))
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);

  const unassigned = byProject.get(null);
  if (unassigned) projectRows.push(toRow('none', 'Tanpa proyek', unassigned));

  return {
    total: rows.length,
    statusCounts,
    overdue,
    completionRate: rows.length ? Math.round((statusCounts.DONE / rows.length) * 100) : 0,
    // Dikembalikan juga agar halaman tidak perlu query daftar proyek lagi
    projects: projectOptions,
    projectCount: projectOptions.length,
    projectRows,
    priorityRows: TASK_PRIORITIES.map((priority) => ({ priority, count: priorityCounts[priority] })),
  };
}
