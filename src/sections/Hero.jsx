"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import SocialLinks from "@/components/SocialLinks";
import { useTypewriter } from "@/components/hooks/useTypewriter";
import { site } from "@/data/site";
import { FiDownload } from "react-icons/fi";

export default function Hero() {
  const { text } = useTypewriter(site.designationLoop, {
    typingMs: 55,
    deletingMs: 32,
    pauseMs: 900,
  });

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-40 right-[-80px] h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              HELLO, I’M
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
              {site.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-lg text-zinc-700 dark:text-zinc-200 sm:text-xl">
              <span className="rounded-full border border-black/10 bg-white/50 px-3 py-1 text-sm font-medium backdrop-blur dark:border-white/10 dark:bg-zinc-900/30">
                {text || site.designationLoop?.[0]}
                <span className="ml-1 inline-block h-5 w-[2px] translate-y-[3px] bg-zinc-950/60 align-middle dark:bg-white/60 animate-pulse" />
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg sm:leading-8">
              {site.intro}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/resume.pdf"
                download
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 sm:w-auto"
              >
                <FiDownload className="text-[18px] transition-transform group-hover:translate-y-[-1px]" />
                Download Resume
              </a>

              <SocialLinks links={site.socials} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="relative rounded-3xl border border-black/10 bg-[var(--card)] p-3 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-white/5 to-transparent dark:from-white/10" />
              <div className="relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900">
                <Image
                  src="/profile-placeholder.svg"
                  alt={`${site.name} profile photo`}
                  width={700}
                  height={700}
                  priority
                  className="h-[360px] w-full object-cover sm:h-[420px]"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Replace the placeholder with your professional photo in{" "}
              <span className="font-medium">/public</span>.
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

