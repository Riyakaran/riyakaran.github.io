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
    <section id="top" className="relative overflow-hidden border-b border-line pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[32rem] w-[32rem] animate-drift rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[26rem] w-[26rem] animate-drift rounded-full bg-accent-2/25 blur-[120px] [animation-delay:-9s]" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <div className="reveal flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Open to new opportunities · {profile.location}
        </div>

        <h1 className="reveal mt-8 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-paper sm:text-7xl [animation-delay:80ms]">
          Turning ambiguity into <span className="text-glow text-accent">shipped roadmaps</span>.
        </h1>

        <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-paper-dim [animation-delay:160ms]">
          I&apos;m {profile.name}, a {profile.role} building enterprise platforms where
          engineering, business, and AI actually meet in the backlog.
        </p>

        <div className="reveal mt-10 flex flex-wrap items-center gap-4 [animation-delay:240ms]">
          <a
            href="#journey"
            className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-transform hover:-translate-y-0.5"
          >
            See my journey →
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div className="relative mt-20 border-y border-line bg-ink-raised/60 py-4">
        <div className="flex overflow-hidden">
          <div className="flex w-max shrink-0 animate-marquee items-center gap-10 pr-10 font-mono text-sm uppercase tracking-[0.2em] text-muted">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                {item}
                <span className="text-accent">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
