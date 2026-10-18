import type { Metadata } from 'next';
import Link from 'next/link';
import { CircleCheck, CircleDot, FolderKanban, ListTodo, TriangleAlert } from 'lucide-react';
import { requireUser } from '@/lib/auth/dal';
import { getDashboardData } from '@/lib/data/dashboard';
import { getUpcomingTasks } from '@/lib/data/tasks';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, EmptyState } from '@/components/ui/card';
import { StatTile } from '@/components/dashboard/stat-tile';
import { StatusBreakdown } from '@/components/dashboard/status-breakdown';
import { PriorityChart, ProjectStatusChart } from '@/components/dashboard/charts';
import { NewTaskButton } from '@/components/tasks/new-task-button';
import { TaskList } from '@/components/tasks/task-list';
import { buttonClasses } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, upcoming] = await Promise.all([getDashboardData(user.id), getUpcomingTasks(user.id)]);
  const { projects } = stats;
  const firstName = user.name.split(' ')[0];

  return (
    <>
      <PageHeader
        title={`Halo, ${firstName} 👋`}
        description="Ringkasan progres proyek dan tugasmu."
        action={<NewTaskButton projects={projects} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total tugas"
          value={stats.total}
          hint={`${stats.projectCount} proyek`}
          icon={<ListTodo className="h-4 w-4" />}
        />
        <StatTile
          label="Dikerjakan"
          value={stats.statusCounts.IN_PROGRESS}
          hint={`${stats.statusCounts.TODO} menunggu dikerjakan`}
          icon={<CircleDot className="h-4 w-4" />}
        />
        <StatTile
          label="Selesai"
          value={stats.statusCounts.DONE}
          hint={`${stats.completionRate}% dari semua tugas`}
          icon={<CircleCheck className="h-4 w-4" />}
        />
        <StatTile
          label="Terlambat"
          value={stats.overdue}
          hint={stats.overdue ? 'Lewat tenggat & belum selesai' : 'Tidak ada yang terlambat'}
          icon={<TriangleAlert className="h-4 w-4" />}
          tone={stats.overdue ? 'critical' : 'default'}
        />
      </div>

      {stats.total === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={<ListTodo className="h-5 w-5" />}
            title="Belum ada tugas"
            description="Buat tugas pertamamu untuk mulai melihat statistik di sini."
            action={<NewTaskButton projects={projects} />}
          />
        </Card>
      ) : (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Status tugas" description={`${stats.total} tugas`} />
              <div className="p-5">
                <StatusBreakdown counts={stats.statusCounts} total={stats.total} />
              </div>
            </Card>
            <Card className="flex flex-col lg:row-span-2">
              <CardHeader title="Belum selesai per prioritas" />
              <div className="flex flex-1 flex-col p-5">
                <PriorityChart data={stats.priorityRows} />
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader title="Tugas per proyek" description="Komposisi status di tiap proyek" />
              <div className="p-5">
                <ProjectStatusChart data={stats.projectRows} />
              </div>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader
              title="Tenggat terdekat"
              description="Tugas belum selesai, diurutkan dari tenggat terdekat"
              action={
                <Link href="/tasks" className={buttonClasses('ghost', 'sm')}>
                  Lihat semua
                </Link>
              }
            />
            <div className="mt-3 border-t border-zinc-100 dark:border-zinc-800">
              {upcoming.length ? (
                <TaskList tasks={upcoming} projects={projects} />
              ) : (
                <EmptyState
                  icon={<CircleCheck className="h-5 w-5" />}
                  title="Semua tugas selesai"
                  description="Kerja bagus! Tidak ada tugas yang tertunda."
                />
              )}
            </div>
          </Card>

          {stats.projectCount === 0 && (
            <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <FolderKanban className="h-4 w-4" />
              Tip: kelompokkan tugas ke dalam{' '}
              <Link href="/projects" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                proyek
              </Link>
              .
            </p>
          )}
        </>
      )}
    </>
  );
}
