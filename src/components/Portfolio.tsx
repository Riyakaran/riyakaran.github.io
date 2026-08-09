import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/resume";

const teaserCards = [
  {
    tag: "Case study",
    title: "Cutting a North Star metric 83% with an ADR-backed rebuild",
    status: "In progress",
  },
  {
    tag: "Case study",
    title: "Standing up Copilot agents that cut scrum overhead in half",
    status: "In progress",
  },
  {
    tag: "Write-up",
    title: "Prioritizing a B2B backlog with WSJF, live client feedback loops",
    status: "Drafting",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="border-b border-line bg-ink-raised/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="Portfolio"
            title="Deep-dive case studies — landing soon."
            description="A full breakdown of the roadmaps, metrics, and delivery decisions behind the highlights above is in the works."
          />
          <a
            href={profile.portfolio}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 border border-line-strong px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-accent hover:text-accent"
          >
            Visit portfolio site →
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {teaserCards.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden border border-line bg-ink-card p-6 transition-colors hover:border-accent/60"
            >
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="text-muted">{card.tag}</span>
                <span className="text-accent">{card.status}</span>
              </div>
              <p className="mt-6 font-display text-lg font-bold leading-snug text-paper">
                {card.title}
              </p>
              <div className="mt-8 h-px w-full bg-line">
                <div className="h-full w-1/3 bg-accent transition-all duration-500 group-hover:w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
