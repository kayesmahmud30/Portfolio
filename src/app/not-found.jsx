import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <div className="min-h-full bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <Container className="py-24">
        <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-10 text-center backdrop-blur dark:border-white/10">
          <div className="text-sm font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            404
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            The page you’re looking for doesn’t exist (or was moved).
          </p>
          <Link
            href="/#home"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            Go back home
          </Link>
        </div>
      </Container>
    </div>
  );
}

