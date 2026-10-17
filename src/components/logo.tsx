import Link from 'next/link';
import { SquareCheckBig } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2 font-semibold', className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <SquareCheckBig className="h-4 w-4" />
      </span>
      <span className="text-zinc-900 dark:text-zinc-100">TaskFlow</span>
    </Link>
  );
}
