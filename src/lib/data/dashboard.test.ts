import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/db', () => ({ db: {} }));

const { summarizeTasks } = await import('./dashboard');

const today = new Date('2026-10-18T00:00:00.000Z');
const day = (value: string) => new Date(`${value}T00:00:00.000Z`);

const projects = [
  { id: 'p1', name: 'Alpha', color: '#6366f1' },
  { id: 'p2', name: 'Beta', color: '#0ea5e9' },
  { id: 'p3', name: 'Gamma', color: '#10b981' },
];

describe('summarizeTasks', () => {
  const summary = summarizeTasks(
    [
      { status: 'TODO', priority: 'HIGH', dueDate: day('2026-10-17'), projectId: 'p1' },
      { status: 'DONE', priority: 'HIGH', dueDate: day('2026-10-01'), projectId: 'p1' },
      { status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: null, projectId: 'p1' },
      { status: 'IN_PROGRESS', priority: 'LOW', dueDate: day('2026-10-18'), projectId: 'p2' },
      { status: 'TODO', priority: 'MEDIUM', dueDate: null, projectId: null },
    ],
    projects,
    today,
  );

  it('menghitung total, status, dan persentase selesai', () => {
    expect(summary.total).toBe(5);
    expect(summary.statusCounts).toEqual({ TODO: 2, IN_PROGRESS: 2, DONE: 1 });
    expect(summary.completionRate).toBe(20);
  });

  it('hanya menghitung terlambat untuk tugas belum selesai yang tenggatnya sebelum hari ini', () => {
    // DONE yang lewat tenggat dan tugas bertenggat hari ini tidak dihitung
    expect(summary.overdue).toBe(1);
  });

  it('menghitung prioritas hanya dari tugas yang belum selesai', () => {
    expect(summary.priorityRows).toEqual([
      { priority: 'LOW', count: 1 },
      { priority: 'MEDIUM', count: 2 },
      { priority: 'HIGH', count: 1 },
    ]);
  });

  it('mengurutkan proyek dari tugas terbanyak, melewati proyek kosong, dan menaruh "Tanpa proyek" di akhir', () => {
    expect(summary.projectRows).toEqual([
      { id: 'p1', name: 'Alpha', TODO: 1, IN_PROGRESS: 1, DONE: 1, total: 3 },
      { id: 'p2', name: 'Beta', TODO: 0, IN_PROGRESS: 1, DONE: 0, total: 1 },
      { id: 'none', name: 'Tanpa proyek', TODO: 1, IN_PROGRESS: 0, DONE: 0, total: 1 },
    ]);
  });

  it('mengembalikan daftar proyek untuk dipakai halaman', () => {
    expect(summary.projects).toBe(projects);
    expect(summary.projectCount).toBe(3);
  });

  it('aman untuk user tanpa tugas', () => {
    const empty = summarizeTasks([], [], today);
    expect(empty.total).toBe(0);
    expect(empty.completionRate).toBe(0);
    expect(empty.projectRows).toEqual([]);
  });
});
