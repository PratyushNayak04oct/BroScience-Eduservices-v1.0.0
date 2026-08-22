"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

export default function Magnetic({ children, className, strength = 18 }) {
  const ref = useRef(null);

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "translate3d(0, 0, 0)";
  };

  const onMove = (event) => {
    if (prefersReducedMotion()) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <div
      ref={ref}
      className={cn("inline-flex will-change-transform transition-transform duration-200 ease-out", className)}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
}
