"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

function isDesktopPointer() {
  if (typeof window === "undefined") return false;
  const hover = window.matchMedia("(hover: hover)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const touchPoints = navigator.maxTouchPoints || 0;
  if (touchPoints > 0 || coarse) return false;
  if (window.innerWidth < 1024) return false;
  return hover && fine && !prefersReducedMotion();
}

export default function ScientificCursor({ enabled = false }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const sync = () => {
      const next = isDesktopPointer();
      setAllowed(next);
      document.documentElement.classList.toggle("bs-cursor-on", next);
    };

    sync();
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      document.documentElement.classList.remove("bs-cursor-on");
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !allowed) return;

    let frame = 0;
    const onMove = (event) => {
      pos.current.tx = event.clientX;
      pos.current.ty = event.clientY;
    };
    const tick = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.22;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.tx}px, ${pos.current.ty}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled, allowed]);

  if (!allowed) return null;

  return (
    <>
      <span
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[210] hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a017] shadow-[0_0_14px_rgba(212,160,23,0.6)] lg:block"
      />
      <span
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[210] hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d4a017]/60 lg:block"
      />
    </>
  );
}
