import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/db', () => ({ db: {} }));

const { parseTaskFilters } = await import('./tasks');

describe('parseTaskFilters', () => {
  it('mengambil filter yang valid', () => {
    expect(parseTaskFilters({ status: 'DONE', priority: 'HIGH', project: 'p1', q: '  laporan ' })).toEqual({
      status: 'DONE',
      priority: 'HIGH',
      projectId: 'p1',
      q: 'laporan',
    });
  });

  it('mengabaikan nilai yang tidak dikenal, kosong, atau berupa array', () => {
    expect(parseTaskFilters({ status: 'done', priority: ['HIGH', 'LOW'], project: '', q: '   ' })).toEqual({
      status: undefined,
      priority: undefined,
      projectId: undefined,
      q: undefined,
    });
  });
});
