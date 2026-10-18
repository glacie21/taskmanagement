import 'server-only';
import { cache } from 'react';
import { and, asc, count, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { projects, tasks } from '@/lib/db/schema';

export async function getProjectsWithStats(userId: string) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      color: projects.color,
      createdAt: projects.createdAt,
      totalTasks: count(tasks.id),
      doneTasks: sql<number>`count(*) filter (where ${tasks.status} = 'DONE')`.mapWith(Number),
    })
    .from(projects)
    .leftJoin(tasks, eq(tasks.projectId, projects.id))
    .where(eq(projects.userId, userId))
    .groupBy(projects.id)
    .orderBy(asc(projects.name));
}

export type ProjectWithStats = Awaited<ReturnType<typeof getProjectsWithStats>>[number];

/** Daftar proyek ringkas untuk dropdown */
export async function getProjectOptions(userId: string) {
  return db
    .select({ id: projects.id, name: projects.name, color: projects.color })
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(asc(projects.name));
}

export type ProjectOption = Awaited<ReturnType<typeof getProjectOptions>>[number];

// cache: generateMetadata dan halaman detail memanggil ini dengan argumen yang sama dalam satu request
export const getProject = cache(async (userId: string, projectId: string) => {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);
  return project ?? null;
});
