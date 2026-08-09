type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
        <span className="h-px w-8 bg-accent" />
        {kicker}
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-paper-dim">{description}</p>
      ) : null}
    </div>
  );
}
