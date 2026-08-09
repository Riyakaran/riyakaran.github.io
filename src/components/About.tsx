import SectionHeading from "@/components/SectionHeading";
import { profile, stats } from "@/data/resume";

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-3xl bg-surface p-8 shadow-clay sm:p-10">
            <SectionHeading kicker="About" title="Product ownership, with an engineer's instincts." />
            <p className="mt-8 text-lg leading-relaxed text-ink">{profile.summary}</p>
            <p className="mt-6 text-base leading-relaxed text-muted">{profile.interest}</p>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line-soft pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-muted">Based in</dt>
                <dd className="mt-2 text-sm text-ink">{profile.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-muted">Certified</dt>
                <dd className="mt-2 text-sm text-ink">CSPO · Azure Fundamentals</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-muted">Focus</dt>
                <dd className="mt-2 text-sm text-ink">B2B enterprise &amp; BFSI</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-surface p-6 shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-1 hover:shadow-clay"
              >
                <div
                  className={`font-display text-3xl font-bold sm:text-4xl ${
                    i % 2 === 0 ? "text-coral-text" : "text-periwinkle-text"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="mt-2 text-xs leading-snug text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
