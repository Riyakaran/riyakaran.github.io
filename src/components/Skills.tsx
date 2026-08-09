import SectionHeading from "@/components/SectionHeading";
import { certifications, education, skillGroups } from "@/data/resume";

export default function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Toolkit"
          title="What I bring to the table."
          description="A blend built for enterprise delivery: strategy and stakeholder craft on one side, data and platform fluency on the other."
          accent="periwinkle"
        />

        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, gi) => {
            const hoverBg = gi % 2 === 0 ? "hover:bg-coral-solid" : "hover:bg-periwinkle-solid";
            return (
              <div key={group.label}>
                <h3 className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-periwinkle-text shadow-clay-sm">
                  {group.label}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full bg-surface px-3 py-1.5 text-sm font-semibold text-ink shadow-clay-sm transition-[transform,box-shadow,background-color,color] duration-300 ease-bounce hover:-translate-y-0.5 hover:text-white hover:shadow-clay active:translate-y-0 active:shadow-clay-pressed ${hoverBg}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-surface p-6 shadow-clay-sm">
            <h3 className="inline-flex rounded-full bg-surface-dim px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral-text">
              Education
            </h3>
            <p className="mt-4 font-display text-lg font-bold text-ink">{education.degree}</p>
            <p className="mt-1 text-sm text-muted">{education.school}</p>
            <p className="mt-1 text-xs text-muted">
              {education.date} · {education.detail}
            </p>
          </div>

          <div className="rounded-3xl bg-surface p-6 shadow-clay-sm">
            <h3 className="inline-flex rounded-full bg-surface-dim px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral-text">
              Certifications
            </h3>
            <ul className="mt-4 space-y-3">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <p className="font-display text-lg font-bold text-ink">{cert.name}</p>
                  <p className="text-sm text-muted">{cert.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
