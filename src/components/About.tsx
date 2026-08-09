import SectionHeading from "@/components/SectionHeading";
import { profile, stats } from "@/data/resume";

export default function About() {
  return (
    <section id="about" className="bg-neutral-50 py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-2xl bg-surface p-8 shadow-rest sm:p-10">
            <SectionHeading kicker="About" title="Product ownership, with an engineer's instincts." />
            <p className="mt-8 max-w-prose text-lg text-neutral-900">{profile.summary}</p>
            <p className="mt-6 max-w-prose text-base text-neutral-600">{profile.interest}</p>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-neutral-600">Based in</dt>
                <dd className="mt-2 text-sm text-neutral-900">{profile.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-neutral-600">Certified</dt>
                <dd className="mt-2 text-sm text-neutral-900">CSPO · Azure Fundamentals</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-neutral-600">Focus</dt>
                <dd className="mt-2 text-sm text-neutral-900">B2B enterprise &amp; BFSI</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-surface p-6 shadow-rest">
                <div className="font-display text-3xl font-bold text-accent">{stat.value}</div>
                <div className="mt-2 text-xs text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
