"use client";

import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import { prefersReducedMotion } from "@/lib/gsap";

export default function FeatureTile({ feature, index }) {
  const shineRef = useRef(null);

  const onMove = (event) => {
    if (prefersReducedMotion()) return;
    const shine = shineRef.current;
    if (!shine) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    shine.style.opacity = "1";
    shine.style.background = `radial-gradient(340px circle at ${x}px ${y}px, rgba(212,160,23,0.14), transparent 52%)`;
  };

  const onLeave = () => {
    if (shineRef.current) shineRef.current.style.opacity = "0";
  };

  return (
    <Reveal delay={index * 0.05} className="h-full bg-[var(--background)]">
      <div
        className="group relative h-full overflow-hidden p-8 sm:p-10 transition-[background-color,transform] duration-500 hover:-translate-y-1 hover:bg-[var(--surface)]"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span
          ref={shineRef}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-x-8 top-0 h-px origin-left scale-x-0 bg-[var(--brand-gold)] transition-transform duration-500 group-hover:scale-x-100"
          aria-hidden="true"
        />
        <span className="relative font-mono text-xs tracking-[0.2em] text-[var(--brand-gold)]">
          {feature.number}
        </span>
        <h3 className="relative mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)]">
          {feature.title}
        </h3>
        <p className="relative mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {feature.description}
        </p>
      </div>
    </Reveal>
  );
}
