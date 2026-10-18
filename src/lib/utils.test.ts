import { describe, expect, it } from 'vitest';
import { formatDate, fromDateInputValue, safeRedirectPath, toDateInputValue } from './utils';

describe('tanggal input', () => {
  it('menyimpan tanggal sebagai tengah malam UTC', () => {
    expect(fromDateInputValue('2026-10-18')?.toISOString()).toBe('2026-10-18T00:00:00.000Z');
  });

  it('bolak-balik tanpa tanggal bergeser', () => {
    expect(toDateInputValue(fromDateInputValue('2026-01-31'))).toBe('2026-01-31');
  });

  it('nilai kosong berarti tanpa tenggat', () => {
    expect(fromDateInputValue('')).toBeNull();
    expect(fromDateInputValue(undefined)).toBeNull();
    expect(toDateInputValue(null)).toBe('');
  });

  it('format tanggal memakai UTC dan locale Indonesia', () => {
    expect(formatDate(new Date('2026-10-18T00:00:00.000Z'))).toBe('18 Okt 2026');
  });
});

describe('safeRedirectPath', () => {
  it('mengizinkan path internal', () => {
    expect(safeRedirectPath('/projects/abc?status=DONE')).toBe('/projects/abc?status=DONE');
  });

  it.each(['//evil.com', '/\\evil.com', 'https://evil.com', 'projects', ''])('menolak %j', (path) => {
    expect(safeRedirectPath(path)).toBe('/dashboard');
  });

  it('memakai fallback jika kosong', () => {
    expect(safeRedirectPath(undefined)).toBe('/dashboard');
    expect(safeRedirectPath(undefined, '/tasks')).toBe('/tasks');
  });
});
