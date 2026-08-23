"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

export default function RouteTransition({ enabled = false }) {
  const pathname = usePathname();
  const first = useRef(true);
  const overlayRef = useRef(null);
  const lineRef = useRef(null);
  const markRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (first.current) {
      first.current = false;
      return;
    }

    const node = overlayRef.current;
    const line = lineRef.current;
    const mark = markRef.current;
    if (!node || prefersReducedMotion()) return;

    initGsap();
    setActive(true);
    const timeline = gsap.timeline({
      onComplete: () => setActive(false),
    });

    timeline.fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: "power2.out" });
    timeline.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.28, ease: "power2.out" },
      0
    );
    timeline.fromTo(mark, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2 }, 0.08);
    timeline.to(node, { autoAlpha: 0, duration: 0.28, delay: 0.12, ease: "power2.inOut" });

    return () => timeline.kill();
  }, [pathname, enabled]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[180] opacity-0"
      aria-hidden={!active}
    >
      <div className="absolute inset-0 bg-[#070605]/72" />
      <div
        ref={lineRef}
        className="absolute left-1/2 top-[48%] h-px w-28 origin-center -translate-x-1/2 bg-[#d4a017]"
      />
      <p
        ref={markRef}
        className="absolute left-1/2 top-[52%] -translate-x-1/2 font-display text-xl tracking-[0.28em] text-[#d4a017]"
      >
        BS
      </p>
    </div>
  );
}
