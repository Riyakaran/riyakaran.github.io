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
      <div className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wide text-accent shadow-rest">
        {kicker}
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold text-neutral-900">{title}</h2>
      {description ? (
        <p className="mt-4 max-w-prose text-base text-neutral-600">{description}</p>
      ) : null}
    </div>
  );
}
