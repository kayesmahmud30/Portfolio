"use client";

import { useEffect, useMemo, useState } from "react";

export function useActiveSection(sectionIds, { offset = 120 } = {}) {
  const ids = useMemo(() => (Array.isArray(sectionIds) ? sectionIds : []), [sectionIds]);
  const [activeId, setActiveId] = useState(ids[0] ?? "home");

  useEffect(() => {
    if (!ids.length) return;

    let rafId = 0;

    const updateActive = () => {
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (!sections.length) return;

      // Position just below the sticky header.
      const markerY = window.scrollY + offset;
      let current = sections[0].id;

      for (const section of sections) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= markerY) current = section.id;
      }

      // If user reaches the bottom, force the last section active.
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (nearBottom) current = sections[sections.length - 1].id;

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [ids, offset]);

  return activeId;
}

