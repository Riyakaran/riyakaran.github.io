type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  accent?: "coral" | "periwinkle";
};

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  accent = "coral",
}: SectionHeadingProps) {
  const accentText = accent === "coral" ? "text-coral-text" : "text-periwinkle-text";

  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <div
        className={`inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-clay-sm ${accentText}`}
      >
        {kicker}
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink/70">{description}</p>
      ) : null}
    </div>
  );
}
