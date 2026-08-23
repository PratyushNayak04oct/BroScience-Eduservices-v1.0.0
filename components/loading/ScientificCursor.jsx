"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

export default function ScientificCursor({ enabled = false }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) {
      setAllowed(false);
      return;
    }
    setAllowed(true);

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
    document.documentElement.classList.add("bs-cursor-on");

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("bs-cursor-on");
    };
  }, [enabled]);

  if (!allowed) return null;

  return (
    <>
      <span
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[210] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a017] shadow-[0_0_10px_rgba(212,160,23,0.55)]"
      />
      <span
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[210] h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d4a017]/55"
      />
    </>
  );
}
