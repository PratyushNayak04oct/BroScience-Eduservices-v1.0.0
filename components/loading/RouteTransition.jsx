"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

export default function RouteTransition({ enabled = false }) {
  const pathname = usePathname();
  const first = useRef(true);
  const overlayRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (first.current) {
      first.current = false;
      return;
    }

    const node = overlayRef.current;
    if (!node || prefersReducedMotion()) return;

    initGsap();
    setActive(true);
    const timeline = gsap.timeline({
      onComplete: () => setActive(false),
    });
    timeline.fromTo(
      node,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.18, ease: "power2.out" }
    );
    timeline.to(node, { autoAlpha: 0, duration: 0.42, delay: 0.08, ease: "power2.inOut" });

    return () => timeline.kill();
  }, [pathname, enabled]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[180] opacity-0"
      aria-hidden={!active}
    >
      <div className="absolute inset-0 bg-[#070605]/55" />
      <div className="absolute inset-0 opacity-40">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,160,23,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.12) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>
      <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-[#d4a017]" />
      <p className="absolute left-1/2 top-[52%] -translate-x-1/2 font-display text-2xl tracking-[0.2em] text-[#d4a017]">
        BS
      </p>
    </div>
  );
}
