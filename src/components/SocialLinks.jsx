"use client";

import { FaFacebookF, FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const icons = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
  facebook: FaFacebookF,
};

export default function SocialLinks({ links, className = "" }) {
  const items = Object.entries(links ?? {}).filter(([, href]) => !!href);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map(([key, href]) => {
        const Icon = icons[key];
        if (!Icon) return null;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur transition hover:-translate-y-0.5 hover:border-black/15 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-50 dark:hover:bg-zinc-900/60"
            aria-label={key}
          >
            <Icon className="text-[18px] transition-transform group-hover:scale-110" />
          </a>
        );
      })}
    </div>
  );
}

