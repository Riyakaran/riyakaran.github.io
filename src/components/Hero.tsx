import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { profile } from "@/data/resume";

const skillTags = [
  "Product Strategy",
  "Agile Delivery",
  "AI-Augmented PM",
  "Stakeholder Management",
  "Roadmapping",
  "Scrum Mastery",
];

export default function Hero() {
  return (
    <section id="top" className="pt-32 pb-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="reveal inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wide text-accent shadow-rest">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open to new opportunities · {profile.location}
          </div>

          <h1 className="reveal delay-75 mt-8 max-w-xl font-display text-4xl font-bold text-neutral-900 sm:text-6xl">
            Turning ambiguity into{" "}
            <span className="relative inline-block text-accent">
              <span className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-accent/15" />
              shipped roadmaps
            </span>
            .
          </h1>

          <p className="reveal delay-150 mt-8 max-w-prose text-lg text-neutral-600">
            I&apos;m {profile.name}, a {profile.role} building enterprise platforms where
            engineering, business, and AI actually meet in the backlog.
          </p>

          <div className="reveal delay-200 mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#journey"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
            >
              See my journey
              <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-neutral-900 shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="reveal delay-150 relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full shadow-lift">
          <Image
            src="/riya-photo.jpg"
            alt={`${profile.name} smiling on a balcony overlooking Bangalore`}
            fill
            priority
            sizes="(max-width: 1024px) 60vw, 448px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-6 sm:px-8">
        <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-neutral-100 p-6">
          {skillTags.map((item) => (
            <span
              key={item}
              className="rounded-full border border-neutral-200 bg-surface px-4 py-2 text-sm font-semibold text-neutral-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
