import SectionHeading from "@/components/SectionHeading";
import { profile, stats } from "@/data/resume";

export default function About() {
  return (
    <section id="about" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading kicker="About" title="Product ownership, with an engineer's instincts." />
            <p className="mt-8 text-lg leading-relaxed text-paper">{profile.summary}</p>
            <p className="mt-6 text-base leading-relaxed text-paper-dim">{profile.interest}</p>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Based in</dt>
                <dd className="mt-2 text-sm text-paper">{profile.location}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Certified</dt>
                <dd className="mt-2 text-sm text-paper">CSPO · Azure Fundamentals</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Focus</dt>
                <dd className="mt-2 text-sm text-paper">B2B enterprise &amp; BFSI</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group bg-ink-card px-6 py-8 transition-colors hover:bg-ink-raised"
              >
                <div className="font-display text-3xl font-bold text-accent sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs leading-snug text-paper-dim">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
