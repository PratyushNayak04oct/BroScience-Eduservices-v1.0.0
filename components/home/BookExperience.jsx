"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import BookFallback from "./BookFallback";
import BookLoading from "./BookLoading";
import { isWebGLAvailable } from "./BookCanvas";
import { cn } from "@/lib/utils";

const BookCanvas = dynamic(() => import("./BookCanvas"), {
  ssr: false,
  loading: () => <BookLoading className="absolute inset-0" />,
});

export default function BookExperience({ className }) {
  const animationRefs = useRef({
    book: null,
    frontCover: null,
    camera: null,
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

  const useCanvas = canRenderWebGL === true;

  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      aria-label="Interactive BroScience book"
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
      </div>
    </section>
  );
}
