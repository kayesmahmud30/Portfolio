import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { getProjectBySlug, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailsPage({ params }) {
  const { slug } = await params;

  const project = getProjectBySlug(slug);

  if (!project) return notFound();

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="border-b border-black/5 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-black/30">
        <Container className="py-10">
          <Link
            href="/#projects"
            className="border-2 p-2 rounded-full text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            🡰 Back to Projects
          </Link>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            {project.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/10 bg-white/50 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-200"
              >
                {t}
              </span>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-[var(--card)] backdrop-blur dark:border-white/10">
          <Image
            src={project.image}
            alt={project.title}
            width={1400}
            height={800}
            className="h-[320px] w-full object-cover sm:h-[420px]"
            priority
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-7 backdrop-blur dark:border-white/10">
            <h2 className="text-lg font-semibold">Full description</h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-zinc-600 dark:text-zinc-300">
              {project.description}
            </p>

            <h3 className="mt-8 text-base font-semibold">Challenges</h3>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {project.challenges?.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <h3 className="mt-8 text-base font-semibold">
              Future improvements
            </h3>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {project.improvements?.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-7 backdrop-blur dark:border-white/10">
            <h2 className="text-lg font-semibold">Links</h2>

            <div className="mt-4 grid gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-black/10 bg-white/40 px-4 py-4 text-sm font-medium text-zinc-950 transition hover:-translate-y-0.5 hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-50 dark:hover:bg-zinc-900/45"
              >
                Live project →
              </a>

              <a
                href={project.githubClientUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-black/10 bg-white/40 px-4 py-4 text-sm font-medium text-zinc-950 transition hover:-translate-y-0.5 hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-50 dark:hover:bg-zinc-900/45"
              >
                GitHub (client) →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
