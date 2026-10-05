import Image from "next/image";
import { ExternalLink, BookOpen, Layers } from "lucide-react";

interface ActionLink {
  label: string;
  href: string;
  primary?: boolean;
}

const ACTION_LINKS: ActionLink[] = [
  {
    label: "Deploy Now",
    href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    primary: true,
  },
  {
    label: "Documentation",
    href: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
    primary: false,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center sm:items-start gap-8 p-8 sm:p-12 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-zinc-200/40 dark:shadow-none">
        {/* Next.js Logo */}
        <div className="flex items-center gap-3">
          <Image
            className="dark:invert transition-transform hover:scale-105"
            src="/next.svg"
            alt="Next.js logo"
            width={110}
            height={22}
            priority
          />
        </div>

        {/* Heading & Guide Info */}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
            To get started, edit{" "}
            <code className="inline-block px-2.5 py-1 text-sm font-mono font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-700">
              src/app/page.tsx
            </code>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Learning
            </a>{" "}
            center.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          {ACTION_LINKS.map((link) =>
            link.primary ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Image
                  className="dark:invert w-3.5 h-3.5"
                  src="/vercel.svg"
                  alt="Vercel logo"
                  width={14}
                  height={14}
                />
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {link.label}
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            )
          )}
        </div>
      </main>
    </div>
  );
}
