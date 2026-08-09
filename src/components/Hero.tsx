import { profile } from "@/data/resume";

const marqueeItems = [
  "Product Strategy",
  "Agile Delivery",
  "AI-Augmented PM",
  "Stakeholder Management",
  "Roadmapping",
  "Scrum Mastery",
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[32rem] w-[32rem] animate-drift rounded-full bg-coral/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[26rem] w-[26rem] animate-drift rounded-full bg-periwinkle/25 blur-[120px] [animation-delay:-9s]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="reveal inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-coral-text shadow-clay-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-solid" />
            </span>
            Open to new opportunities · {profile.location}
          </div>

          <h1 className="reveal mt-8 max-w-xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl [animation-delay:80ms]">
            Turning ambiguity into{" "}
            <span className="relative inline-block text-coral-text">
              <span className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-periwinkle/30" />
              shipped roadmaps
            </span>
            .
          </h1>

          <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-ink/70 [animation-delay:160ms]">
            I&apos;m {profile.name}, a {profile.role} building enterprise platforms where
            engineering, business, and AI actually meet in the backlog.
          </p>

          <div className="reveal mt-10 flex flex-wrap items-center gap-4 [animation-delay:240ms]">
            <a
              href="#journey"
              className="inline-flex items-center gap-2 rounded-full bg-coral-solid px-6 py-3 text-sm font-bold text-white shadow-clay transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-1 hover:shadow-clay-lg active:translate-y-0 active:shadow-clay-pressed"
            >
              See my journey →
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-ink shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 hover:shadow-clay active:translate-y-0 active:shadow-clay-pressed"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="reveal relative mx-auto aspect-square w-full max-w-md [animation-delay:200ms]">
          {/* future: rotating 3D photo element goes here */}
          <div className="h-full w-full rounded-full bg-surface shadow-clay-lg" />
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-6 sm:px-8">
        <div className="flex flex-wrap justify-center gap-3 rounded-3xl bg-surface/60 p-6 shadow-clay-sm">
          {marqueeItems.map((item) => (
            <span
              key={item}
              className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-clay-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
