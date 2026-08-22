import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
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
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Parallax speed={0.16} className="pointer-events-none absolute -left-24 top-8">
        <div className="h-72 w-72 rounded-full bg-[var(--brand-gold)]/10 blur-3xl" />
      </Parallax>
      <Parallax speed={-0.1} className="pointer-events-none absolute -right-16 bottom-0">
        <div className="h-56 w-56 rounded-full bg-[var(--brand-maroon)]/10 blur-3xl" />
      </Parallax>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            number="02"
            eyebrow="The Foundation"
            title="Education that respects how students actually learn"
            description="We combine rigorous academics with empathy — because sustainable excellence comes from clarity, not pressure alone."
            align="center"
            className="mb-16"
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.1}>
              <GlassCard interactive className="flex h-full flex-col gap-4 p-8">
                <span className="font-mono text-xs tracking-[0.2em] text-[var(--brand-gold)]">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{pillar.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
