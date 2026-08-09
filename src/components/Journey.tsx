import SectionHeading from "@/components/SectionHeading";
import { experience } from "@/data/resume";

export default function Journey() {
  return (
    <section id="journey" className="border-b border-line bg-ink-raised/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Career Journey"
          title="Five years, one company, an increasingly wide remit."
          description="From backend delivery on payments infrastructure to owning the most critical module on an enterprise mobility platform — here's the path."
        />

        <ol className="mt-16 border-l border-line">
          {experience.map((role, i) => (
            <li key={`${role.title}-${role.start}`} className="relative pb-16 pl-10 last:pb-0 sm:pl-14">
              <span
                className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                  role.current
                    ? "border-accent bg-accent shadow-[0_0_0_4px_rgba(214,255,63,0.15)]"
                    : "border-line-strong bg-ink"
                }`}
              />

              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="font-display text-xl font-bold text-paper sm:text-2xl">
                  {role.title}
                </h3>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  {role.start} — {role.end}
                </span>
              </div>

              <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                {role.company} · {role.context}
              </p>

              <ul className="mt-5 space-y-3">
                {role.highlights.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-paper-dim">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-dim" />
                    {point}
                  </li>
                ))}
              </ul>

              <span className="absolute -left-16 top-0 hidden font-mono text-4xl font-bold text-line-strong sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
