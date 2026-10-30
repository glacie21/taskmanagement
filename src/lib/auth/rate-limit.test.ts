import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rateLimit, resetRateLimit } from './rate-limit';

const MINUTE = 60 * 1000;

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    resetRateLimit('test');
    resetRateLimit('lain');
    vi.useRealTimers();
  });

  it('mengizinkan sampai batas, lalu menolak dengan sisa waktu tunggu', () => {
    for (let i = 0; i < 3; i++) expect(rateLimit('test', 3, 15 * MINUTE)).toEqual({ ok: true });

    vi.advanceTimersByTime(5 * MINUTE);
    expect(rateLimit('test', 3, 15 * MINUTE)).toEqual({ ok: false, retryAfterMs: 10 * MINUTE });
  });

  it('membuka kembali setelah jendela waktu habis', () => {
    for (let i = 0; i < 4; i++) rateLimit('test', 3, 15 * MINUTE);

    vi.advanceTimersByTime(15 * MINUTE);
    expect(rateLimit('test', 3, 15 * MINUTE)).toEqual({ ok: true });
  });

  it('menghitung tiap key secara terpisah', () => {
    for (let i = 0; i < 4; i++) rateLimit('test', 3, 15 * MINUTE);
    expect(rateLimit('lain', 3, 15 * MINUTE)).toEqual({ ok: true });
  });

  it('resetRateLimit menghapus hitungan', () => {
    for (let i = 0; i < 4; i++) rateLimit('test', 3, 15 * MINUTE);
    resetRateLimit('test');
    expect(rateLimit('test', 3, 15 * MINUTE)).toEqual({ ok: true });
  });
});
