"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export default function RouteTransition({ enabled = false }) {
  const pathname = usePathname();
  const first = useRef(true);
  const overlayRef = useRef(null);
  const ringRef = useRef(null);
  const markRef = useRef(null);
  const lineRef = useRef(null);
  const statusRef = useRef(null);
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
      defaults: { ease: "power2.out" },
      onComplete: () => setActive(false),
    });

    timeline.fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 });
    timeline.fromTo(
      ringRef.current,
      { rotate: -40, opacity: 0, scale: 0.86 },
      { rotate: 0, opacity: 1, scale: 1, duration: 0.45 },
      0.04
    );
    timeline.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4 },
      0.08
    );
    timeline.fromTo(
      markRef.current,
      { opacity: 0, y: 10, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35 },
      0.12
    );
    timeline.fromTo(
      statusRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.28 },
      0.22
    );
    timeline.to(node, { autoAlpha: 0, duration: 0.38, ease: "power2.inOut" }, "+=0.72");

    return () => timeline.kill();
  }, [pathname, enabled]);

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-[180] overflow-hidden opacity-0",
        active ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!active}
    >
      <div className="absolute inset-0 bg-[#070605]" />
      <div className="bs-loader-grain pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.12) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.16),transparent_68%)]" />

      <div className="absolute left-1/2 top-[46%] flex w-[min(90vw,20rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg
            ref={ringRef}
            className="absolute inset-0 h-full w-full text-[#d4a017]"
            viewBox="0 0 96 96"
            aria-hidden="true"
          >
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="80 184"
            />
          </svg>
          <p
            ref={markRef}
            className="font-display text-3xl tracking-[0.18em] text-[#f0d060]"
          >
            BS
          </p>
        </div>
        <div
          ref={lineRef}
          className="mt-5 h-px w-20 origin-center bg-[#d4a017]"
        />
        <p
          ref={statusRef}
          className="mt-5 font-mono text-[10px] tracking-[0.32em] text-[#d4a017]/85"
        >
          CONNECTING IDEAS...
        </p>
      </div>
    </div>
  );
}
