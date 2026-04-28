"use client";

import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-10">
      {eyebrow ? (
        <div className="mb-2 text-xs font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </div>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

