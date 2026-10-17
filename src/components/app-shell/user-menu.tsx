import { LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import type { CurrentUser } from '@/lib/auth/dal';

export function UserMenu({ user }: { user: CurrentUser }) {
  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.name}</p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          title="Keluar"
          aria-label="Keluar"
          className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
