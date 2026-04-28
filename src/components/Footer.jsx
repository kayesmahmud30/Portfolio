"use client";

import Container from "@/components/Container";
import SocialLinks from "@/components/SocialLinks";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-10 dark:border-white/10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{site.name}</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
        <SocialLinks links={site.socials} />
      </Container>
    </footer>
  );
}

