import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatTile({
  label,
  value,
  hint,
  icon,
  tone = 'default',
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ReactNode;
  tone?: 'default' | 'critical';
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <span
          className={cn(
            'text-zinc-400 dark:text-zinc-500',
            tone === 'critical' && 'text-red-500 dark:text-red-400',
          )}
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</p>
      {hint && (
        <p
          className={cn(
            'mt-1 text-xs text-zinc-500 dark:text-zinc-400',
            tone === 'critical' && 'font-medium text-red-600 dark:text-red-400',
          )}
        >
          {hint}
        </p>
      )}
    </Card>
  );
}
