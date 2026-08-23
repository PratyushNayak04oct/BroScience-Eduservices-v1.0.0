import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { resources } from "@/data/resources";

function getCategoryCounts() {
  const counts = {};
  for (const resource of resources) {
    counts[resource.category] = (counts[resource.category] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export default function LibraryPreview() {
  const categories = getCategoryCounts();

  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            number="08"
            eyebrow="The Knowledge"
            title="A digital library built for exam prep."
            description="Notes, formula sheets, previous year papers, and study tools — organised and accessible."
          />
          <Link
            href="/library"
            className="shrink-0 text-sm font-medium tracking-wide text-[var(--brand-gold)] transition-colors hover:text-[var(--foreground)]"
          >
            Browse library →
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={index * 0.06}>
              <Link
                href="/library"
                className="group flex items-center justify-between border-b border-[var(--border)] py-6 transition-all duration-300 hover:translate-x-1 hover:border-[var(--brand-gold)]"
              >
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-gold)]">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {category.count} resource{category.count !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="font-mono text-xs text-[var(--muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--brand-gold)]">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12">
          <p className="text-sm text-[var(--muted)]">
            {resources.filter((r) => r.isFree).length} free resources available ·{" "}
            {resources.length} total in library
          </p>
        </Reveal>
      </div>
    </section>
  );
}
