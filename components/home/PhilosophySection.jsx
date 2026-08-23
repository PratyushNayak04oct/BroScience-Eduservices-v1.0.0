import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

const pillars = [
  {
    title: "Concept First",
    description:
      "We build deep understanding before speed — so students can solve unfamiliar problems with confidence.",
  },
  {
    title: "Consistent Practice",
    description:
      "Weekly tests, worksheets, and revision cycles keep learning active, not passive.",
  },
  {
    title: "Mentored Growth",
    description:
      "Every long-term learner gets guidance on study habits, test analysis, and exam strategy.",
  },
];

export default function PhilosophySection() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-40 lg:py-48">
      <Parallax speed={0.12} className="pointer-events-none absolute -left-24 top-16">
        <div className="h-72 w-72 rounded-full bg-[var(--brand-gold)]/8 blur-3xl" />
      </Parallax>
      <Parallax speed={-0.08} className="pointer-events-none absolute -right-16 bottom-8">
        <div className="h-56 w-56 rounded-full bg-[var(--brand-maroon)]/8 blur-3xl" />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-28">
          <Reveal>
            <SectionHeading
              number="02"
              eyebrow="The Foundation"
              title="Education that respects how students actually learn"
              description="We combine rigorous academics with empathy — because sustainable excellence comes from clarity, not pressure alone."
            />
            <p className="mt-12 max-w-xl font-display text-2xl leading-snug text-[var(--foreground)] sm:text-3xl">
              Knowledge, then direction. Discipline after that. The future follows.
            </p>
          </Reveal>

          <ol className="space-y-14 lg:pt-4">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.1}>
                <li className="border-t border-[var(--border)] pt-8">
                  <span className="font-mono text-xs tracking-[0.22em] text-[var(--brand-gold)]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-[var(--foreground)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--muted)]">
                    {pillar.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
