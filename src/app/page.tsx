import Link from "next/link";
import { redirect } from "next/navigation";
import { ChartColumn, FolderKanban, ListChecks } from "lucide-react";
import { getSession } from "@/lib/auth/dal";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClasses } from "@/components/ui/button";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Proyek berwarna",
    description: "Kelompokkan tugas ke dalam proyek dan pantau progres masing-masing.",
  },
  {
    icon: ListChecks,
    title: "Status & prioritas",
    description: "Atur status, prioritas, dan tenggat agar tidak ada yang terlewat.",
  },
  {
    icon: ChartColumn,
    title: "Statistik visual",
    description: "Lihat ringkasan produktivitasmu lewat grafik di dashboard.",
  },
];

export default async function Home() {
  if (await getSession()) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />

      <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonClasses("ghost", "sm")}>
            Masuk
          </Link>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Kelola proyek & tugas tanpa ribet
        </h1>
        <p className="mt-4 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
          TaskFlow membantumu mencatat tugas, mengatur prioritas, dan memantau progres kerja dalam satu tempat.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/register" className={buttonClasses("primary", "md", "h-11 px-6")}>
            Mulai gratis
          </Link>
          <Link href="/login" className={buttonClasses("secondary", "md", "h-11 px-6")}>
            Saya sudah punya akun
          </Link>
        </div>

        <div className="mt-16 grid w-full gap-4 text-left sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-200 bg-white/70 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
