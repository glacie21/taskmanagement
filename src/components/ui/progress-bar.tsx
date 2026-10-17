export function ProgressBar({ value, color, label }: { value: number; color?: string; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-[width] dark:bg-indigo-400"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}
