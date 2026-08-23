"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { stats } from "@/data/stats";
import { gsap, initGsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

function parseStatValue(value) {
  const match = value.match(/^([\d,.]+)(.*)$/);
  if (!match) return { number: 0, suffix: value, decimals: 0 };

  const numStr = match[1].replace(/,/g, "");
  const suffix = match[2];
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  return { number: parseFloat(numStr), suffix, decimals };
}

function AnimatedStat({ stat }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    initGsap();
    const { number, suffix, decimals } = parseStatValue(stat.value);

    if (prefersReducedMotion()) {
      setDisplay(stat.value);
      return;
    }

    const counter = { val: 0 };

    const tween = gsap.to(counter, {
      val: number,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        const formatted =
          decimals > 0
            ? counter.val.toFixed(decimals)
            : Math.round(counter.val).toLocaleString("en-IN");
        setDisplay(`${formatted}${suffix}`);
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [stat.value]);

  return (
    <article ref={ref} className="stat-item">
      <p className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl xl:text-7xl">
        {display}
      </p>
      <p className="mt-3 text-sm font-medium uppercase tracking-[0.15em] text-[var(--brand-gold)]">
        {stat.label}
      </p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
        {stat.description}
      </p>
    </article>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    initGsap();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 lg:py-40">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,168,77,0.05),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          number="07"
          eyebrow="The Proof"
          title="Figures we will replace with verified outcomes."
          description="The numbers below are placeholders for layout. They are not institutional claims."
          className="mb-16 lg:mb-24"
        />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat) => (
            <AnimatedStat key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
