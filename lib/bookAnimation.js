import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

function isObject3D(target) {
  return Boolean(target?.isObject3D);
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
