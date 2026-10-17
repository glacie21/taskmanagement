'use server';

import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';
import { projectSchema, type ActionResult } from '@/lib/validations';

export async function createProject(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { name, description, color } = parsed.data;
  await db.insert(projects).values({ name, description: description || null, color, userId: user.id });

  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function updateProject(projectId: string, input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { name, description, color } = parsed.data;
  const updated = await db
    .update(projects)
    .set({ name, description: description || null, color })
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
    .returning({ id: projects.id });

  if (updated.length === 0) return { ok: false, error: 'Proyek tidak ditemukan' };

  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Menghapus proyek beserta seluruh tugas di dalamnya (ON DELETE CASCADE) */
export async function deleteProject(projectId: string): Promise<ActionResult> {
  const user = await requireUser();
  const deleted = await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
    .returning({ id: projects.id });

  if (deleted.length === 0) return { ok: false, error: 'Proyek tidak ditemukan' };

  revalidatePath('/', 'layout');
  return { ok: true };
}
