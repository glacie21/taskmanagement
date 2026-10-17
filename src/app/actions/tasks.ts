'use server';

import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { TASK_STATUSES, projects, tasks } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';
import { fromDateInputValue } from '@/lib/utils';
import { taskSchema, type ActionResult, type TaskInput } from '@/lib/validations';

type ParsedTask =
  | { ok: true; values: Omit<typeof tasks.$inferInsert, 'userId'> }
  | { ok: false; result: ActionResult };

async function parseTask(userId: string, input: unknown): Promise<ParsedTask> {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, result: { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors } };
  }

  const data: TaskInput = parsed.data;

  // Pastikan proyek yang dipilih memang milik user ini
  if (data.projectId) {
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, data.projectId), eq(projects.userId, userId)))
      .limit(1);
    if (!project) {
      return { ok: false, result: { ok: false, fieldErrors: { projectId: ['Proyek tidak ditemukan'] } } };
    }
  }

  return {
    ok: true,
    values: {
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      dueDate: fromDateInputValue(data.dueDate),
      projectId: data.projectId || null,
    },
  };
}

export async function createTask(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = await parseTask(user.id, input);
  if (!parsed.ok) return parsed.result;

  await db.insert(tasks).values({ ...parsed.values, userId: user.id });

  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function updateTask(taskId: string, input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = await parseTask(user.id, input);
  if (!parsed.ok) return parsed.result;

  const updated = await db
    .update(tasks)
    .set(parsed.values)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
    .returning({ id: tasks.id });

  if (updated.length === 0) return { ok: false, error: 'Tugas tidak ditemukan' };

  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function updateTaskStatus(taskId: string, status: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = z.enum(TASK_STATUSES).safeParse(status);
  if (!parsed.success) return { ok: false, error: 'Status tidak valid' };

  const updated = await db
    .update(tasks)
    .set({ status: parsed.data })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
    .returning({ id: tasks.id });

  if (updated.length === 0) return { ok: false, error: 'Tugas tidak ditemukan' };

  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  const user = await requireUser();
  const deleted = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
    .returning({ id: tasks.id });

  if (deleted.length === 0) return { ok: false, error: 'Tugas tidak ditemukan' };

  revalidatePath('/', 'layout');
  return { ok: true };
}
