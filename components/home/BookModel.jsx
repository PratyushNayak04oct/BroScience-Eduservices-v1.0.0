"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap";
import { createPaperCanvas, createSpreadPair } from "@/lib/bookTextures";

const PAPER_HEX = "#f2e9d2";
const LOGO_PATH = "/brand/logo.png";

const MODEL_PATH  = "/models/broscience-book.glb?v=16";
// Sized so the fully-open spread (2 page widths) fills the frame without clipping.
const TARGET_SIZE = 1.9;

// Closed state: a gentle three-quarter view of the cover.
const CLOSED_ROT = { x: 0.05, y: -0.13, z: 0.015 };
// Open state: laid back so the flat spread is read from above, square to camera.
// -0.50rad plus the camera's own downward look gives the reference's ~35° angle.
const OPEN_ROT   = { x: -0.50, y: 0, z: 0 };

const MAX_ROT = {
  x: THREE.MathUtils.degToRad(2.5),
  y: THREE.MathUtils.degToRad(3.5),
};

function smoothstep(t) {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

// Centre the model, record the spine offset, and normalise materials.
function prepare(root) {
  root.updateMatrixWorld(true);
  const box    = new THREE.Box3().setFromObject(root);
  const size   = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 1);
  root.scale.setScalar(scale);
  root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

  // The spine sits at local x=0, so after centring it lands here. Shifting the
  // group by this amount when open puts the spine — and therefore the gutter of
  // the open spread — dead centre in frame.
  root.userData.spineShift = center.x * scale;

  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((m) => {
      m.side = THREE.DoubleSide;
      const id = `${child.name} ${m.name}`.toLowerCase();

      if (id.includes("cover") || id.includes("cloth") || id.includes("endpaper")) {
        m.roughness   = Math.min(m.roughness ?? 0.5, 0.45);
        m.metalness   = Math.min(m.metalness ?? 0.05, 0.05);
        m.transparent = false;
        m.depthWrite  = true;
      }

      if (id.includes("page") || id.includes("paper") || id.includes("edge") || id.includes("block")) {
        m.color.set(PAPER_HEX);
        m.roughness   = 0.9;
        m.metalness   = 0;
        m.transparent = false;
        m.opacity     = 1;
        m.depthWrite  = true;
      }

      if (id.includes("gold") || id.includes("foil")) {
        m.color.setRGB(0.92, 0.7, 0.18);
        m.roughness = 0.36;
        m.metalness = 0.68;
        if (!m.emissive) m.emissive = new THREE.Color();
        m.emissive.setRGB(0.07, 0.048, 0.007);
        m.emissiveIntensity = 1;
      }

      m.needsUpdate = true;
    });
  });
}

function makeCanvasTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY       = false;
  texture.anisotropy  = 4;
  texture.colorSpace  = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function loadLogoImage() {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload  = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src     = LOGO_PATH;
  });
}

// Content on one face, matching cream paper on the other. The open left leaf
// faces the camera with its back, so its text lives on the back face only —
// otherwise the same copy reads through from the wrong side while the page turns.
function applyPrintedLeaf(child, texture, contentOnBack) {
  child.material = new THREE.MeshBasicMaterial({
    map:        texture,
    side:       contentOnBack ? THREE.BackSide : THREE.FrontSide,
    toneMapped: false,
    depthWrite: true,
  });

  if (child.userData.paperFace) return;
  const paperFace = new THREE.Mesh(
    child.geometry,
    new THREE.MeshBasicMaterial({
      color:      PAPER_HEX,
      side:       contentOnBack ? THREE.FrontSide : THREE.BackSide,
      toneMapped: false,
      depthWrite: true,
    }),
  );
  paperFace.name = `${child.name}_PaperFace`;
  paperFace.raycast = () => {};
  child.add(paperFace);
  child.userData.paperFace = paperFace;
}

function applySpreadTextures(root, logoImage) {
  const { left, right } = createSpreadPair(undefined, logoImage);
  const paperTexture = makeCanvasTexture(createPaperCanvas());

  root.traverse((child) => {
    if (!child.isMesh) return;

    if (child.name.includes("LeftPage") && !child.name.includes("PaperFace")) {
      applyPrintedLeaf(child, makeCanvasTexture(left), true);
      return;
    }
    if (child.name.includes("RightPage") && !child.name.includes("PaperFace")) {
      applyPrintedLeaf(child, makeCanvasTexture(right), false);
      return;
    }

    const isPaperStack =
      child.name.startsWith("Book_PageLayer_") ||
      /Block|Edge|Head|Tail|Paper|PageIvory/i.test(child.name);
    if (isPaperStack) {
      child.material = new THREE.MeshBasicMaterial({
        map:        child.name.startsWith("Book_PageLayer_") ? paperTexture : null,
        color:      PAPER_HEX,
        side:       THREE.DoubleSide,
        toneMapped: false,
        depthWrite: true,
      });
    }
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

  useEffect(() => {
    if (!clone) return;
    let cancelled = false;
    loadLogoImage().then((logo) => {
      if (!cancelled) applySpreadTextures(clone, logo);
    });
    return () => { cancelled = true; };
  }, [clone]);

  useEffect(() => {
    animationRefs.current.book = wrapRef.current;
    onReady?.();
    return () => { animationRefs.current.book = null; };
  }, [animationRefs, onReady]);

  useEffect(() => {
    if (bound.current) return;
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset();
      action.play();
      action.paused            = true;
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

    const target = reduced ? 0 : hovered ? 1 : 0;
    progress.current = THREE.MathUtils.damp(
      progress.current, target, reduced ? 6 : 1.2, delta,
    );
    if (Math.abs(progress.current - target) < 0.002) progress.current = target;

    const playhead = smoothstep(progress.current);

    // Scrub every baked GLB action to the same playhead.
    Object.values(actions).forEach((action) => {
      if (!action?.getClip()) return;
      const dur = Math.max(action.getClip().duration, 0.001);
      action.paused  = true;
      action.enabled = true;
      action.weight  = 1;
      action.time = playhead >= 1
        ? Math.max(dur - 0.001, 0)
        : Math.min(playhead * dur, dur - 0.001);
    });
    mixer.update(0);

    // Cursor parallax, damped right down once the spread is being read.
    const follow = reduced ? 0 : THREE.MathUtils.lerp(1, 0.12, playhead);
    mouseRot.current.x = THREE.MathUtils.damp(
      mouseRot.current.x, -mouse.y * MAX_ROT.x * follow, 1.2, delta,
    );
    mouseRot.current.y = THREE.MathUtils.damp(
      mouseRot.current.y,  mouse.x * MAX_ROT.y * follow, 1.2, delta,
    );

    // Idle float settles as the book lies open.
    floatPhase.current += delta * (reduced ? 0 : 0.2);
    const floatAmp = THREE.MathUtils.lerp(0.008, 0.002, playhead);
    const idleY    = reduced ? 0 : Math.sin(floatPhase.current) * floatAmp;

    // Tilt back into the reference's elevated read angle, and slide the spine
    // to centre so the open spread is symmetric in frame.
    wrap.rotation.x = THREE.MathUtils.lerp(CLOSED_ROT.x, OPEN_ROT.x, playhead) + mouseRot.current.x;
    wrap.rotation.y = THREE.MathUtils.lerp(CLOSED_ROT.y, OPEN_ROT.y, playhead) + mouseRot.current.y;
    wrap.rotation.z = THREE.MathUtils.lerp(CLOSED_ROT.z, OPEN_ROT.z, playhead);
    wrap.position.x = THREE.MathUtils.lerp(0, clone.userData.spineShift ?? 0, playhead);
    wrap.position.y = idleY;
  });

  return (
    <group ref={wrapRef}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
