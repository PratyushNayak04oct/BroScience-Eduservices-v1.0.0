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
    <header className={cn("flex min-w-0 max-w-3xl flex-col gap-5 sm:gap-6", alignments[align], className)}>
      {(number || eyebrow) && (
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          {number && (
            <span className="font-mono text-xs tracking-[0.16em] text-[var(--brand-gold)] sm:tracking-[0.2em]">
              {number}
            </span>
          )}
          {number && eyebrow && (
            <span className="h-px w-6 bg-[var(--border-strong)] sm:w-8" aria-hidden="true" />
          )}
          {eyebrow && (
            <span className="min-w-0 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)] sm:tracking-[0.25em]">
              {eyebrow}
            </span>
          )}
        </div>
      )}

      {title && (
        <h2 className="group/heading font-display text-[clamp(1.85rem,7vw,3.75rem)] font-medium leading-[1.12] tracking-tight text-[var(--foreground)]">
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
