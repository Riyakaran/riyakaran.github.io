import { ArrowUpRight } from "lucide-react";
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
    <section id="portfolio" className="bg-neutral-100 py-16">
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
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-neutral-900 shadow-rest transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
          >
            Visit portfolio site
            <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {teaserCards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-surface p-6 shadow-rest">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">{card.tag}</span>
                <span className="text-accent">{card.status}</span>
              </div>
              <p className="mt-6 font-display text-lg font-bold text-neutral-900">{card.title}</p>
              <div className="mt-8 h-2 w-full rounded-full bg-neutral-100">
                <div className="h-full w-1/3 rounded-full bg-accent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
