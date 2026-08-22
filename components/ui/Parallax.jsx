"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Parallax({
  children,
  className,
  speed = 0.18,
  as: Component = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    initGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: -speed * 80 },
        {
          y: speed * 80,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [speed]);

  return (
    <Component ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </Component>
  );
}
