"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface AnimatedSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function AnimatedSection({ id, className = "", children }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px", once: true });

  return (
    <section id={id} ref={ref} className={`section ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
        transition={{ duration: 0.55 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
