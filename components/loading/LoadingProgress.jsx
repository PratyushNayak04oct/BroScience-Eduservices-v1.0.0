"use client";

import { cn } from "@/lib/utils";

export default function LoadingProgress({ progress = 0, className }) {
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - clamped);

  return (
    <div
      className={cn("pointer-events-none flex items-center gap-3", className)}
      aria-hidden="true"
    >
      <svg width="96" height="96" viewBox="0 0 96 96" className="h-14 w-14 text-[var(--brand-gold)] sm:h-20 sm:w-20">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
        />
      </svg>
    </div>
  );
}
