"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/data/resume";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <a
          href="#top"
          className="font-display text-sm font-bold tracking-[0.2em] text-paper uppercase"
        >
          Riya<span className="text-accent">.</span>Karan
        </a>

        <ul className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.15em] text-paper-dim md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-accent">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={profile.resumeFile}
            download
            className="group inline-flex items-center gap-2 border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent"
          >
            Resume
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-paper transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
          />
          <span className={`h-px w-6 bg-paper transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-paper transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open ? (
        <div className="border-t border-line bg-ink px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-5 font-mono text-sm uppercase tracking-[0.15em] text-paper-dim">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="hover:text-accent">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resumeFile}
                download
                className="inline-block text-accent"
                onClick={() => setOpen(false)}
              >
                Download Resume ↓
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
