"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap";

const MODEL_PATH = "/models/broscience-book.glb";
useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
const TARGET_SIZE = 2.4;
const MAX_ROT = { x: THREE.MathUtils.degToRad(4), y: THREE.MathUtils.degToRad(6), z: THREE.MathUtils.degToRad(1.5) };

function prepare(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  root.position.sub(center);
  root.scale.setScalar(TARGET_SIZE / Math.max(size.x, size.y, size.z, 1));
}

export default function BookModel({ animationRefs, onReady, hovered = false, mouse = { x: 0, y: 0 } }) {
  const wrapRef = useRef(null);
  const progress = useRef(0);
  const floatPhase = useRef(0);
  const mouseRot = useRef({ x: 0, y: 0, z: 0 });
  const { scene, animations } = useGLTF(MODEL_PATH, true);
  const { actions, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    if (!scene.userData.brosciencePrepared) {
      prepare(scene);
      scene.userData.brosciencePrepared = true;
    }
    animationRefs.current.book = wrapRef.current;
    onReady?.();
    return () => {
      animationRefs.current.book = null;
    };
  }, [animationRefs, onReady, scene]);

  useEffect(() => {
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
  }, [actions]);

  useFrame((_, delta) => {
    const reduced = prefersReducedMotion();
    const wrap = wrapRef.current;
    if (!wrap) return;

    const speed = reduced ? 10 : 2.1;
    const target = reduced ? 0 : hovered ? 1 : 0;
    progress.current = THREE.MathUtils.damp(progress.current, target, speed, delta);

    Object.values(actions).forEach((action) => {
      if (!action?.getClip()) return;
      const duration = action.getClip().duration || 3;
      action.paused = true;
      action.enabled = true;
      action.time = progress.current * duration;
    });
    mixer.update(0);

    const follow = reduced ? 0.15 : 1;
    const desiredY = mouse.x * MAX_ROT.y * follow;
    const desiredX = -mouse.y * MAX_ROT.x * follow;
    mouseRot.current.x = THREE.MathUtils.damp(mouseRot.current.x, desiredX, 4, delta);
    mouseRot.current.y = THREE.MathUtils.damp(mouseRot.current.y, desiredY, 4, delta);

    floatPhase.current += delta * (reduced ? 0 : 0.45);
    const idleY = reduced ? 0 : Math.sin(floatPhase.current) * 0.02;
    const idleX = reduced ? 0 : Math.sin(floatPhase.current * 0.7) * 0.012;

    // Slight three-quarter product view; cover remains readable.
    wrap.rotation.x = 0.14 + mouseRot.current.x + idleX;
    wrap.rotation.y = -0.55 + mouseRot.current.y;
    wrap.rotation.z = mouseRot.current.y * 0.12;
    wrap.position.y = idleY;
  });

  return (
    <group ref={wrapRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH, true);
