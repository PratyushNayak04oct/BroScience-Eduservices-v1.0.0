import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";

export default function BlogCard({ article }) {
  return (
    <Link href={`/blogs/${article.slug}`}>
      <GlassCard interactive className="group flex h-full flex-col gap-4 p-6">
        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-[var(--brand-maroon)]/25 to-[var(--brand-gold)]/15 transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand-gold)]">
          {article.category}
        </span>
        <h3 className="font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--brand-gold)]">
          {article.title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
          <span>{article.author}</span>
          <span>
            {formatDate(article.date, { month: "short", day: "numeric", year: "numeric" })} ·{" "}
            {article.readingTime}
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
