"use client";

import { useEffect, useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

const mentorshipPillars = [
  {
    title: "Study Planning",
    description: "Personalised weekly schedules balancing school, coaching, and self-study.",
    metric: "12 hrs",
    metricLabel: "avg. weekly plan",
  },
  {
    title: "Progress Reviews",
    description: "Fortnightly check-ins analysing test scores, attendance, and weak topics.",
    metric: "2×",
    metricLabel: "monthly reviews",
  },
  {
    title: "Exam Strategy",
    description: "Mock test analysis, time management drills, and section-wise attempt plans.",
    metric: "50+",
    metricLabel: "mock tests/year",
  },
  {
    title: "Academic Goals",
    description: "Short-term milestones mapped to long-term targets — boards, JEE, NEET, or beyond.",
    metric: "100%",
    metricLabel: "goal alignment",
  },
];

export default function MentorshipSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    initGsap();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mentor-step",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".mentor-dashboard",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              number="05"
              eyebrow="The Guidance"
              title="Mentorship that keeps you on track."
              description="Every long-term program includes a dedicated mentor — for planning, accountability, and honest feedback."
            />

            <ol className="relative mt-14 space-y-0">
              <div
                className="absolute bottom-6 left-[7px] top-6 w-px bg-[var(--border-strong)]"
                aria-hidden="true"
              />
              {mentorshipPillars.map((pillar, index) => (
                <li key={pillar.title} className="mentor-step relative pb-10 pl-8 last:pb-0">
                  <span
                    className="absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--brand-gold)] bg-[var(--background)]"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                      {pillar.title}
                    </h3>
                    <span className="font-mono text-xs text-[var(--brand-gold)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                    {pillar.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Dashboard-inspired visual */}
          <div className="mentor-dashboard lg:pt-16">
            <GlassCard className="overflow-hidden p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
                    Student Dashboard
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                    Progress Overview
                  </p>
                </div>
                <span className="rounded-full bg-[var(--brand-gold)]/10 px-3 py-1 text-xs font-medium text-[var(--brand-gold)]">
                  On Track
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {mentorshipPillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-xl border border-[var(--border)] p-4"
                  >
                    <p className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                      {pillar.metric}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{pillar.metricLabel}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Weekly completion</span>
                  <span className="font-medium text-[var(--foreground)]">78%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                  <div className="h-full w-[78%] rounded-full bg-[var(--brand-gold)]" />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Mock test accuracy</span>
                  <span className="font-medium text-[var(--foreground)]">84%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                  <div className="h-full w-[84%] rounded-full bg-[var(--brand-maroon)]" />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
