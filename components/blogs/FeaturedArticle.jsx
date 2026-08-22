import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function FeaturedArticle({ article }) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="aspect-[16/10] bg-gradient-to-br from-[var(--brand-maroon)]/30 to-[var(--brand-gold)]/20 lg:aspect-auto lg:min-h-[360px]" />
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
            Featured · {article.category}
          </span>
          <h2 className="text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
            {article.title}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span>{article.author}</span>
            <span>·</span>
            <span>
              {formatDate(article.date, { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span>·</span>
            <span>{article.readingTime}</span>
          </div>
          <div>
            <Button href={`/blogs/${article.slug}`}>Read Article</Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
