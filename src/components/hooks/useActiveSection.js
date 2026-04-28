"use client";

import { useEffect, useMemo, useState } from "react";

export function useActiveSection(sectionIds, { rootMargin = "-35% 0px -55% 0px" } = {}) {
  const ids = useMemo(() => (Array.isArray(sectionIds) ? sectionIds : []), [sectionIds]);
  const [activeId, setActiveId] = useState(ids[0] ?? "home");

  useEffect(() => {
    if (!ids.length) return;

    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const id = visible[0]?.target?.id;
        if (id) setActiveId(id);
      },
      { root: null, threshold: [0.15, 0.25, 0.35, 0.5, 0.75], rootMargin }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}

