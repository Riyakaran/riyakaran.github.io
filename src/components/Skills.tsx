import SectionHeading from "@/components/SectionHeading";
import { certifications, education, skillGroups } from "@/data/resume";

export default function Skills() {
  return (
    <section id="skills" className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Toolkit"
          title="What I bring to the table."
          description="A blend built for enterprise delivery: strategy and stakeholder craft on one side, data and platform fluency on the other."
        />

        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-accent">{group.label}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-neutral-200 bg-surface px-3 py-1.5 text-sm font-semibold text-neutral-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface p-6 shadow-rest">
            <h3 className="text-xs font-bold uppercase tracking-wide text-accent">Education</h3>
            <p className="mt-4 font-display text-lg font-bold text-neutral-900">{education.degree}</p>
            <p className="mt-1 text-sm text-neutral-600">{education.school}</p>
            <p className="mt-1 text-xs text-neutral-600">
              {education.date} · {education.detail}
            </p>
          </div>

          <div className="rounded-2xl bg-surface p-6 shadow-rest">
            <h3 className="text-xs font-bold uppercase tracking-wide text-accent">Certifications</h3>
            <ul className="mt-4 space-y-3">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <p className="font-display text-lg font-bold text-neutral-900">{cert.name}</p>
                  <p className="text-sm text-neutral-600">{cert.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
