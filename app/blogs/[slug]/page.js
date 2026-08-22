import { notFound } from "next/navigation";
import Link from "next/link";
import { blogs } from "@/data/blogs";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import BlogCard from "@/components/blogs/BlogCard";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

export async function generateStaticParams() {
  return blogs.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = blogs.find((b) => b.slug === slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} — BroScience Eduservices`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = blogs.find((b) => b.slug === slug);
  if (!article) notFound();

  const related = blogs.filter((b) => b.slug !== slug && b.category === article.category).slice(0, 3);
  const fallbackRelated = blogs.filter((b) => b.slug !== slug).slice(0, 3);
  const relatedArticles = related.length > 0 ? related : fallbackRelated;

  const contentLines = article.content
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <article className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <header className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
              {article.category}
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)]">
              <span>{article.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.date}>
                {formatDate(article.date, { month: "long", day: "numeric", year: "numeric" })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime}</span>
            </div>
          </header>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 aspect-[21/9] max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand-maroon)]/30 to-[var(--brand-gold)]/20" />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="prose-custom mx-auto mt-12 max-w-3xl">
            <p className="text-lg leading-relaxed text-[var(--muted)]">{article.excerpt}</p>
            <div className="mt-8 flex flex-col gap-4">
              {contentLines.map((line, index) => {
                if (line.startsWith("- ")) {
                  return (
                    <p key={index} className="flex items-start gap-3 text-base leading-relaxed text-[var(--foreground)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-gold)]" />
                      {line.slice(2)}
                    </p>
                  );
                }
                return (
                  <p key={index} className="text-base leading-relaxed text-[var(--foreground)]">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-12 flex max-w-3xl items-center justify-between border-y border-[var(--border)] py-6">
            <p className="text-sm font-medium text-[var(--foreground)]">Share this article</p>
            <div className="flex gap-3">
              {["Twitter", "LinkedIn", "WhatsApp"].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)] transition-colors hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <GlassCard className="mx-auto mt-12 max-w-3xl p-8 text-center">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Ready to take the next step?
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Book a free counselling session and let our team help you choose the right program.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button href="/contact">Book Free Counselling</Button>
              <Button href="/courses" variant="secondary">
                Explore Courses
              </Button>
            </div>
          </GlassCard>
        </Reveal>

        <div className="mt-24">
          <Reveal>
            <SectionHeading
              eyebrow="Related"
              title="Continue reading"
              className="mb-10"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((relatedArticle, index) => (
              <Reveal key={relatedArticle.slug} delay={index * 0.06}>
                <BlogCard article={relatedArticle} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/blogs"
              className="text-sm font-medium text-[var(--brand-gold)] hover:underline"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
