export function statusForStory(story) {
  if (story < 0.18) return "CALCULATING...";
  if (story < 0.38) return "EXPLORING...";
  if (story < 0.56) return "CONNECTING IDEAS...";
  if (story < 0.8) return "BUILDING KNOWLEDGE...";
  return "READY TO LEARN.";
}

export function phaseAlpha(story, start, peak, end) {
  if (story <= start || story >= end) return 0;
  if (story < peak) return (story - start) / Math.max(0.0001, peak - start);
  return 1 - (story - peak) / Math.max(0.0001, end - peak);
}

export function getPhaseAlphas(story) {
  return {
    math: phaseAlpha(story, 0, 0.12, 0.3),
    physics: phaseAlpha(story, 0.18, 0.32, 0.5),
    chemistry: phaseAlpha(story, 0.38, 0.52, 0.68),
    biology: phaseAlpha(story, 0.56, 0.7, 0.84),
    knowledge: phaseAlpha(story, 0.74, 0.84, 0.94),
    brand: Math.max(0, (story - 0.84) / 0.16),
  };
}

export function getQuality() {
  if (typeof window === "undefined") {
    return { dpr: 1, particles: 10, compact: false };
  }

  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;

  if (width < 640) {
    return { dpr: 1, particles: 7, compact: true };
  }
  if (width < 1024) {
    return { dpr: Math.min(1.25, dpr), particles: 14, compact: false };
  }
  return { dpr: Math.min(1.5, dpr), particles: 22, compact: false };
}
