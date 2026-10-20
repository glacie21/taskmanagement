import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { ProjectWithStats } from '@/lib/data/projects';
import { ProjectActions } from './project-actions';

export function ProjectCard({ project }: { project: ProjectWithStats }) {
  const progress = project.totalTasks ? Math.round((project.doneTasks / project.totalTasks) * 100) : 0;

  return (
    <Card className="group relative flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: project.color }} aria-hidden />
          <h2 className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
            {/* Link menutupi seluruh kartu; tombol aksi berada di atasnya (z-10) */}
            <Link href={`/projects/${project.id}`} className="after:absolute after:inset-0 after:rounded-xl">
              {project.name}
            </Link>
          </h2>
        </div>
        <div className="relative z-10 -mt-1 -mr-2">
          <ProjectActions
            project={{ id: project.id, name: project.name, description: project.description, color: project.color }}
          />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 min-h-10 text-sm text-zinc-500 dark:text-zinc-400">
        {project.description || 'Tidak ada deskripsi'}
      </p>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            {project.doneTasks}/{project.totalTasks} tugas selesai
          </span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{progress}%</span>
        </div>
        <ProgressBar value={progress} color={project.color} label={`Progres ${project.name}`} />
      </div>
    </Card>
  );
}
