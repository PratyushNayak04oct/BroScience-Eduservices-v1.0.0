import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import HowItWorks from "@/components/doubts/HowItWorks";
import DoubtForm from "@/components/doubts/DoubtForm";
import Reveal from "@/components/ui/Reveal";

const features = [
  "24-hour faculty response guarantee on portal doubts",
  "Live group doubt marathons before major exams",
  "One-on-one sessions for premium batch students",
  "Video explanations for complex problem types",
  "Follow-up questions until the concept is clear",
  "Access to a searchable archive of past doubts",
];

export const metadata = {
  title: "Doubt Solving — BroScience Eduservices",
  description:
    "Get your academic doubts resolved by expert faculty. Submit questions online and receive clear, step-by-step explanations.",
};

export default function DoubtsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Doubt Solving"
            title="Every question deserves a clear answer"
            description="Stuck on a concept? Our doubt-solving ecosystem connects you with subject experts who explain until you understand — not just until the clock runs out."
            className="mb-16"
          />
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">
                Why students trust our doubt support
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <GlassCard interactive intensity={0.55} className="p-6 sm:p-8">
                <ul className="flex flex-col gap-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-gold)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <GlassCard className="p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">Submit a Doubt</h2>
              <DoubtForm />
            </GlassCard>
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal>
            <SectionHeading
              eyebrow="Process"
              title="How it works"
              description="From submission to resolution — a simple, transparent process designed for busy students."
              align="center"
              className="mb-12"
            />
          </Reveal>
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
