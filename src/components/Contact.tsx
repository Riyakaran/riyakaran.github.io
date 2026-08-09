import { profile } from "@/data/resume";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[40rem] -translate-x-1/2 animate-drift rounded-full bg-accent/15 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
          <span className="h-px w-8 bg-accent" />
          Contact
        </div>

        <h2 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-paper sm:text-6xl">
          Let&apos;s build the next roadmap together.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-dim">
          Open to product, program, and delivery leadership conversations. The fastest way to reach
          me is email.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-transform hover:-translate-y-0.5"
          >
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.resumeFile}
            download
            className="inline-flex items-center gap-2 border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent"
          >
            Download Resume ↓
          </a>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-line pt-8 font-mono text-xs uppercase tracking-[0.15em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {profile.name}. Built with Next.js.
          </span>
          <span>{profile.location}</span>
        </div>
      </div>
    </section>
  );
}
