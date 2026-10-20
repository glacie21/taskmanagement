import { STATUS_CHART_VARS, STATUS_LABELS } from '@/lib/constants';
import { TASK_STATUSES } from '@/lib/db/schema';
import type { StatusCounts } from '@/lib/data/dashboard';

/** Satu batang 100% bertumpuk untuk komposisi status + legenda berangka */
export function StatusBreakdown({ counts, total }: { counts: StatusCounts; total: number }) {
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div>
      <div
        className="flex h-3 w-full gap-0.5 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800"
        role="img"
        aria-label={TASK_STATUSES.map((s) => `${STATUS_LABELS[s]} ${counts[s]}`).join(', ')}
      >
        {TASK_STATUSES.filter((s) => counts[s] > 0).map((status) => (
          <div
            key={status}
            className="h-full first:rounded-l last:rounded-r"
            style={{ width: `${(counts[status] / total) * 100}%`, backgroundColor: STATUS_CHART_VARS[status] }}
            title={`${STATUS_LABELS[status]}: ${counts[status]}`}
          />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        {TASK_STATUSES.map((status) => (
          <div key={status}>
            <dt className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: STATUS_CHART_VARS[status] }}
                aria-hidden
              />
              {STATUS_LABELS[status]}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
              {counts[status]}
              <span className="ml-1 text-xs font-normal text-zinc-500 dark:text-zinc-400">{pct(counts[status])}%</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
