import { cn } from "@/lib/utils";

export default function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) {
  const alignments = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
  };

  return (
    <header className={cn("flex max-w-3xl flex-col gap-6", alignments[align], className)}>
      {(number || eyebrow) && (
        <div className="flex items-center gap-4">
          {number && (
            <span className="font-mono text-xs tracking-[0.2em] text-[var(--brand-gold)]">
              {number}
            </span>
          )}
          {number && eyebrow && (
            <span className="h-px w-8 bg-[var(--border-strong)]" aria-hidden="true" />
          )}
          {eyebrow && (
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--muted)]">
              {eyebrow}
            </span>
          )}
        </div>
      )}

      {title && (
        <h2 className="group/heading font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-medium leading-[1.12] tracking-tight text-[var(--foreground)]">
          {title}
          <span
            className="mt-4 block h-px w-10 bg-[var(--brand-gold)] transition-all duration-500 group-hover/heading:w-16"
            aria-hidden="true"
          />
        </h2>
      )}

      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {description}
        </p>
      )}
    </header>
  );
}
