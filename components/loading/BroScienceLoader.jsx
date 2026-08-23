"use client";

import { useEffect, useRef, useState } from "react";
import ScientificCanvas from "./ScientificCanvas";
import BrandReveal from "./BrandReveal";
import LoadingProgress from "./LoadingProgress";
import { createLoaderTimeline } from "@/lib/loading/loaderTimeline";
import { startAssetPreload } from "@/lib/loading/loaderAssets";
import { getLoaderMode, markIntroSeen } from "@/lib/loading/loaderStore";
import { statusForStory, getPhaseAlphas } from "@/lib/loading/loaderProgress";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

const HARD_TIMEOUT = 16000;

export default function BroScienceLoader({ onRevealSite, onComplete }) {
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
      if (!assetsDoneRef.current) return;
      readyRef.current = true;
      setProgress((value) => Math.max(value, 1));
      if (resolvedMode === "reduced") exit();
    };

    const timeline = createLoaderTimeline({
      state,
      mode: resolvedMode,
      onPhase: (phase) => {
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

    assets.then(() => {
      assetsDoneRef.current = true;
      tryReady();
    });

    const failsafe = window.setTimeout(() => {
      assetsDoneRef.current = true;
      readyRef.current = true;
      exit();
    }, HARD_TIMEOUT);

    return () => {
      window.clearTimeout(failsafe);
      timeline.kill();
    };
  }, []);

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
      duration: prefersReducedMotion() ? 0.2 : 0.45,
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
      <div className="absolute inset-0 bg-[var(--loader-bg)]" />
      <div className="bs-loader-grain pointer-events-none absolute inset-0" />
      <ScientificCanvas storyRef={storyRef} reduced={mode === "reduced"} />
      <BrandReveal progress={phases.brand} />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:gap-4 sm:px-6 sm:pb-10">
        <LoadingProgress progress={Math.max(progress, story)} />
        <p className="max-w-[90vw] text-center font-mono text-[10px] tracking-[0.2em] text-[var(--brand-gold)] sm:text-xs sm:tracking-[0.32em]">
          {status}
        </p>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[10px] tracking-[0.24em] text-[var(--loader-muted)] transition-colors hover:text-[var(--brand-gold)]"
        >
          SKIP
        </button>
      </div>
    </div>
  );
}
