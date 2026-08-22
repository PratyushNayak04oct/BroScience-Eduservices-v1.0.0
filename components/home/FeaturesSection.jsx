import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { features } from "@/data/features";

export default function FeaturesSection() {
  return (
    <section className="relative border-y border-[var(--border)] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          number="06"
          eyebrow="The Platform"
          title="Everything a serious student needs."
          description="Nine pillars of our learning ecosystem — integrated, not bolted on."
          className="mb-16 lg:mb-20"
        />

        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal
              key={feature.id}
              delay={index * 0.05}
              className="bg-[var(--background)] p-8 sm:p-10 transition-colors duration-500 hover:bg-[var(--surface)]"
            >
              <span className="font-mono text-xs tracking-[0.2em] text-[var(--brand-gold)]">
                {feature.number}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
