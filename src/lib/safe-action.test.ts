import { describe, expect, it, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { SERVER_ERROR_MESSAGE, runAction } from './safe-action';

describe('runAction', () => {
  it('meneruskan hasil action apa adanya', async () => {
    await expect(runAction(async () => ({ ok: false, error: 'x' }))).resolves.toEqual({ ok: false, error: 'x' });
  });

  it('mengubah error tak terduga menjadi pesan umum', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await runAction(async () => {
      throw new Error('connection refused');
    });
    expect(result).toEqual({ ok: false, error: SERVER_ERROR_MESSAGE });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it('tidak menelan redirect()', async () => {
    await expect(runAction(async () => redirect('/dashboard'))).rejects.toMatchObject({
      digest: expect.stringContaining('NEXT_REDIRECT'),
    });
  });
});
