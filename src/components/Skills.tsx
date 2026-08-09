import SectionHeading from "@/components/SectionHeading";
import { certifications, education, skillGroups } from "@/data/resume";

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Toolkit"
          title="What I bring to the table."
          description="A blend built for enterprise delivery: strategy and stakeholder craft on one side, data and platform fluency on the other."
        />

        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {group.label}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="border border-line-strong px-3 py-1.5 text-sm text-paper-dim transition-colors hover:border-accent hover:text-paper"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-8 border-t border-line pt-16 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Education</h3>
            <p className="mt-4 font-display text-lg font-bold text-paper">{education.degree}</p>
            <p className="mt-1 text-sm text-paper-dim">{education.school}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              {education.date} · {education.detail}
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Certifications
            </h3>
            <ul className="mt-4 space-y-3">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <p className="font-display text-lg font-bold text-paper">{cert.name}</p>
                  <p className="text-sm text-paper-dim">{cert.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
