import SectionHeading from "@/components/SectionHeading";
import { experience } from "@/data/resume";

export default function Journey() {
  return (
    <section id="journey" className="bg-neutral-100 py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Career Journey"
          title="Five years, one company, an increasingly wide remit."
          description="From backend delivery on payments infrastructure to owning the most critical module on an enterprise mobility platform — here's the path."
        />

        <div className="relative mt-16">
          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-neutral-200" />

          <ol>
            {experience.map((role, i) => (
              <li key={`${role.title}-${role.start}`} className="relative pb-6 pl-10 last:pb-0 sm:pl-14">
                <span
                  className={`absolute -left-2 top-1 h-5 w-5 rounded-full border-4 border-neutral-100 ${
                    role.current ? "bg-accent" : "bg-neutral-300"
                  }`}
                >
                  {role.current && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                  )}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute -left-14 top-0 hidden font-display text-5xl font-bold text-neutral-200 sm:block"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative rounded-2xl bg-surface p-6 shadow-rest sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="font-display text-2xl font-bold text-neutral-900">{role.title}</h3>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
                      {role.start} — {role.end}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    {role.company} · {role.context}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {role.highlights.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-neutral-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
