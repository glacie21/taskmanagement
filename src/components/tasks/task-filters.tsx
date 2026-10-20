'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/form';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/constants';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/db/schema';
import type { ProjectOption } from '@/lib/data/projects';

// Filter disimpan di URL (?status=&priority=&project=&q=) agar bisa di-bookmark & dibagikan
export function TaskFilters({ projects }: { projects?: ProjectOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }));
  };

  // Debounce pencarian
  useEffect(() => {
    if (query === (searchParams.get('q') ?? '')) return;
    const timeout = setTimeout(() => setParam('q', query.trim()), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const hasFilters = ['status', 'priority', 'project', 'q'].some((key) => searchParams.has(key));

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-64">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari tugas…"
          aria-label="Cari tugas"
          className="pl-9"
        />
      </div>
      <Select
        value={searchParams.get('status') ?? ''}
        onChange={(e) => setParam('status', e.target.value)}
        aria-label="Filter status"
        className="sm:w-44"
      >
        <option value="">Semua status</option>
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get('priority') ?? ''}
        onChange={(e) => setParam('priority', e.target.value)}
        aria-label="Filter prioritas"
        className="sm:w-44"
      >
        <option value="">Semua prioritas</option>
        {TASK_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </Select>
      {projects && (
        <Select
          value={searchParams.get('project') ?? ''}
          onChange={(e) => setParam('project', e.target.value)}
          aria-label="Filter proyek"
          className="sm:w-44"
        >
          <option value="">Semua proyek</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
      )}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQuery('');
            startTransition(() => router.replace(pathname, { scroll: false }));
          }}
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
