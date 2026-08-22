"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CONCEPT_WORDS = ["CONCEPT", "CLARITY", "PRACTICE", "PROGRESS"];

export default function BookFallback({ animationRefs, className }) {
  const containerRef = useRef(null);
  const bookRef = useRef(null);
  const coverRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    animationRefs.current.container = containerRef.current;
    animationRefs.current.book = bookRef.current;
    animationRefs.current.frontCover = coverRef.current;
    animationRefs.current.conceptWords = wordRefs.current.filter(Boolean);
    animationRefs.current.camera = null;

    return () => {
      animationRefs.current.book = null;
      animationRefs.current.frontCover = null;
      animationRefs.current.conceptWords = [];
    };
  }, [animationRefs]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-brand-black via-[#12080a] to-brand-black",
        className
      )}
      aria-label="BroScience book experience"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,168,77,0.14),transparent_58%)]" />

      <div
        ref={bookRef}
        className="book-fallback-book relative h-[min(58vw,320px)] w-[min(72vw,420px)] [perspective:1200px]"
      >
        <div className="book-fallback-float relative h-full w-full [transform-style:preserve-3d]">
          <div className="absolute inset-y-[6%] left-[46%] w-[8%] rounded-sm bg-brand-maroon shadow-[inset_-2px_0_8px_rgba(0,0,0,0.45)]" />

          <div className="absolute inset-y-[4%] right-[6%] left-[18%] overflow-hidden rounded-r-md border border-brand-gold/25 bg-[#111111] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(201,168,77,0.08),transparent_45%)]" />
            <div className="absolute inset-y-0 left-0 w-[2px] bg-brand-gold/50" />

            <div className="absolute inset-[12%_10%_12%_14%] flex flex-col justify-center gap-3">
              {CONCEPT_WORDS.map((word, index) => (
                <p
                  key={word}
                  ref={(node) => {
                    wordRefs.current[index] = node;
                  }}
                  className="book-fallback-word text-[clamp(0.72rem,2.2vw,0.95rem)] font-medium tracking-[0.28em] text-brand-gold/95 uppercase opacity-0"
                >
                  {word}
                </p>
              ))}
            </div>
          </div>

          <div
            ref={coverRef}
            className="book-fallback-cover absolute inset-y-[4%] left-[12%] w-[52%] origin-left [transform-style:preserve-3d]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-l-md border border-brand-gold/30 bg-[#0a0a0a] shadow-[0_18px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(201,168,77,0.12),transparent_55%)]" />
              <div className="absolute inset-y-[18%] right-[10%] left-[10%] border-y border-brand-gold/35" />
              <div className="absolute top-[22%] right-[18%] left-[18%] h-[1px] bg-brand-gold/25" />
              <div className="absolute bottom-[22%] right-[18%] left-[18%] h-[1px] bg-brand-gold/25" />

              <svg
                className="absolute top-1/2 left-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 text-brand-gold"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden
              >
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
                <path
                  d="M50 24 L62 62 L38 62 Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="rgba(201,168,77,0.08)"
                />
                <text
                  x="50"
                  y="78"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="9"
                  letterSpacing="2"
                  opacity="0.8"
                >
                  BS
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .book-fallback-float {
          animation: bookFloat 3.2s ease-in-out infinite;
        }

        .book-fallback-cover {
          transform: rotateY(0deg);
        }

        @keyframes bookFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .book-fallback-float {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
