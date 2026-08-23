"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { waitForRouteReady } from "@/lib/navigation/waitForRouteReady";

const MIN_VISIBLE = 900;
const FAILSAFE = 8000;
const STATUSES = ["CONNECTING IDEAS...", "OPENING THE PAGE...", "PREPARING THE PAGE...", "ALMOST THERE..."];

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function destinationFromAnchor(anchor) {
  if (!anchor) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

export default function RouteTransition({ enabled = false }) {
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const startedAt = useRef(0);
  const pendingPath = useRef("");
  const hideTimer = useRef(0);
  const failTimer = useRef(0);
  const statusTimer = useRef(0);
  const readyToken = useRef(0);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState(STATUSES[0]);

  const hide = () => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(failTimer.current);
    window.clearInterval(statusTimer.current);
    activeRef.current = false;
    pendingPath.current = "";
    overlayRef.current?.classList.remove("is-active");
    setActive(false);
  };

  const finishWhenReady = async (expectedPath, token) => {
    await waitForRouteReady(expectedPath, { timeout: FAILSAFE - 200 });
    if (token !== readyToken.current || !activeRef.current) return;
    if (expectedPath && window.location.pathname !== expectedPath) return;

    setStatus("READY TO LEARN.");
    const wait = Math.max(160, MIN_VISIBLE - (performance.now() - startedAt.current));
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(hide, wait);
  };

  const show = (nextPath) => {
    pendingPath.current = nextPath || "";
    readyToken.current += 1;
    const token = readyToken.current;

    if (!activeRef.current) {
      activeRef.current = true;
      startedAt.current = performance.now();
      setStatus(STATUSES[0]);
      overlayRef.current?.classList.add("is-active");
      setActive(true);

      window.clearInterval(statusTimer.current);
      let index = 0;
      statusTimer.current = window.setInterval(() => {
        index = Math.min(index + 1, STATUSES.length - 1);
        setStatus(STATUSES[index]);
        if (index === STATUSES.length - 1) window.clearInterval(statusTimer.current);
      }, 420);
    }

    window.clearTimeout(hideTimer.current);
    window.clearTimeout(failTimer.current);
    failTimer.current = window.setTimeout(hide, FAILSAFE);
    finishWhenReady(nextPath, token);
  };

  useEffect(() => {
    if (!enabled) return;

    const onClick = (event) => {
      if (isModifiedClick(event)) return;
      const nextPath = destinationFromAnchor(event.target.closest?.("a[href]"));
      if (!nextPath) return;
      show(nextPath);
    };

    const onPopState = () => {
      show(window.location.pathname);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !activeRef.current) return;
    const expected = pendingPath.current;
    if (expected && pathname !== expected) return;
    finishWhenReady(expected || pathname, readyToken.current);
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
      className={cn(
        "bs-route-overlay fixed inset-0 z-[180] overflow-hidden",
        active ? "is-active pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!active}
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[#070605]" />
      <div className="route-grid pointer-events-none absolute inset-0" />
      <div className="route-glow pointer-events-none absolute left-1/2 top-[44%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-72 sm:w-72" />

      <div className="absolute left-1/2 top-[46%] flex w-[min(92vw,22rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4">
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
          <svg className="route-ring absolute inset-0 h-full w-full text-[#d4a017]" viewBox="0 0 96 96" aria-hidden="true">
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
          <p className="relative font-display text-[1.75rem] tracking-[0.16em] text-[#f0d060] sm:text-4xl">BS</p>
        </div>
        <div className="mt-5 h-px w-20 bg-[#d4a017] sm:w-28" />
        <p className="mt-5 max-w-full text-center font-mono text-[10px] tracking-[0.22em] text-[#d4a017]/90 sm:text-xs sm:tracking-[0.32em]">
          {status}
        </p>
      </div>
    </div>
  );
}
