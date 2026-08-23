"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const MIN_VISIBLE = 1100;
const FAILSAFE = 2800;
const STATUSES = ["CONNECTING IDEAS...", "OPENING THE PAGE...", "ALMOST THERE..."];

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isInternalNav(anchor) {
  if (!anchor) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return url.pathname !== window.location.pathname || url.search !== window.location.search;
  } catch {
    return false;
  }
}

export default function RouteTransition({ enabled = false }) {
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const ringRef = useRef(null);
  const orbitRef = useRef(null);
  const markRef = useRef(null);
  const lineRef = useRef(null);
  const statusRef = useRef(null);
  const glowRef = useRef(null);
  const startedAt = useRef(0);
  const hideTimer = useRef(0);
  const failTimer = useRef(0);
  const statusTimer = useRef(0);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState(STATUSES[0]);

  const hide = () => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(failTimer.current);
    window.clearInterval(statusTimer.current);

    const node = overlayRef.current;
    if (!node) {
      activeRef.current = false;
      setActive(false);
      return;
    }

    initGsap();
    gsap.set(node, { pointerEvents: "none" });
    gsap.to(node, {
      autoAlpha: 0,
      duration: prefersReducedMotion() ? 0.12 : 0.38,
      ease: "power2.inOut",
      onComplete: () => {
        activeRef.current = false;
        setActive(false);
        gsap.set(
          [ringRef.current, orbitRef.current, markRef.current, lineRef.current, statusRef.current, glowRef.current],
          { clearProps: "all" }
        );
      },
    });
  };

  const scheduleHide = () => {
    window.clearTimeout(hideTimer.current);
    const wait = Math.max(0, MIN_VISIBLE - (performance.now() - startedAt.current));
    hideTimer.current = window.setTimeout(hide, wait);
  };

  const show = () => {
    if (activeRef.current) return;
    activeRef.current = true;
    startedAt.current = performance.now();
    setActive(true);
    setStatus(STATUSES[0]);

    const node = overlayRef.current;
    if (!node) return;

    initGsap();
    gsap.killTweensOf(node);
    gsap.set(node, { autoAlpha: 1, pointerEvents: "auto" });

    window.clearTimeout(failTimer.current);
    failTimer.current = window.setTimeout(hide, FAILSAFE);

    if (prefersReducedMotion()) return;

    gsap.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.68 },
      { opacity: 1, scale: 1, duration: 0.48, ease: "power2.out" }
    );
    gsap.fromTo(
      ringRef.current,
      { opacity: 0, scale: 0.78 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
    );
    gsap.fromTo(
      orbitRef.current,
      { opacity: 0, scale: 1.12 },
      { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }
    );
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.42, delay: 0.08, ease: "power2.out" }
    );
    gsap.fromTo(
      markRef.current,
      { opacity: 0, y: 14, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.42, delay: 0.1, ease: "power3.out" }
    );
    gsap.fromTo(
      statusRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.32, delay: 0.18, ease: "power2.out" }
    );

    window.clearInterval(statusTimer.current);
    let index = 0;
    statusTimer.current = window.setInterval(() => {
      index = Math.min(index + 1, STATUSES.length - 1);
      setStatus(STATUSES[index]);
      if (index === STATUSES.length - 1) window.clearInterval(statusTimer.current);
    }, 380);
  };

  useEffect(() => {
    const node = overlayRef.current;
    if (!node) return;
    initGsap();
    gsap.set(node, { autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onClick = (event) => {
      if (isModifiedClick(event)) return;
      const anchor = event.target.closest?.("a[href]");
      if (!isInternalNav(anchor)) return;
      show();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !activeRef.current) return;
    scheduleHide();
    return () => window.clearTimeout(hideTimer.current);
  }, [pathname, enabled]);

  useEffect(() => {
    return () => {
      window.clearTimeout(hideTimer.current);
      window.clearTimeout(failTimer.current);
      window.clearInterval(statusTimer.current);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className={cn("bs-route-overlay fixed inset-0 z-[180] overflow-hidden", active ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!active}
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[#070605]" />
      <div className="bs-loader-grain pointer-events-none absolute inset-0" />
      <div className="route-grid pointer-events-none absolute inset-0" />
      <div className="route-sweep pointer-events-none absolute inset-0" />
      <div
        ref={glowRef}
        className="route-glow pointer-events-none absolute left-1/2 top-[44%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-72 sm:w-72"
      />

      <div className="absolute left-1/2 top-[46%] flex w-[min(92vw,22rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4">
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
          <svg
            ref={ringRef}
            className="route-ring absolute inset-0 h-full w-full text-[#d4a017]"
            viewBox="0 0 96 96"
            aria-hidden="true"
          >
            <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="88 176"
            />
          </svg>
          <svg
            ref={orbitRef}
            className="route-orbit absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] text-[#f0d060]"
            viewBox="0 0 96 96"
            aria-hidden="true"
          >
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
              strokeDasharray="16 236"
              strokeLinecap="round"
            />
          </svg>
          <span className="route-dot route-dot-a" aria-hidden="true" />
          <span className="route-dot route-dot-b" aria-hidden="true" />
          <p
            ref={markRef}
            className="relative font-display text-[1.75rem] tracking-[0.16em] text-[#f0d060] sm:text-4xl"
          >
            BS
          </p>
        </div>
        <div ref={lineRef} className="mt-5 h-px w-20 origin-center bg-[#d4a017] sm:w-28" />
        <p
          ref={statusRef}
          className="mt-5 max-w-full text-center font-mono text-[10px] tracking-[0.22em] text-[#d4a017]/90 sm:text-xs sm:tracking-[0.32em]"
        >
          {status}
        </p>
      </div>
    </div>
  );
}
