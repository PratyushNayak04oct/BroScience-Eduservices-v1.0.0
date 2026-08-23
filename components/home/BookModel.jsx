"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap";

const MODEL_PATH  = "/models/broscience-book.glb?v=11";
const TARGET_SIZE = 1.82;

// Gentle idle rotation limits
const MAX_ROT = {
  x: THREE.MathUtils.degToRad(2.5),
  y: THREE.MathUtils.degToRad(3.5),
};

function smoothstep(t) {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

// Prepare: centre the model and set material properties.
function prepare(root) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size   = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 1);
  root.scale.setScalar(scale);
  // Centre on bounding-box centre so the book occupies the canvas well.
  // Shift +0.3 right so the spine is near world-centre (not off to the left).
  root.position.set(-center.x * scale + 0.3, -center.y * scale, -center.z * scale);

  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((m) => {
      m.side = THREE.DoubleSide;
      const id = `${child.name} ${m.name}`.toLowerCase();

      if (id.includes("cover") || id.includes("cloth") || id.includes("maroon") || id.includes("endpaper")) {
        m.roughness  = Math.min(m.roughness  ?? 0.5,  0.42);
        m.metalness  = Math.min(m.metalness  ?? 0.05, 0.05);
        m.transparent = false;
        m.depthWrite  = true;
      }

      if (id.includes("page") || id.includes("spread") || id.includes("paper")) {
        m.roughness   = 0.88;
        m.metalness   = 0;
        m.transparent = false;
        m.opacity     = 1;
        m.depthWrite  = true;
      }

      if (id.includes("gold") || id.includes("foil")) {
        m.roughness = Math.min(m.roughness ?? 0.3, 0.26);
        m.metalness = Math.max(m.metalness ?? 0.9, 0.88);
      }

      m.needsUpdate = true;
    });
  });
}

// Apply canvas-generated spread textures to the left / right pages.
function applySpreadTextures(root) {
  import("@/lib/bookTextures").then(({ createSpreadCanvas, SPREAD_COPY }) => {
    root.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const name = child.name;
      let data = null;

      if (name === "Book_LeftPage")  data = SPREAD_COPY.left;
      if (name === "Book_RightPage") data = SPREAD_COPY.right;
      if (!data) return;

      const cvs     = createSpreadCanvas(data);
      const texture = new THREE.CanvasTexture(cvs);
      texture.flipY = false;          // GLTF convention
      texture.needsUpdate = true;

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => {
        m.map        = texture;
        m.roughness  = 0.88;
        m.metalness  = 0;
        m.transparent = false;
        m.depthWrite  = true;
        m.needsUpdate = true;
      });
    });
  }).catch(() => {
    /* bookTextures not critical — plain GLB material still shows */
  });
}

export default function BookModel({ animationRefs, onReady, hoverRef, mouseRef }) {
  const wrapRef    = useRef(null);
  const progress   = useRef(0);
  const floatPhase = useRef(0);
  const mouseRot   = useRef({ x: 0, y: 0 });
  const bound      = useRef(false);

  const { scene, animations } = useGLTF(MODEL_PATH);

  const clone = useMemo(() => {
    const next = scene.clone(true);
    prepare(next);
    return next;
  }, [scene]);

  const { actions, mixer } = useAnimations(animations, clone);

  // Apply canvas spread textures once the clone is ready.
  useEffect(() => {
    if (clone) applySpreadTextures(clone);
  }, [clone]);

  useEffect(() => {
    animationRefs.current.book = wrapRef.current;
    onReady?.();
    return () => { animationRefs.current.book = null; };
  }, [animationRefs, onReady]);

  // Bind all GLB animations in scrub mode.
  useEffect(() => {
    if (bound.current) return;
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset();
      action.play();
      action.paused          = true;
      action.clampWhenFinished = true;
      action.setLoop(THREE.LoopOnce, 1);
      action.time    = 0;
      action.enabled = true;
      action.weight  = 1;
    });
    bound.current = true;
  }, [actions]);

  useFrame((_, delta) => {
    const reduced = prefersReducedMotion();
    const wrap    = wrapRef.current;
    if (!wrap) return;

    const hovered = Boolean(hoverRef?.current);
    const mouse   = mouseRef?.current ?? { x: 0, y: 0 };

    // Advance / retreat animation progress.
    const target = reduced ? 0 : hovered ? 1 : 0;
    progress.current = THREE.MathUtils.damp(
      progress.current, target, reduced ? 6 : 0.65, delta,
    );
    if (Math.abs(progress.current - target) < 0.002) progress.current = target;

    const playhead = smoothstep(progress.current);

    // Scrub every GLB action.
    Object.values(actions).forEach((action) => {
      if (!action?.getClip()) return;
      const dur  = Math.max(action.getClip().duration, 0.001);
      action.paused  = true;
      action.enabled = true;
      action.weight  = 1;
      const raw  = playhead * dur;
      action.time = playhead >= 1 ? Math.max(dur - 0.001, 0) : Math.min(raw, dur - 0.001);
    });
    mixer.update(0);

    // Cursor follow — gentler as book opens.
    const follow = reduced ? 0 : THREE.MathUtils.lerp(1, 0.25, playhead);
    mouseRot.current.x = THREE.MathUtils.damp(
      mouseRot.current.x, -mouse.y * MAX_ROT.x * follow, 1.2, delta,
    );
    mouseRot.current.y = THREE.MathUtils.damp(
      mouseRot.current.y,  mouse.x * MAX_ROT.y * follow, 1.2, delta,
    );

    // Gentle idle float.
    floatPhase.current += delta * (reduced ? 0 : 0.20);
    const idleY = reduced ? 0 : Math.sin(floatPhase.current) * 0.007;

    // When the book opens, shift the wrapper slightly to the right so the
    // swinging cover (which extends left) stays within the visible frame.
    const openShift = THREE.MathUtils.lerp(0, 0.10, playhead);

    wrap.rotation.x = 0.04 + mouseRot.current.x;
    wrap.rotation.y = -0.06 + mouseRot.current.y;
    wrap.rotation.z = mouseRot.current.y * 0.025;
    wrap.position.x = openShift;
    wrap.position.y = idleY;
  });

  return (
    <group ref={wrapRef}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
