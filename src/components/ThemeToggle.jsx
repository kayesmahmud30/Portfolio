"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 text-sm font-medium text-zinc-900 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-50 dark:hover:bg-zinc-900/60"
      aria-label="Toggle theme"
    >
      <span className="relative grid h-6 w-6 place-items-center rounded-full bg-black/5 transition dark:bg-white/10">
        {isDark ? <FiMoon className="text-[16px]" /> : <FiSun className="text-[16px]" />}
      </span>
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

