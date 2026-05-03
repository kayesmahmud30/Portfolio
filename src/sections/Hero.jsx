"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import SocialLinks from "@/components/SocialLinks";
import { useTypewriter } from "@/components/hooks/useTypewriter";
import { site } from "@/data/site";
import { FiDownload } from "react-icons/fi";
import { FaReact, FaNodeJs, FaGitAlt, FaGithub } from "react-icons/fa";
import { SiNextdotjs, SiMongodb, SiExpress, SiJavascript } from "react-icons/si";

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

            <div className=" mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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
              <div className="relative overflow-hidden px-7 rounded-2xl bg-[linear-gradient(to_right,rgba(2,0,36,0.4)_0%,rgba(9,9,121,0.4)_35%,rgba(0,212,255,0.4)_100%)] dark:bg-[linear-gradient(to_right,rgba(2,0,36,0.3)_0%,rgba(9,9,121,0.3)_35%,rgba(0,212,255,0.3)_100%)] animate-gradient-bg bg-[length:200%_200%] border-2 border-gray-700/50 backdrop-blur-md transition-colors duration-500">
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    { Icon: FaReact, color: "text-blue-500", top: "10%", left: "10%", delay: "0s" },
                    { Icon: SiNextdotjs, color: "text-black", top: "55%", left: "88%", delay: "1s" },
                    { Icon: SiMongodb, color: "text-green-500", top: "15%", left: "80%", delay: "0.5s" },
                    { Icon: FaNodeJs, color: "text-green-600", top: "55%", left: "2%", delay: "1.5s" },
                    { Icon: SiJavascript, color: "text-yellow-500", top: "30%", left: "3%", delay: "2s" },
                    { Icon: SiExpress, color: "text-black", top: "35%", left: "88%", delay: "2.5s" },
                    { Icon: FaGitAlt, color: "text-[#F1502F]", top: "22%", left: "25%", delay: "0.8s" },
                    { Icon: FaGithub, color: "text-black", top: "25%", left: "65%", delay: "1.8s" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`absolute ${item.color} animate-float`}
                      style={{ 
                        top: item.top, 
                        left: item.left,
                        animationDelay: item.delay
                      }}
                    >
                      <item.Icon className="text-3xl sm:text-4xl logo-shadow" />
                    </div>
                  ))}
                </div>
                <Image
                  src="/profile.jpg"
                  alt={`${site.name} profile photo`}
                  width={700}
                  height={700}
                  priority
                  className="relative z-10 h-90 border-white w-full object-cover sm:h-105"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
