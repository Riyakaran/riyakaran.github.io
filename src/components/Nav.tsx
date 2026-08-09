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
    <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-8 sm:top-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full bg-surface/90 px-6 py-3 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-clay-lg" : "shadow-clay"
        }`}
      >
        <a href="#top" className="font-display text-lg font-bold text-ink">
          Riya<span className="text-coral-text">.</span>Karan
        </a>

        <ul className="hidden items-center gap-1 text-sm font-semibold text-ink/70 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block rounded-full px-3 py-1.5 transition-colors duration-300 hover:bg-surface-dim hover:text-coral-text"
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
            className="group inline-flex items-center gap-2 rounded-full bg-coral-solid px-5 py-2.5 text-sm font-bold text-white shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 hover:shadow-clay active:translate-y-0 active:shadow-clay-pressed"
          >
            Resume
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 rounded-full bg-surface-dim p-2.5 shadow-clay-sm md:hidden"
        >
          <span
            className={`h-0.5 w-5 rounded-full bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-5 rounded-full bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-5 rounded-full bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-3 max-w-6xl rounded-3xl bg-surface p-6 shadow-clay-lg md:hidden">
          <ul className="flex flex-col gap-2 text-base font-semibold text-ink/70">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 transition-colors hover:bg-surface-dim hover:text-coral-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resumeFile}
                download
                className="mt-2 block rounded-2xl bg-coral-solid px-4 py-3 text-center font-bold text-white shadow-clay-sm"
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
