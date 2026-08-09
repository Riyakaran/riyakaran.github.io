"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
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
    <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-8 sm:top-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full bg-surface px-6 py-3 transition-shadow duration-200 ${
          scrolled ? "shadow-lift" : "shadow-rest"
        }`}
      >
        <a href="#top" className="font-display text-lg font-bold text-neutral-900">
          Riya<span className="text-accent">.</span>Karan
        </a>

        <ul className="hidden items-center gap-1 text-sm font-semibold text-neutral-600 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block rounded-full px-3 py-3 transition-colors duration-150 hover:bg-neutral-100 hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={profile.resumeFile}
            download
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
          >
            Resume
            <Download className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 md:hidden"
        >
          {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-3 max-w-6xl rounded-2xl bg-surface p-6 shadow-lift md:hidden">
          <ul className="flex flex-col gap-1 text-base font-semibold text-neutral-600">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 transition-colors duration-150 hover:bg-neutral-100 hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resumeFile}
                download
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 font-bold text-white"
                onClick={() => setOpen(false)}
              >
                Download Resume
                <Download className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
