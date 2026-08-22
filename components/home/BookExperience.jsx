"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import BookFallback from "./BookFallback";
import BookLoading from "./BookLoading";
import { createBookTimeline } from "@/lib/bookAnimation";
import { isWebGLAvailable } from "./BookCanvas";
import { cn } from "@/lib/utils";

const BookCanvas = dynamic(() => import("./BookCanvas"), {
  ssr: false,
  loading: () => <BookLoading className="absolute inset-0" />,
});

export default function BookExperience({ className }) {
  const sectionRef = useRef(null);
  const animationRefs = useRef({
    container: null,
    book: null,
    frontCover: null,
    camera: null,
    conceptWords: [],
  });

  const [canRenderWebGL, setCanRenderWebGL] = useState(null);
  const [sceneReady, setSceneReady] = useState(false);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  useEffect(() => {
    setCanRenderWebGL(isWebGLAvailable());
  }, []);

  useEffect(() => {
    if (canRenderWebGL === false) {
      setSceneReady(true);
    }
  }, [canRenderWebGL]);

  useEffect(() => {
    animationRefs.current.container = sectionRef.current;
  }, []);

  useEffect(() => {
    if (canRenderWebGL === null) return;
    if (canRenderWebGL && !sceneReady) return;

    let timelineHandle = null;
    let frameId = 0;
    let cancelled = false;

    const setupTimeline = () => {
      if (cancelled) return;

      const refs = animationRefs.current;
      if (!refs.container || !refs.book) {
        frameId = requestAnimationFrame(setupTimeline);
        return;
      }

      timelineHandle = createBookTimeline(refs, {
        pin: false,
        scrub: 1.1,
        start: "top top",
        end: "+=280%",
      });
    };

    setupTimeline();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      timelineHandle?.kill();
    };
  }, [canRenderWebGL, sceneReady]);

  const useCanvas = canRenderWebGL === true;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden bg-brand-black text-brand-white",
        className
      )}
      aria-label="Interactive BroScience book journey"
    >
      <div className="relative mx-auto aspect-[16/10] w-full max-w-6xl md:aspect-[16/9]">
        {canRenderWebGL === null ? (
          <BookLoading className="absolute inset-0" />
        ) : useCanvas ? (
          <BookCanvas
            animationRefs={animationRefs}
            onReady={handleSceneReady}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <BookFallback
            animationRefs={animationRefs}
            className="absolute inset-0 h-full w-full"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-black to-transparent" />
      </div>
    </section>
  );
}
