"use client";

import { useEffect, useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

const flowSteps = [
  { label: "Question", description: "A doubt arises — in class, during practice, or late at night." },
  { label: "Analysis", description: "We identify whether it's conceptual, procedural, or application-based." },
  { label: "Expert Guidance", description: "Faculty or mentors respond with clear, step-by-step explanations." },
  { label: "Understanding", description: "The concept clicks. Related problems become approachable." },
  { label: "Progress", description: "Confidence builds. The next topic feels within reach." },
];

export default function DoubtSection() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    initGsap();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".doubt-step",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(107,29,38,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          number="04"
          eyebrow="The Clarity"
          title="From confusion to confidence."
          description="Our doubt-resolution flow is designed for real learning — not ticket queues."
          className="max-w-2xl"
        />

        {/* Animated flow line — desktop */}
        <div className="relative mt-20 hidden lg:block">
          <div
            ref={lineRef}
            className="absolute left-0 right-0 top-6 h-px origin-left bg-gradient-to-r from-[var(--brand-gold)] via-[var(--brand-maroon)]/40 to-[var(--brand-gold)]"
            aria-hidden="true"
          />
          <ol className="grid grid-cols-5 gap-6">
            {flowSteps.map((step, index) => (
              <li key={step.label} className="doubt-step relative pt-12">
                <span
                  className="absolute left-0 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--brand-gold)] bg-[var(--background)] text-[10px] font-mono text-[var(--brand-gold)]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--foreground)]">
                  {step.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Vertical flow — mobile/tablet */}
        <ol className="relative mt-16 space-y-0 lg:hidden">
          <div
            className="absolute bottom-4 left-3 top-4 w-px bg-gradient-to-b from-[var(--brand-gold)] via-[var(--brand-maroon)]/30 to-[var(--brand-gold)]"
            aria-hidden="true"
          />
          {flowSteps.map((step, index) => (
            <li key={step.label} className="doubt-step relative pl-10 pb-12 last:pb-0">
              <span
                className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--brand-gold)] bg-[var(--background)] text-[10px] font-mono text-[var(--brand-gold)]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--foreground)]">
                {step.label}
                {index < flowSteps.length - 1 && (
                  <span className="ml-2 text-[var(--brand-gold)]">→</span>
                )}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
