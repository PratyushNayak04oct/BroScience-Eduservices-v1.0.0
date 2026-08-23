"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

export default function Magnetic({ children, className, strength = 14 }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const tick = () => {
    const node = ref.current;
    if (!node) return;
    current.current.x += (target.current.x - current.current.x) * 0.18;
    current.current.y += (target.current.y - current.current.y) * 0.18;
    node.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
    if (
      Math.abs(target.current.x - current.current.x) > 0.08 ||
      Math.abs(target.current.y - current.current.y) > 0.08
    ) {
      frame.current = requestAnimationFrame(tick);
    } else {
      frame.current = 0;
    }
  };

  const startTick = () => {
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    target.current = { x: 0, y: 0 };
    startTick();
  };

  const onMove = (event) => {
    if (prefersReducedMotion()) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    target.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * strength,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * strength,
    };
    startTick();
  };

  return (
    <div
      ref={ref}
      className={cn("inline-flex will-change-transform", className)}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
}
