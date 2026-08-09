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
    <section id="portfolio" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="Portfolio"
            title="Deep-dive case studies — landing soon."
            description="A full breakdown of the roadmaps, metrics, and delivery decisions behind the highlights above is in the works."
            accent="periwinkle"
          />
          <a
            href={profile.portfolio}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-bold text-ink shadow-clay-sm transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-0.5 hover:shadow-clay active:translate-y-0 active:shadow-clay-pressed"
          >
            Visit portfolio site →
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {teaserCards.map((card) => (
            <div
              key={card.title}
              className="group rounded-3xl bg-surface p-6 shadow-clay transition-[transform,box-shadow] duration-300 ease-bounce hover:-translate-y-1.5 hover:shadow-clay-lg"
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                <span className="rounded-full bg-surface-dim px-3 py-1 text-muted">{card.tag}</span>
                <span className="text-coral-text">{card.status}</span>
              </div>
              <p className="mt-6 font-display text-lg font-bold leading-snug text-ink">
                {card.title}
              </p>
              <div className="mt-8 h-2 w-full rounded-full bg-surface-dim">
                <div className="h-full w-1/3 rounded-full bg-coral transition-all duration-500 group-hover:w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
