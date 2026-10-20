import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ListTodo } from 'lucide-react';
import { requireUser } from '@/lib/auth/dal';
import { getProjectOptions } from '@/lib/data/projects';
import { getTasks, parseTaskFilters } from '@/lib/data/tasks';
import { PageHeader } from '@/components/page-header';
import { Card, EmptyState } from '@/components/ui/card';
import { NewTaskButton } from '@/components/tasks/new-task-button';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskList } from '@/components/tasks/task-list';

export const metadata: Metadata = { title: 'Tugas' };

export default async function TasksPage({ searchParams }: PageProps<'/tasks'>) {
  const user = await requireUser();
  const filters = parseTaskFilters(await searchParams);
  const hasFilters = Object.values(filters).some(Boolean);

  const [tasks, projects] = await Promise.all([getTasks(user.id, filters), getProjectOptions(user.id)]);
  // ?project= dari URL hanya dipakai sebagai default form jika proyeknya memang milik user
  const defaultProjectId = projects.some((p) => p.id === filters.projectId) ? filters.projectId : undefined;

  return (
    <>
      <PageHeader
        title="Tugas"
        description={`${tasks.length} tugas${hasFilters ? ' (terfilter)' : ''}`}
        action={<NewTaskButton projects={projects} defaultProjectId={defaultProjectId} />}
      />

      <div className="mb-4">
        <Suspense>
          <TaskFilters projects={projects} />
        </Suspense>
      </div>

      <Card>
        {tasks.length ? (
          <TaskList tasks={tasks} projects={projects} />
        ) : (
          <EmptyState
            icon={<ListTodo className="h-5 w-5" />}
            title={hasFilters ? 'Tidak ada tugas yang cocok' : 'Belum ada tugas'}
            description={hasFilters ? 'Coba ubah atau reset filter.' : 'Buat tugas pertamamu sekarang.'}
            action={hasFilters ? undefined : <NewTaskButton projects={projects} />}
          />
        )}
      </Card>
    </>
  );
}
