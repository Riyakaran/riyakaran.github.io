import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/resume";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[40rem] -translate-x-1/2 animate-drift rounded-full bg-periwinkle/15 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          kicker="Contact"
          title="Let's build the next roadmap together."
          description="Open to product, program, and delivery leadership conversations. The fastest way to reach me is email."
        />

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-coral-solid px-6 py-3 text-sm font-bold text-white shadow-clay transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-1 hover:shadow-clay-lg active:translate-y-0 active:shadow-clay-pressed"
          >
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-ink shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 hover:shadow-clay active:translate-y-0 active:shadow-clay-pressed"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.resumeFile}
            download
            className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-ink shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 hover:shadow-clay active:translate-y-0 active:shadow-clay-pressed"
          >
            Download Resume ↓
          </a>
        </div>

        <div className="mt-24 flex flex-col gap-2 border-t border-line-soft pt-8 text-xs font-semibold text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {profile.name}. Built with Next.js.
          </span>
          <span>{profile.location}</span>
        </div>
      </div>
    </section>
  );
}
