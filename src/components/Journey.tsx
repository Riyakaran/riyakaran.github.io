import SectionHeading from "@/components/SectionHeading";
import { experience } from "@/data/resume";

export default function Journey() {
  return (
    <section id="journey" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Career Journey"
          title="Five years, one company, an increasingly wide remit."
          description="From backend delivery on payments infrastructure to owning the most critical module on an enterprise mobility platform — here's the path."
        />

        <ol className="relative mt-16">
          <div className="pointer-events-none absolute left-0 top-2 bottom-2 w-1.5 rounded-full bg-white/70 shadow-[inset_1px_1px_4px_rgba(46,42,61,0.18)]" />

          {experience.map((role, i) => (
            <li key={`${role.title}-${role.start}`} className="relative pb-8 pl-10 last:pb-0 sm:pl-14">
              <span
                className={`absolute -left-[9px] top-1 h-6 w-6 rounded-full shadow-clay-sm ${
                  role.current ? "bg-coral-solid" : "bg-periwinkle/40"
                }`}
              >
                {role.current && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-coral opacity-60" />
                )}
              </span>

              <span className="absolute -left-14 top-0 hidden font-display text-4xl font-bold text-periwinkle/15 sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative rounded-3xl bg-surface p-6 shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-1 hover:shadow-clay sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                    {role.title}
                  </h3>
                  <span className="rounded-full bg-periwinkle/15 px-3 py-1 text-xs font-bold text-periwinkle-text">
                    {role.start} — {role.end}
                  </span>
                </div>

                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {role.company} · {role.context}
                </p>

                <ul className="mt-5 space-y-3">
                  {role.highlights.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
