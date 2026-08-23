"use client";

import { cn } from "@/lib/utils";

export default function BrandReveal({ progress = 0, className }) {
  const showMark = Math.min(1, Math.max(0, (progress - 0.05) / 0.35));
  const showName = Math.min(1, Math.max(0, (progress - 0.38) / 0.32));
  const showLine = Math.min(1, Math.max(0, (progress - 0.62) / 0.22));
  const showTag = Math.min(1, Math.max(0, (progress - 0.78) / 0.22));

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center",
        className
      )}
    >
      <div
        className="font-display text-[clamp(3.4rem,16vw,7.5rem)] leading-none tracking-tight text-[var(--loader-accent)]"
        style={{
          opacity: showMark,
          transform: `scale(${0.92 + showMark * 0.08})`,
          textShadow: "0 0 42px color-mix(in srgb, var(--brand-gold) 35%, transparent)",
        }}
      >
        BS
      </div>
      <div
        className="mt-5 h-px bg-[var(--brand-gold)]"
        style={{ width: `${showLine * 88}px`, opacity: showLine }}
      />
      <p
        className="mt-6 max-w-[92vw] font-display text-[clamp(1.15rem,5.4vw,2.35rem)] font-medium tracking-[0.12em] text-[var(--loader-fg)] sm:tracking-[0.18em]"
        style={{ opacity: showName, transform: `translateY(${(1 - showName) * 12}px)` }}
      >
        BROSCIENCE EDUSERVICES
      </p>
      <p
        className="mt-4 max-w-[20rem] text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--brand-gold)] sm:max-w-md sm:text-xs sm:tracking-[0.28em]"
        style={{ opacity: showTag, transform: `translateY(${(1 - showTag) * 8}px)` }}
      >
        Your Attitude Decides Your Altitude
      </p>
    </div>
  );
}
