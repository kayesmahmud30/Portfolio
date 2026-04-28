"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import Container from "@/components/Container";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinks } from "@/data/site";
import { useActiveSection } from "@/components/hooks/useActiveSection";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const ids = useMemo(() => navLinks.map((l) => l.id), []);
  const activeId = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <Container className="flex h-16 items-center justify-between gap-3">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              scrollToId("home");
            }}
            className="flex items-center gap-2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              {"</>"}
            </span>
            <span className="hidden sm:block">Portfolio</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => {
              const isActive = activeId === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(l.id);
                  }}
                  className={`relative rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "text-zinc-950 dark:text-zinc-50"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-zinc-950/5 dark:bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-50 dark:hover:bg-zinc-900/60 md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              {open ? <FiX className="text-[18px]" /> : <FiMenu className="text-[18px]" />}
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: -14, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -14, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.25 }}
              className="absolute left-3 right-3 top-3 rounded-2xl border border-black/10 bg-white/85 p-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-950/70"
            >
              <div className="flex items-center justify-between px-2 py-1">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Navigate</div>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>
              <div className="mt-2 grid gap-1">
                {navLinks.map((l) => {
                  const isActive = activeId === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        scrollToId(l.id);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-zinc-950/5 text-zinc-950 dark:bg-white/10 dark:text-zinc-50"
                          : "text-zinc-700 hover:bg-zinc-950/5 dark:text-zinc-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>{l.label}</span>
                      {isActive ? (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Active</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

