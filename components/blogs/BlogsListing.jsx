"use client";

import { useMemo, useState } from "react";
import { blogs } from "@/data/blogs";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "@/components/blogs/BlogCard";
import FeaturedArticle from "@/components/blogs/FeaturedArticle";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

const categories = ["All", ...new Set(blogs.map((b) => b.category))];

export default function BlogsListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const featured = blogs[0];

  const filtered = useMemo(() => {
    const rest = blogs.slice(1);
    if (selectedCategory === "All") return rest;
    return rest.filter((article) => article.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Blog"
            title="Insights for students and parents"
            description="Exam strategies, study tips, career guidance, and academic advice from our team."
            className="mb-16"
          />
        </Reveal>

        <Reveal>
          <FeaturedArticle article={featured} />
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.96]",
                selectedCategory === category
                  ? "border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--brand-gold)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.04}>
              <BlogCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
