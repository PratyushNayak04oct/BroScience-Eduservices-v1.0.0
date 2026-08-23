import GlassCard from "@/components/ui/GlassCard";

export default function ResourceCard({ resource }) {
  return (
    <GlassCard interactive className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
          {resource.category}
        </span>
        <span className="text-xs font-medium text-[var(--brand-gold)]">
          {resource.isFree ? "Free" : "Premium"}
        </span>
      </div>

      <h3 className="font-semibold leading-snug text-[var(--foreground)]">{resource.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">
        {resource.description}
      </p>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        <span>
          {resource.subject} · Class {resource.class}
        </span>
        <span>{resource.fileSize}</span>
      </div>

      <button
        type="button"
        className="w-full rounded-full border border-[var(--border-strong)] py-2.5 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] hover:scale-[1.01] active:scale-[0.98]"
      >
        {resource.isFree ? "Download Free" : "Unlock Resource"}
      </button>
    </GlassCard>
  );
}
