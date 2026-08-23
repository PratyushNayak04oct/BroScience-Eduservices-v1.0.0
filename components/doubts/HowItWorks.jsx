import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    step: "01",
    title: "Submit Your Doubt",
    description:
      "Post your question through the portal or the form below — include the topic, your attempt, and where you're stuck.",
  },
  {
    step: "02",
    title: "Faculty Review",
    description:
      "Subject experts review your doubt and prepare a clear, step-by-step explanation tailored to your level.",
  },
  {
    step: "03",
    title: "Get Your Answer",
    description:
      "Receive a written solution, video explanation, or invitation to a live doubt session — usually within 24 hours.",
  },
  {
    step: "04",
    title: "Follow Up Freely",
    description:
      "Still unclear? Ask follow-up questions until the concept clicks. That's what we're here for.",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {steps.map((item, index) => (
        <Reveal key={item.step} delay={index * 0.08}>
          <GlassCard interactive intensity={0.7} className="flex h-full gap-5 p-6">
            <span className="font-mono text-sm tracking-[0.2em] text-[var(--brand-gold)]">
              {item.step}
            </span>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
            </div>
          </GlassCard>
        </Reveal>
      ))}
    </div>
  );
}
