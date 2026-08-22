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
    <header className={cn("flex max-w-3xl flex-col gap-4", alignments[align], className)}>
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
        <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
          {title}
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
