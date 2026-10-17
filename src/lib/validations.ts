import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/db/schema';

// Schema dipakai bersama oleh form (React Hook Form) dan server action,
// sengaja tanpa transform agar tipe input dan output-nya sama.

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
    email: z.email('Email tidak valid').trim().toLowerCase(),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .max(72, 'Password maksimal 72 karakter')
      .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
      .regex(/[0-9]/, 'Password harus mengandung angka'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak cocok',
  });

export const loginSchema = z.object({
  email: z.email('Email tidak valid').trim().toLowerCase(),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const projectSchema = z.object({
  name: z.string().trim().min(1, 'Nama proyek wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  description: z.string().trim().max(500, 'Deskripsi maksimal 500 karakter'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Warna tidak valid'),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Judul tugas wajib diisi').max(200, 'Judul maksimal 200 karakter'),
  description: z.string().trim().max(2000, 'Deskripsi maksimal 2000 karakter'),
  status: z.enum(TASK_STATUSES, 'Status tidak valid'),
  priority: z.enum(TASK_PRIORITIES, 'Prioritas tidak valid'),
  // '' = tanpa tenggat, selain itu format YYYY-MM-DD dari input type="date"
  dueDate: z.union([z.literal(''), z.iso.date('Tanggal tidak valid')]),
  // '' = tanpa proyek
  projectId: z.string(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;

export type ActionResult =
  | { ok: true }
  | { ok: false; error?: string; fieldErrors?: Record<string, string[] | undefined> };
