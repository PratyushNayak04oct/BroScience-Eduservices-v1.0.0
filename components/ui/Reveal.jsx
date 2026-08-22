"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  y = 40,
  once = true,
  as: Component = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    initGsap();

    if (prefersReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play reverse play reverse",
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [delay, duration, y, once]);

  return (
    <Component ref={ref} className={cn(className)}>
      {children}
    </Component>
  );
}
