import 'server-only';
import { and, asc, desc, eq, ilike, ne, sql, type SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  projects,
  tasks,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/db/schema';

export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  q?: string;
};

/** Ambil filter yang valid dari searchParams halaman */
export function parseTaskFilters(params: Record<string, string | string[] | undefined>): TaskFilters {
  const pick = (key: string) => (typeof params[key] === 'string' ? params[key] : undefined);
  const status = pick('status');
  const priority = pick('priority');
  return {
    status: TASK_STATUSES.find((s) => s === status),
    priority: TASK_PRIORITIES.find((p) => p === priority),
    projectId: pick('project') || undefined,
    q: pick('q')?.trim() || undefined,
  };
}

export async function getTasks(userId: string, filters: TaskFilters = {}) {
  const conditions: SQL[] = [eq(tasks.userId, userId)];
  if (filters.status) conditions.push(eq(tasks.status, filters.status));
  if (filters.priority) conditions.push(eq(tasks.priority, filters.priority));
  if (filters.projectId) conditions.push(eq(tasks.projectId, filters.projectId));
  if (filters.q) {
    // Escape karakter wildcard LIKE dari input user
    const escaped = filters.q.replace(/[\\%_]/g, (c) => `\\${c}`);
    conditions.push(ilike(tasks.title, `%${escaped}%`));
  }

  return selectTasks(conditions);
}

/** Tugas belum selesai dengan tenggat terdekat (untuk dashboard) */
export async function getUpcomingTasks(userId: string, limit = 5) {
  return selectTasks([eq(tasks.userId, userId), ne(tasks.status, 'DONE')]).limit(limit);
}

function selectTasks(conditions: SQL[]) {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      projectId: tasks.projectId,
      createdAt: tasks.createdAt,
      project: { id: projects.id, name: projects.name, color: projects.color },
    })
    .from(tasks)
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(...conditions))
    .orderBy(
      // Tugas yang belum selesai di atas, lalu urut tenggat terdekat
      sql`case when ${tasks.status} = 'DONE' then 1 else 0 end`,
      sql`${tasks.dueDate} asc nulls last`,
      sql`case ${tasks.priority} when 'HIGH' then 0 when 'MEDIUM' then 1 else 2 end`,
      desc(tasks.createdAt),
    );
}

export type TaskWithProject = Awaited<ReturnType<typeof getTasks>>[number];

/** Data mentah untuk statistik dashboard */
export async function getTaskStatsRows(userId: string) {
  return db
    .select({
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      projectId: tasks.projectId,
    })
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(asc(tasks.createdAt));
}
