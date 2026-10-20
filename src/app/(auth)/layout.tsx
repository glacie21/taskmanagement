import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Logo className="relative mb-8 text-lg" />
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-xl shadow-zinc-200/40 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none">
        {children}
      </div>
    </div>
  );
}
