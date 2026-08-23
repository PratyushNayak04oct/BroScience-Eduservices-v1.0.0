"use client";

import { useRef } from "react";
import { canFinePointer, cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

export default function GlassCard({
  children,
  className,
  interactive = false,
  intensity = 1,
  as: Component = "div",
  ...props
}) {
  const ref = useRef(null);
  const shineRef = useRef(null);

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transition =
      "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease";
    node.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    node.style.boxShadow = "";
    if (shineRef.current) shineRef.current.style.opacity = "0";
  };

  const onMove = (event) => {
    if (!interactive || prefersReducedMotion() || !canFinePointer()) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -8 * intensity;
    const ry = (px - 0.5) * 10 * intensity;
    node.style.transition = "transform 0.1s ease-out, box-shadow 0.2s ease";
    node.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${-6 * intensity}px)`;
    node.style.boxShadow = "0 22px 48px rgba(10, 10, 10, 0.12)";
    if (shineRef.current) {
      shineRef.current.style.opacity = "1";
      shineRef.current.style.background = `radial-gradient(520px circle at ${px * 100}% ${py * 100}%, rgba(212,160,23,0.22), transparent 44%)`;
    }
  };

  return (
    <Component
      ref={ref}
      className={cn(
        "glass-panel relative max-w-full overflow-hidden rounded-sm will-change-transform",
        interactive && "group/card",
        className
      )}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...props}
    >
      <span
        ref={shineRef}
        className="pointer-events-none absolute inset-0 z-[2] opacity-0 mix-blend-soft-light transition-opacity duration-300"
        aria-hidden="true"
      />
      {interactive && (
        <span
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-px origin-left scale-x-0 bg-[var(--brand-gold)] transition-transform duration-500 group-hover/card:scale-x-100"
          aria-hidden="true"
        />
      )}
      {children}
    </Component>
  );
}
