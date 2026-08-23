"use client";

import { useEffect, useRef, useState } from "react";
import ScientificCanvas from "./ScientificCanvas";
import BrandReveal from "./BrandReveal";
import LoadingProgress from "./LoadingProgress";
import { createLoaderTimeline } from "@/lib/loading/loaderTimeline";
import { startAssetPreload, isBookReady, onBookReady } from "@/lib/loading/loaderAssets";
import { getLoaderMode, markIntroSeen } from "@/lib/loading/loaderStore";
import { statusForStory, getPhaseAlphas } from "@/lib/loading/loaderProgress";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

const HARD_TIMEOUT = 14000;

export default function BroScienceLoader({ waitForBook = false, onRevealSite, onComplete }) {
  const overlayRef = useRef(null);
  const storyRef = useRef(0);
  const timelineRef = useRef(null);
  const readyRef = useRef(false);
  const exitingRef = useRef(false);
  const assetsDoneRef = useRef(false);
  const [story, setStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("cinematic");

  useEffect(() => {
    document.getElementById("bs-boot-overlay")?.remove();
    document.documentElement.classList.add("bs-loading");

    const resolvedMode = getLoaderMode();
    setMode(resolvedMode);

    initGsap();
    const state = { story: 0 };

    const tryReady = () => {
      const bookOk = !waitForBook || isBookReady() || resolvedMode !== "cinematic";
      if (assetsDoneRef.current && bookOk) {
        readyRef.current = true;
        setProgress((value) => Math.max(value, 1));
        if (timelineRef.current?.paused()) timelineRef.current.play();
        if (resolvedMode === "reduced") exit();
      }
    };

    const timeline = createLoaderTimeline({
      state,
      mode: resolvedMode,
      onPhase: (phase) => {
        if (phase === "awaiting" && !readyRef.current) timeline.pause();
        if (phase === "ready") exit();
      },
    });
    timelineRef.current = timeline;
    timeline.eventCallback("onUpdate", () => {
      storyRef.current = state.story;
      setStory(state.story);
    });
    timeline.play();

    const assets = startAssetPreload((value) => {
      setProgress(value);
      if (value >= 0.92) {
        assetsDoneRef.current = true;
        tryReady();
      }
    });

    const stopBook = onBookReady(() => tryReady());

    assets.then(() => {
      assetsDoneRef.current = true;
      tryReady();
    });

    const failsafe = window.setTimeout(() => {
      assetsDoneRef.current = true;
      readyRef.current = true;
      timeline.play();
      if (resolvedMode === "reduced") exit();
    }, HARD_TIMEOUT);

    return () => {
      window.clearTimeout(failsafe);
      stopBook();
      timeline.kill();
    };
  }, [waitForBook]);

  const exit = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    markIntroSeen();
    onRevealSite?.();
    const node = overlayRef.current;
    if (!node) {
      onComplete?.();
      return;
    }
    gsap.to(node, {
      yPercent: prefersReducedMotion() ? 0 : -6,
      opacity: 0,
      duration: prefersReducedMotion() ? 0.35 : 1,
      ease: "power3.inOut",
      onComplete: () => {
        document.documentElement.classList.remove("bs-loading");
        onComplete?.();
      },
    });
  };

  const handleSkip = () => {
    readyRef.current = true;
    timelineRef.current?.progress(1);
    exit();
  };

  const phases = getPhaseAlphas(story);
  const status = statusForStory(story);

  return (
    <div
      ref={overlayRef}
      className="bs-loader-shell fixed inset-0 z-[200] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="BroScience opening sequence"
    >
      <div className="absolute inset-0 bg-[#070605]" />
      <div className="bs-loader-grain pointer-events-none absolute inset-0" />
      <ScientificCanvas storyRef={storyRef} reduced={mode === "reduced"} />
      <BrandReveal progress={phases.brand} />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-4 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-10">
        <LoadingProgress progress={Math.max(progress, story)} />
        <p className="font-mono text-[10px] tracking-[0.32em] text-[#d4a017]/80 sm:text-xs">
          {status}
        </p>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[10px] tracking-[0.24em] text-[#f7f3ea]/35 transition-colors hover:text-[#d4a017]"
        >
          SKIP
        </button>
      </div>
    </div>
  );
}
