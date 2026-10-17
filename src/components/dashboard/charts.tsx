'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { PRIORITY_LABELS, STATUS_CHART_VARS, STATUS_LABELS } from '@/lib/constants';
import { TASK_STATUSES, type TaskStatus } from '@/lib/db/schema';
import type { PriorityRow, ProjectStatusRow } from '@/lib/data/dashboard';

const axisTick = { fill: 'var(--chart-axis)', fontSize: 12 };

function TooltipBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <p className="mb-1.5 font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
      {children}
    </div>
  );
}

function StatusLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
      {TASK_STATUSES.map((status) => (
        <li key={status} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: STATUS_CHART_VARS[status] }} aria-hidden />
          {STATUS_LABELS[status]}
        </li>
      ))}
    </ul>
  );
}

function ProjectTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as ProjectStatusRow;
  return (
    <TooltipBox title={row.name}>
      <ul className="space-y-1">
        {TASK_STATUSES.map((status) => (
          <li key={status} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: STATUS_CHART_VARS[status] }} />
              {STATUS_LABELS[status]}
            </span>
            <span className="font-medium text-zinc-900 tabular-nums dark:text-zinc-100">{row[status]}</span>
          </li>
        ))}
      </ul>
    </TooltipBox>
  );
}

/** Batang horizontal bertumpuk: komposisi status tugas per proyek */
export function ProjectStatusChart({ data }: { data: ProjectStatusRow[] }) {
  const height = Math.max(160, data.length * 44 + 40);

  return (
    <div className="flex flex-col gap-3">
      <StatusLegend />
      <div style={{ height }} aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barCategoryGap={10}>
            <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
            <XAxis type="number" allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={(name: string) => (name.length > 16 ? `${name.slice(0, 15)}…` : name)}
            />
            <Tooltip content={ProjectTooltip} cursor={{ fill: 'var(--chart-grid)', opacity: 0.4 }} />
            {TASK_STATUSES.map((status: TaskStatus, i) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="status"
                fill={STATUS_CHART_VARS[status]}
                // Garis tepi warna permukaan = celah 2px antar segmen
                stroke="var(--chart-surface)"
                strokeWidth={2}
                radius={i === TASK_STATUSES.length - 1 ? [0, 4, 4, 0] : 0}
                maxBarSize={24}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        caption="Tugas per proyek berdasarkan status"
        headers={['Proyek', ...TASK_STATUSES.map((s) => STATUS_LABELS[s])]}
        rows={data.map((row) => [row.name, ...TASK_STATUSES.map((s) => row[s])])}
      />
    </div>
  );
}

function PriorityTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as PriorityRow;
  return (
    <TooltipBox title={`Prioritas ${PRIORITY_LABELS[row.priority]}`}>
      <p className="text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-zinc-900 tabular-nums dark:text-zinc-100">{row.count}</span> tugas belum selesai
      </p>
    </TooltipBox>
  );
}

/** Batang vertikal: jumlah tugas yang belum selesai per prioritas */
export function PriorityChart({ data }: { data: PriorityRow[] }) {
  return (
    <>
      <div className="h-56 lg:h-auto lg:min-h-56 lg:flex-1" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="priority"
              tickFormatter={(p: keyof typeof PRIORITY_LABELS) => PRIORITY_LABELS[p]}
              tick={axisTick}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
            />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={PriorityTooltip} cursor={{ fill: 'var(--chart-grid)', opacity: 0.4 }} />
            <Bar
              dataKey="count"
              fill="var(--chart-priority)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              isAnimationActive={false}
            >
              <LabelList dataKey="count" position="top" fill="var(--foreground)" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        caption="Tugas belum selesai per prioritas"
        headers={['Prioritas', 'Jumlah']}
        rows={data.map((row) => [PRIORITY_LABELS[row.priority], row.count])}
      />
    </>
  );
}

/** Tabel tersembunyi untuk pembaca layar (grafik di atas di-aria-hidden) */
function DataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            {row.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
