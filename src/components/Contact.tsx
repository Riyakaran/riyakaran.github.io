import { ArrowUpRight, Download, Mail } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/resume";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="bg-neutral-50 py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Contact"
          title="Let's build the next roadmap together."
          description="Open to product, program, and delivery leadership conversations. The fastest way to reach me is email."
        />

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
          >
            <Mail className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-neutral-900 shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
          >
            LinkedIn
            <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          </a>
          <a
            href={profile.resumeFile}
            download
            className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-neutral-900 shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
          >
            Download Resume
            <Download className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-24 flex flex-col gap-2 border-t border-neutral-200 pt-8 text-xs font-semibold text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {profile.name}. Built with Next.js.
          </span>
          <span>{profile.location}</span>
        </div>
      </div>
    </section>
  );
}
