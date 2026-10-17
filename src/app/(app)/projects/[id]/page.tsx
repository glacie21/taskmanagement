import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ListTodo } from 'lucide-react';
import { requireUser } from '@/lib/auth/dal';
import { getProject, getProjectOptions } from '@/lib/data/projects';
import { getTasks, parseTaskFilters } from '@/lib/data/tasks';
import { PageHeader } from '@/components/page-header';
import { Card, EmptyState } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ProjectActions } from '@/components/projects/project-actions';
import { NewTaskButton } from '@/components/tasks/new-task-button';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskList } from '@/components/tasks/task-list';

export async function generateMetadata({ params }: PageProps<'/projects/[id]'>): Promise<Metadata> {
  const user = await requireUser();
  const project = await getProject(user.id, (await params).id);
  return { title: project?.name ?? 'Proyek' };
}

export default async function ProjectDetailPage({ params, searchParams }: PageProps<'/projects/[id]'>) {
  const user = await requireUser();
  const { id } = await params;
  const project = await getProject(user.id, id);
  if (!project) notFound();

  const filters = { ...parseTaskFilters(await searchParams), projectId: project.id };
  const hasFilters = !!(filters.status || filters.priority || filters.q);

  const [tasks, allProjectTasks, projects] = await Promise.all([
    getTasks(user.id, filters),
    hasFilters ? getTasks(user.id, { projectId: project.id }) : null,
    getProjectOptions(user.id),
  ]);

  const all = allProjectTasks ?? tasks;
  const done = all.filter((task) => task.status === 'DONE').length;
  const progress = all.length ? Math.round((done / all.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title={project.name}
        description={project.description ?? undefined}
        action={
          <div className="flex items-center gap-2">
            <ProjectActions
              project={{ id: project.id, name: project.name, description: project.description, color: project.color }}
              redirectAfterDelete="/projects"
            />
            <NewTaskButton projects={projects} defaultProjectId={project.id} />
          </div>
        }
      >
        <Link
          href="/projects"
          className="mb-3 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Semua proyek
        </Link>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} aria-hidden />
          <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Proyek</span>
        </div>
      </PageHeader>

      <Card className="mb-6 p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">
            {done} dari {all.length} tugas selesai
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{progress}%</span>
        </div>
        <ProgressBar value={progress} color={project.color} label={`Progres ${project.name}`} />
      </Card>

      <div className="mb-4">
        <Suspense>
          <TaskFilters />
        </Suspense>
      </div>

      <Card>
        {tasks.length ? (
          <TaskList tasks={tasks} projects={projects} showProject={false} />
        ) : (
          <EmptyState
            icon={<ListTodo className="h-5 w-5" />}
            title={hasFilters ? 'Tidak ada tugas yang cocok' : 'Belum ada tugas'}
            description={hasFilters ? 'Coba ubah atau reset filter.' : 'Tambahkan tugas pertama untuk proyek ini.'}
            action={hasFilters ? undefined : <NewTaskButton projects={projects} defaultProjectId={project.id} />}
          />
        )}
      </Card>
    </>
  );
}
