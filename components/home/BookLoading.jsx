"use client";

import { cn } from "@/lib/utils";

export default function BookLoading({ className }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-6 bg-brand-black/95",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading 3D book experience"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-brand-gold/20" />
        <span className="absolute inset-2 animate-ping rounded-full border border-brand-gold/40" />
        <span className="absolute inset-4 animate-pulse rounded-full bg-brand-gold/20" />
        <span className="relative h-3 w-3 rounded-full bg-brand-gold shadow-[0_0_24px_rgba(201,168,77,0.65)]" />
      </div>

      <p className="text-sm font-medium tracking-[0.22em] text-brand-gold/90 uppercase">
        Loading experience...
      </p>
    </div>
  );
}
