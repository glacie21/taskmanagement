import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { ActionResult } from '@/lib/validations';

/** Tampilkan error dari server action ke form. Mengembalikan pesan error umum (jika ada). */
export function applyServerErrors<T extends FieldValues>(
  result: ActionResult | undefined,
  setError: UseFormSetError<T>,
) {
  if (!result || result.ok) return null;
  for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
    if (messages?.[0]) setError(field as Path<T>, { message: messages[0] });
  }
  return result.error ?? null;
}

export function FormAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      {message}
    </p>
  );
}
