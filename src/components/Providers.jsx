"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}

