import { gsap, initGsap } from "@/lib/gsap";

export function createLoaderTimeline({ state, mode, onPhase }) {
  initGsap();
  const timeline = gsap.timeline({ paused: true });

  if (mode === "reduced") {
    timeline.to(state, { story: 1, duration: 0.45, ease: "power2.out" });
    timeline.add(() => onPhase?.("ready"));
    return timeline;
  }

  if (mode === "abbreviated") {
    timeline.add(() => onPhase?.("knowledge"));
    timeline.to(state, { story: 0.86, duration: 0.35, ease: "power2.inOut" });
    timeline.addLabel("awaiting");
    timeline.to(state, { story: 1, duration: 0.7, ease: "power2.inOut" });
    timeline.add(() => onPhase?.("ready"));
    return timeline;
  }

  timeline.addLabel("intro");
  timeline.add(() => onPhase?.("mathematics"), "intro");
  timeline.to(state, { story: 0.2, duration: 1.35, ease: "power1.inOut" }, "intro");

  timeline.addLabel("physics");
  timeline.add(() => onPhase?.("physics"), "physics");
  timeline.to(state, { story: 0.4, duration: 1.25, ease: "power1.inOut" }, "physics");

  timeline.addLabel("chemistry");
  timeline.add(() => onPhase?.("chemistry"), "chemistry");
  timeline.to(state, { story: 0.58, duration: 1.2, ease: "power1.inOut" }, "chemistry");

  timeline.addLabel("biology");
  timeline.add(() => onPhase?.("biology"), "biology");
  timeline.to(state, { story: 0.74, duration: 1.15, ease: "power1.inOut" }, "biology");

  timeline.addLabel("knowledge");
  timeline.add(() => onPhase?.("knowledge"), "knowledge");
  timeline.to(state, { story: 0.86, duration: 1.05, ease: "power2.inOut" }, "knowledge");

  timeline.addLabel("awaiting");
  timeline.add(() => onPhase?.("awaiting"), "awaiting");
  timeline.addLabel("brandReveal");
  timeline.add(() => onPhase?.("brand"), "brandReveal");
  timeline.to(state, { story: 1, duration: 1.25, ease: "power2.inOut" }, "brandReveal");
  timeline.add(() => onPhase?.("ready"));

  return timeline;
}
