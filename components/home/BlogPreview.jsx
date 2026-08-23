import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { blogs } from "@/data/blogs";
import { formatDate } from "@/lib/utils";

export default function BlogPreview() {
  const [featured, ...supporting] = blogs;

  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="From the Blog"
            title="Insights for students and parents."
            description="Exam strategies, study tips, and career guidance from our editorial team."
          />
          <Link
            href="/blogs"
            className="shrink-0 text-sm font-medium tracking-wide text-[var(--brand-gold)] transition-colors hover:text-[var(--foreground)]"
          >
            All articles →
          </Link>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Featured article */}
          <Reveal className="lg:col-span-7">
            <Link href={`/blogs/${featured.slug}`} className="group block">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--brand-gold)]/5 to-[var(--brand-maroon)]/5 transition-transform duration-700 group-hover:-translate-y-1">
                <div className="flex h-full flex-col justify-end p-8 sm:p-10">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                    {featured.category}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-gold)] sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                    {featured.excerpt}
                  </p>
                  <p className="mt-6 text-xs text-[var(--muted)]">
                    {formatDate(featured.date)} · {featured.readingTime}
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Supporting articles */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {supporting.slice(0, 3).map((blog, index) => (
              <Reveal key={blog.slug} delay={index * 0.08}>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="group block border-b border-[var(--border)] pb-6 transition-all duration-300 hover:translate-x-1 hover:border-[var(--brand-gold)]"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand-gold)]">
                    {blog.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-gold)]">
                    {blog.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                    {blog.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    {formatDate(blog.date)} · {blog.readingTime}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
