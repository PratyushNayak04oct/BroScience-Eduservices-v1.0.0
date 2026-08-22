"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap";

const MODEL_PATH = "/models/broscience-book.glb?v=5";
const TARGET_SIZE = 1.48;
const MAX_ROT = {
  x: THREE.MathUtils.degToRad(2.5),
  y: THREE.MathUtils.degToRad(4),
  z: THREE.MathUtils.degToRad(0.8),
};

function prepare(root) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 1);
  root.scale.setScalar(scale);
  root.position.set(-center.x * scale * 0.35, -center.y * scale, -center.z * scale);

  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      material.side = THREE.DoubleSide;
      const name = `${child.name} ${material.name}`.toLowerCase();
      if (name.includes("cover") || name.includes("cloth") || name.includes("maroon")) {
        material.roughness = Math.min(material.roughness ?? 0.5, 0.45);
        material.metalness = Math.min(material.metalness ?? 0.05, 0.06);
      }
      if (name.includes("page") || name.includes("spread") || name.includes("paper")) {
        if (material.map) {
          material.map.center.set(0.5, 0.5);
          material.map.rotation = 0;
          material.map.needsUpdate = true;
        }
        material.roughness = 0.88;
        material.metalness = 0;
      }
      material.needsUpdate = true;
    });
  });
}

export default function BookModel({ animationRefs, onReady, hoverRef, mouseRef }) {
  const wrapRef = useRef(null);
  const progress = useRef(0);
  const floatPhase = useRef(0);
  const mouseRot = useRef({ x: 0, y: 0 });
  const bound = useRef(false);

  const { scene, animations } = useGLTF(MODEL_PATH);
  const clone = useMemo(() => {
    const next = scene.clone(true);
    prepare(next);
    return next;
  }, [scene]);
  const { actions, mixer } = useAnimations(animations, clone);

  useEffect(() => {
    animationRefs.current.book = wrapRef.current;
    onReady?.();
    return () => {
      animationRefs.current.book = null;
    };
  }, [animationRefs, onReady]);

  useEffect(() => {
    if (bound.current) return;
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset();
      action.play();
      action.paused = true;
      action.clampWhenFinished = true;
      action.setLoop(THREE.LoopOnce, 1);
      action.time = 0;
      action.enabled = true;
    });
    bound.current = true;
  }, [actions]);

  useFrame((_, delta) => {
    const reduced = prefersReducedMotion();
    const wrap = wrapRef.current;
    if (!wrap) return;

    const hovered = Boolean(hoverRef?.current);
    const mouse = mouseRef?.current ?? { x: 0, y: 0 };
    const target = reduced ? 0 : hovered ? 1 : 0;
    progress.current = THREE.MathUtils.damp(progress.current, target, reduced ? 6 : 1.05, delta);
    const eased = progress.current * progress.current * (3 - 2 * progress.current);

    Object.values(actions).forEach((action) => {
      if (!action?.getClip()) return;
      const duration = action.getClip().duration || 3;
      action.paused = true;
      action.enabled = true;
      action.time = THREE.MathUtils.clamp(eased * duration, 0, duration);
    });
    mixer.update(0);

    const follow = reduced ? 0.1 : 1;
    mouseRot.current.x = THREE.MathUtils.damp(mouseRot.current.x, -mouse.y * MAX_ROT.x * follow, 1.8, delta);
    mouseRot.current.y = THREE.MathUtils.damp(mouseRot.current.y, mouse.x * MAX_ROT.y * follow, 1.8, delta);

    floatPhase.current += delta * (reduced ? 0 : 0.28);
    const idleY = reduced ? 0 : Math.sin(floatPhase.current) * 0.01;

    wrap.rotation.x = 0.06 + mouseRot.current.x;
    wrap.rotation.y = -0.22 + mouseRot.current.y;
    wrap.rotation.z = mouseRot.current.y * 0.05;
    wrap.position.x = eased * 0.12;
    wrap.position.y = idleY;
  });

  return (
    <group ref={wrapRef}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
