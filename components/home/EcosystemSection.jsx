import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { courses } from "@/data/courses";
import { products } from "@/data/products";
import { blogs } from "@/data/blogs";
import { formatPrice } from "@/lib/utils";

export default function EcosystemSection() {
  const featuredCourses = courses.slice(0, 3);
  const featuredProducts = products.slice(0, 3);
  const featuredBlogs = blogs.slice(0, 3);

  return (
    <section className="relative border-t border-[var(--border)] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          number="09"
          eyebrow="The Ecosystem"
          title="Courses, resources, and insights — connected."
          description="Everything you need for academic excellence, in one place."
          className="mb-16 lg:mb-20"
        />

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Courses */}
          <Reveal>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                  Courses
                </h3>
                <Link
                  href="/courses"
                  className="text-xs text-[var(--muted)] transition-all duration-300 hover:translate-x-0.5 hover:text-[var(--foreground)]"
                >
                  View all →
                </Link>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-4">
                {featuredCourses.map((course) => (
                  <li key={course.slug}>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="group block border-b border-[var(--border)] pb-4 transition-all duration-300 hover:translate-x-1 hover:border-[var(--brand-gold)]"
                    >
                      <p className="text-sm font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--brand-gold)]">
                        {course.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {course.category} · {course.mode} · {course.duration}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Marketplace */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                  Marketplace
                </h3>
                <Link
                  href="/marketplace"
                  className="text-xs text-[var(--muted)] transition-all duration-300 hover:translate-x-0.5 hover:text-[var(--foreground)]"
                >
                  Shop all →
                </Link>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-4">
                {featuredProducts.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/marketplace/${product.slug}`}
                      className="group block border-b border-[var(--border)] pb-4 transition-all duration-300 hover:translate-x-1 hover:border-[var(--brand-gold)]"
                    >
                      <p className="text-sm font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--brand-gold)]">
                        {product.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {product.category} · {formatPrice(product.price)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Blogs */}
          <Reveal delay={0.2}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                  Blogs
                </h3>
                <Link
                  href="/blogs"
                  className="text-xs text-[var(--muted)] transition-all duration-300 hover:translate-x-0.5 hover:text-[var(--foreground)]"
                >
                  Read more →
                </Link>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-4">
                {featuredBlogs.map((blog) => (
                  <li key={blog.slug}>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="group block border-b border-[var(--border)] pb-4 transition-all duration-300 hover:translate-x-1 hover:border-[var(--brand-gold)]"
                    >
                      <p className="text-sm font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--brand-gold)]">
                        {blog.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {blog.category} · {blog.readingTime}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
