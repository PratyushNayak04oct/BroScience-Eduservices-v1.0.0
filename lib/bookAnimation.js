import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

const CONCEPT_WORDS = ["CONCEPT", "CLARITY", "PRACTICE", "PROGRESS"];

const PHASES = {
  float: { start: 0, end: 0.12 },
  rotate: { start: 0.12, end: 0.3 },
  camera: { start: 0.3, end: 0.45 },
  coverOpen: { start: 0.45, end: 0.62 },
  words: { start: 0.62, end: 0.82 },
  exit: { start: 0.82, end: 1 },
};

function isObject3D(target) {
  return Boolean(target?.isObject3D);
}

function setBookRotation(target, { x = 0, y = 0, z = 0 } = {}) {
  if (!target) return;
  if (isObject3D(target)) {
    gsap.set(target.rotation, { x, y, z });
    return;
  }
  gsap.set(target, { rotationX: x, rotationY: y, rotationZ: z });
}

function setBookPosition(target, { x, y, z } = {}) {
  if (!target) return;
  if (isObject3D(target)) {
    const values = {};
    if (x !== undefined) values.x = x;
    if (y !== undefined) values.y = y;
    if (z !== undefined) values.z = z;
    gsap.set(target.position, values);
    return;
  }
  const values = {};
  if (x !== undefined) values.x = x;
  if (y !== undefined) values.y = y;
  gsap.set(target, values);
}

function setBookScale(target, scale) {
  if (!target) return;
  if (isObject3D(target)) {
    gsap.set(target.scale, { x: scale, y: scale, z: scale });
    return;
  }
  gsap.set(target, { scale });
}

function setCoverRotation(target, rotationY) {
  if (!target) return;
  if (isObject3D(target)) {
    gsap.set(target.rotation, { y: rotationY });
    return;
  }
  gsap.set(target, {
    rotationY,
    transformOrigin: "left center",
    transformPerspective: 1200,
  });
}

function setConceptWordsState(words, opacity, offsetY = 0) {
  if (!words?.length) return;

  words.forEach((word) => {
    if (!word) return;

    if (word.material) {
      word.material.transparent = true;
      gsap.set(word.material, { opacity });
    } else {
      gsap.set(word, { opacity, y: offsetY });
    }

    if (word.position && word.userData?.baseY !== undefined) {
      gsap.set(word.position, { y: word.userData.baseY + offsetY * 0.01 });
    }
  });
}

function applyReducedMotionEndState(refs) {
  const { book, frontCover, camera, conceptWords } = refs;

  setBookRotation(book, { x: 0.12, y: -0.45, z: 0.04 });
  setBookPosition(book, { y: 0, x: 0 });
  setBookScale(book, 1);
  setCoverRotation(frontCover, isObject3D(frontCover) ? -2.2 : -128);

  if (camera && isObject3D(camera)) {
    gsap.set(camera.position, { z: 3.2 });
    camera.fov = 32;
    camera.updateProjectionMatrix?.();
  }

  setConceptWordsState(conceptWords, 1, 0);
}

export function createFloatAnimation(target, options = {}) {
  if (!target) return { kill: () => {} };

  if (prefersReducedMotion()) {
    setBookPosition(target, { y: 0 });
    return { kill: () => {} };
  }

  initGsap();

  const amplitude = options.amplitude ?? 0.08;
  const tween = isObject3D(target)
    ? gsap.to(target.position, {
        y: `+=${amplitude}`,
        duration: options.duration ?? 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    : gsap.to(target, {
        y: amplitude * 120,
        duration: options.duration ?? 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

  return { kill: () => tween.kill() };
}

export function createCursorParallax(options = {}) {
  const maxRotation = options.maxRotation ?? 0.12;
  const rotation = { x: 0, y: 0 };

  if (prefersReducedMotion()) {
    return {
      rotation,
      dispose: () => {},
    };
  }

  function handleMouseMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    rotation.y = x * maxRotation;
    rotation.x = -y * maxRotation * 0.4;
  }

  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  return {
    rotation,
    dispose: () => window.removeEventListener("mousemove", handleMouseMove),
  };
}

export function createBookTimeline(refs, options = {}) {
  const { container, book, frontCover, camera, conceptWords = [] } = refs;

  if (!container || !book) {
    return { timeline: null, kill: () => {} };
  }

  initGsap();

  if (prefersReducedMotion()) {
    applyReducedMotionEndState(refs);
    return { timeline: null, kill: () => {} };
  }

  const words = conceptWords.filter(Boolean);
  setConceptWordsState(words, 0, 12);

  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      trigger: container,
      start: options.start ?? "top top",
      end: options.end ?? "bottom bottom",
      scrub: options.scrub ?? 1.1,
      // Never pin React-managed nodes — pin wrappers cause removeChild on route change.
      pin: false,
      invalidateOnRefresh: true,
    },
  });

  const rotateDuration = PHASES.rotate.end - PHASES.rotate.start;

  if (isObject3D(book)) {
    timeline.fromTo(
      book.rotation,
      { y: -0.55, x: 0.18, z: 0.06 },
      { y: -0.15, x: 0.08, z: 0, duration: rotateDuration },
      PHASES.rotate.start
    );
    timeline.fromTo(
      book.position,
      { x: 0.15 },
      { x: 0, duration: rotateDuration },
      PHASES.rotate.start
    );
  } else {
    timeline.fromTo(
      book,
      { rotationY: -22, rotationX: 8, rotationZ: 3 },
      { rotationY: 0, rotationX: 0, rotationZ: 0, duration: rotateDuration },
      PHASES.rotate.start
    );
  }

  if (camera && isObject3D(camera)) {
    timeline.fromTo(
      camera.position,
      { z: 3.6, x: 1.35, y: 0.45 },
      {
        z: 2.85,
        x: 0.35,
        y: 0.2,
        duration: PHASES.camera.end - PHASES.camera.start,
      },
      PHASES.camera.start
    );

    timeline.fromTo(
      camera,
      { fov: 34 },
      {
        fov: 30,
        duration: PHASES.camera.end - PHASES.camera.start,
        onUpdate: () => camera.updateProjectionMatrix?.(),
      },
      PHASES.camera.start
    );
  }

  if (frontCover) {
    const coverTarget = isObject3D(frontCover) ? frontCover.rotation : frontCover;
    const openAmount = isObject3D(frontCover) ? -2.05 : -118;

    if (isObject3D(frontCover)) {
      timeline.fromTo(
        coverTarget,
        { y: 0 },
        { y: openAmount, duration: PHASES.coverOpen.end - PHASES.coverOpen.start },
        PHASES.coverOpen.start
      );
    } else {
      gsap.set(frontCover, {
        transformOrigin: "left center",
        transformPerspective: 1200,
      });
      timeline.fromTo(
        frontCover,
        { rotationY: 0 },
        { rotationY: openAmount, duration: PHASES.coverOpen.end - PHASES.coverOpen.start },
        PHASES.coverOpen.start
      );
    }
  }

  if (words.length) {
    const wordDuration = (PHASES.words.end - PHASES.words.start) / words.length;

    words.forEach((word, index) => {
      const start = PHASES.words.start + index * wordDuration * 0.85;

      if (word.material) {
        timeline.fromTo(
          word.material,
          { opacity: 0 },
          { opacity: 1, duration: wordDuration, ease: "power3.out" },
          start
        );

        if (word.position && word.userData?.baseY !== undefined) {
          timeline.fromTo(
            word.position,
            { y: word.userData.baseY + 0.12 },
            { y: word.userData.baseY, duration: wordDuration, ease: "power3.out" },
            start
          );
        }
      } else {
        timeline.fromTo(
          word,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: wordDuration, ease: "power3.out" },
          start
        );
      }
    });
  }

  if (isObject3D(book)) {
    timeline.to(
      book.position,
      { y: -0.35, x: -0.2, duration: PHASES.exit.end - PHASES.exit.start },
      PHASES.exit.start
    );
    timeline.to(
      book.rotation,
      { x: -0.12, y: -0.85, duration: PHASES.exit.end - PHASES.exit.start },
      PHASES.exit.start
    );
    timeline.to(
      book.scale,
      { x: 0.88, y: 0.88, z: 0.88, duration: PHASES.exit.end - PHASES.exit.start },
      PHASES.exit.start
    );
  } else {
    timeline.to(
      book,
      {
        y: -80,
        scale: 0.82,
        rotationX: -8,
        duration: PHASES.exit.end - PHASES.exit.start,
      },
      PHASES.exit.start
    );
  }

  refs.scrollTimeline = timeline;

  return {
    timeline,
    conceptWords: CONCEPT_WORDS,
    kill: () => {
      if (refs.scrollTimeline === timeline) refs.scrollTimeline = null;
      timeline.scrollTrigger?.kill(true);
      timeline.kill();
    },
  };
}

export { CONCEPT_WORDS };
