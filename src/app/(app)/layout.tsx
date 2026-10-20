import { requireUser } from '@/lib/auth/dal';
import { Logo } from '@/components/logo';
import { Nav } from '@/components/app-shell/nav';
import { UserMenu } from '@/components/app-shell/user-menu';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-5 md:flex dark:border-zinc-800 dark:bg-zinc-950">
        <Logo href="/dashboard" className="mb-8 px-2" />
        <Nav />
        <div className="mt-auto flex flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <ThemeToggle className="w-full" />
          <UserMenu user={user} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header (mobile) */}
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo href="/dashboard" />
            <ThemeToggle />
          </div>
          <div className="px-2 pb-2">
            <Nav orientation="horizontal" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <footer className="border-t border-zinc-200 px-4 py-4 md:hidden dark:border-zinc-800">
          <UserMenu user={user} />
        </footer>
      </div>
    </div>
  );
}
