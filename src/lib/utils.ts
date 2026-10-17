import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Due date disimpan sebagai tengah malam UTC dari tanggal yang dipilih (input type="date"),
// jadi format dan perbandingannya juga dilakukan dalam UTC agar tanggal tidak bergeser.
export function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : '';
}

export function fromDateInputValue(value: string | null | undefined) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function startOfTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}
