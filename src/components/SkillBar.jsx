"use client";

import { motion } from "framer-motion";

export default function SkillBar({ icon: Icon, name, level }) {
  return (
    <div
      data-aos="zoom-in-up"
      data-aos-anchor-placement="bottom-bottom"
      className="group rounded-2xl border border-black/10 bg-[var(--card)] p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-black/15 dark:border-white/10 dark:hover:border-white/15"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-950/5 text-zinc-900 dark:bg-white/10 dark:text-zinc-50">
            {Icon ? <Icon className="text-[18px]" /> : null}
          </span>
          <div>
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {name}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {level}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.max(0, Math.min(100, level))}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400"
        />
      </div>
    </div>
  );
}
