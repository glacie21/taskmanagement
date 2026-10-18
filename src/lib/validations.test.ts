import { describe, expect, it } from 'vitest';
import { loginSchema, signupSchema, taskSchema } from './validations';

const validSignup = {
  name: 'Budi Santoso',
  email: 'Budi@Mail.COM',
  password: 'rahasia123',
  confirmPassword: 'rahasia123',
};

describe('signupSchema', () => {
  it('menerima data valid dan menormalkan email ke huruf kecil', () => {
    const result = signupSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe('budi@mail.com');
  });

  it.each([
    ['tanpa angka', 'rahasiasekali'],
    ['tanpa huruf', '12345678'],
    ['terlalu pendek', 'abc123'],
  ])('menolak password %s', (_, password) => {
    const result = signupSchema.safeParse({ ...validSignup, password, confirmPassword: password });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['password']);
  });

  it('menolak konfirmasi password yang berbeda', () => {
    const result = signupSchema.safeParse({ ...validSignup, confirmPassword: 'lainlagi123' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
  });
});

describe('loginSchema', () => {
  it('mewajibkan password', () => {
    expect(loginSchema.safeParse({ email: 'budi@mail.com', password: '' }).success).toBe(false);
  });
});

describe('taskSchema', () => {
  const validTask = {
    title: 'Tulis laporan',
    description: '',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '',
    projectId: '',
  };

  it('menerima tugas tanpa tenggat dan tanpa proyek', () => {
    expect(taskSchema.safeParse(validTask).success).toBe(true);
  });

  it('menerima tenggat format YYYY-MM-DD', () => {
    expect(taskSchema.safeParse({ ...validTask, dueDate: '2026-10-18' }).success).toBe(true);
  });

  it.each([
    ['tenggat format lain', { dueDate: '18-10-2026' }],
    ['status tidak dikenal', { status: 'ARCHIVED' }],
    ['prioritas tidak dikenal', { priority: 'URGENT' }],
    ['judul kosong setelah trim', { title: '   ' }],
  ])('menolak %s', (_, override) => {
    expect(taskSchema.safeParse({ ...validTask, ...override }).success).toBe(false);
  });
});
