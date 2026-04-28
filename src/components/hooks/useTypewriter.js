"use client";

import { useEffect, useMemo, useState } from "react";

export function useTypewriter(words, { typingMs = 55, deletingMs = 35, pauseMs = 900 } = {}) {
  const list = useMemo(() => (Array.isArray(words) ? words.filter(Boolean) : []), [words]);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!list.length) return;
    const full = list[index % list.length] ?? "";

    const doneTyping = !isDeleting && text === full;
    const doneDeleting = isDeleting && text === "";

    const delay =
      doneTyping ? pauseMs : doneDeleting ? 250 : isDeleting ? deletingMs : typingMs;

    const id = setTimeout(() => {
      if (doneTyping) return setIsDeleting(true);
      if (doneDeleting) {
        setIsDeleting(false);
        setIndex((v) => (v + 1) % list.length);
        return;
      }

      setText((prev) => {
        const nextLen = isDeleting ? Math.max(prev.length - 1, 0) : Math.min(prev.length + 1, full.length);
        return full.slice(0, nextLen);
      });
    }, delay);

    return () => clearTimeout(id);
  }, [list, index, text, isDeleting, typingMs, deletingMs, pauseMs]);

  return { text, word: list[index % (list.length || 1)] ?? "", isDeleting };
}

