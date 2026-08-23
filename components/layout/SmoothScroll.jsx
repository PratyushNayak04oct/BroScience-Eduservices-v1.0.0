"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/gsap";
import { useLoader } from "@/components/loading/LoaderProvider";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const { hasEntered } = useLoader();

  useEffect(() => {
    if (!hasEntered || prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    window.__bsLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (window.__bsLenis === lenis) window.__bsLenis = null;
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [hasEntered]);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return children;
}
