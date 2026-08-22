"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function BookFallback({ animationRefs, className }) {
  const containerRef = useRef(null);
  const bookRef = useRef(null);

  useEffect(() => {
    animationRefs.current.container = containerRef.current;
    animationRefs.current.book = bookRef.current;
    animationRefs.current.camera = null;
    return () => {
      animationRefs.current.book = null;
    };
  }, [animationRefs]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className
      )}
      aria-label="BroScience Eduservices hardcover book"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(214,165,31,0.14),transparent_58%)]" />
      <img
        ref={bookRef}
        src="/models/previews/broscience-book-preview.png"
        alt="BroScience Eduservices — premium hardcover"
        className="relative z-10 h-auto max-h-full w-auto max-w-full object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.45)]"
      />
    </div>
  );
}
