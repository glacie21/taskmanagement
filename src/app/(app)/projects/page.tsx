import type { Metadata } from 'next';
import { FolderKanban } from 'lucide-react';
import { requireUser } from '@/lib/auth/dal';
import { getProjectsWithStats } from '@/lib/data/projects';
import { PageHeader } from '@/components/page-header';
import { Card, EmptyState } from '@/components/ui/card';
import { NewProjectButton } from '@/components/projects/project-actions';
import { ProjectCard } from '@/components/projects/project-card';

export const metadata: Metadata = { title: 'Proyek' };

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await getProjectsWithStats(user.id);

  return (
    <>
      <PageHeader
        title="Proyek"
        description={`${projects.length} proyek`}
        action={<NewProjectButton />}
      />

      {projects.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FolderKanban className="h-5 w-5" />}
            title="Belum ada proyek"
            description="Buat proyek untuk mengelompokkan tugas-tugasmu."
            action={<NewProjectButton />}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
