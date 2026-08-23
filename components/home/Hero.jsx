"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Button from "@/components/ui/Button";
import BookFallback from "./BookFallback";
import BookLoading from "./BookLoading";
import { isWebGLAvailable } from "./BookCanvas";
import { prefersReducedMotion } from "@/lib/gsap";

const BookCanvas = dynamic(() => import("./BookCanvas"), {
  ssr: false,
  loading: () => <BookLoading className="absolute inset-0" />,
});

export default function Hero() {
  const contentRef = useRef(null);
  const glowGoldRef = useRef(null);
  const glowMaroonRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const paragraphRef = useRef(null);
  const ctaRef = useRef(null);
  const trustRef = useRef(null);

  const animationRefs = useRef({
    book: null,
    frontCover: null,
    camera: null,
  });

  const [canRenderWebGL, setCanRenderWebGL] = useState(null);
  const [sceneReady, setSceneReady] = useState(false);

  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  useEffect(() => {
    setCanRenderWebGL(isWebGLAvailable());
  }, []);

  useEffect(() => {
    if (canRenderWebGL === false) setSceneReady(true);
  }, [canRenderWebGL]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo(
          headlineRef.current?.querySelectorAll(".hero-line") ?? [],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
          "-=0.4"
        )
        .fromTo(
          paragraphRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(ctaRef.current, { y: 12 }, { y: 0, duration: 0.5 }, "-=0.4")
        .fromTo(trustRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.3");
    }, contentRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const gold = glowGoldRef.current;
    const maroon = glowMaroonRef.current;
    if (!gold || !maroon) return;

    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 40;
      const y = (event.clientY / window.innerHeight - 0.5) * 28;
      gold.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      maroon.style.transform = `translate3d(${-x * 0.7}px, ${-y * 0.6}px, 0)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const useCanvas = canRenderWebGL === true;

  return (
    <section
      className="relative flex min-h-[100svh] overflow-hidden"
      aria-label="BroScience Eduservices — Hero"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div
          ref={glowGoldRef}
          className="parallax-layer absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_72%_38%,rgba(212,160,23,0.16),transparent_62%)] transition-transform duration-300 ease-out"
        />
        <div
          ref={glowMaroonRef}
          className="parallax-layer absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_18%_78%,rgba(107,20,32,0.1),transparent_58%)] transition-transform duration-300 ease-out"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,77,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,77,0.35) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
          }}
        />
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-5 py-32 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20 lg:py-40"
      >
        <div className="relative z-30 isolate flex flex-col gap-10 lg:pr-8">
          <p
            ref={eyebrowRef}
            className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--brand-gold)]"
          >
            Education with direction
          </p>

          <h1
            ref={headlineRef}
            className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-medium leading-[1.08] tracking-tight text-[var(--foreground)]"
          >
            <span className="hero-line block">Build Strong Concepts.</span>
            <span className="hero-line block text-[var(--brand-gold)]">Create Your Future.</span>
          </h1>

          <p ref={paragraphRef} className="max-w-md text-lg leading-[1.75] text-[var(--muted)]">
            Structured learning paths, expert mentorship, and dedicated doubt support —
            designed for students preparing for board exams, JEE, NEET, and competitive
            excellence.
          </p>

          <div ref={ctaRef} className="relative z-20 flex flex-wrap gap-4">
            <Button href="/courses">Explore Courses</Button>
            <Button href="/contact" variant="secondary">
              Book Free Counselling
            </Button>
          </div>

          <p ref={trustRef} className="text-sm tracking-wide text-[var(--muted)]">
            Classes 7–12 · JEE · NEET · Competitive Exams
          </p>
        </div>

        <div className="relative z-10 isolate flex h-[min(72vw,520px)] w-full items-center justify-center overflow-visible lg:h-[min(72vh,620px)]">
          <div className="glass-orb pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          {canRenderWebGL === null || (useCanvas && !sceneReady) ? (
            <BookLoading className="absolute inset-0 rounded-sm" />
          ) : null}
          {useCanvas ? (
            <BookCanvas
              animationRefs={animationRefs}
              onReady={handleSceneReady}
              className="absolute inset-0 h-full w-full"
            />
          ) : canRenderWebGL === false ? (
            <BookFallback
              animationRefs={animationRefs}
              className="absolute inset-0 h-full w-full"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
