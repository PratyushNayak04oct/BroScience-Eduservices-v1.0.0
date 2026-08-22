"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createCursorParallax, createFloatAnimation } from "@/lib/bookAnimation";
import { prefersReducedMotion } from "@/lib/gsap";

const MODEL_PATH = "/models/broscience-book.glb";
const TARGET_HEIGHT = 2.35;

function findNode(root, name) {
  let match = null;
  root.traverse((child) => {
    if (child.name === name) match = child;
  });
  return match;
}

function collectNamed(root, prefix) {
  const nodes = [];
  root.traverse((child) => {
    if (child.name?.startsWith(prefix)) nodes.push(child);
  });
  return nodes.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

function prepareBook(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  root.position.sub(center);
  const scale = TARGET_HEIGHT / Math.max(size.x, size.y, size.z, 1);
  root.scale.setScalar(scale);

  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const name = `${child.name} ${child.parent?.name || ""}`;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const next = materials.map((material) => {
      const cloned = material.clone();
      if (/page|paper/i.test(name)) {
        cloned.color = new THREE.Color("#f4f4f4");
        cloned.roughness = 0.82;
        cloned.metalness = 0;
      }
      cloned.needsUpdate = true;
      return cloned;
    });
    child.material = Array.isArray(child.material) ? next : next[0];
    child.castShadow = false;
    child.receiveShadow = false;
  });
}

export default function BookModel({ animationRefs, onReady, hovered = false }) {
  const bookRef = useRef(null);
  const parallaxRef = useRef(null);
  const frontHingeRef = useRef(null);
  const pageHingesRef = useRef([]);
  const open = useRef(0);
  const parallaxControlRef = useRef(null);
  const floatRef = useRef(null);

  const { scene } = useGLTF(MODEL_PATH);

  const bookScene = useMemo(() => {
    const clone = scene.clone(true);
    prepareBook(clone);
    return clone;
  }, [scene]);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    frontHingeRef.current = findNode(bookScene, "FrontHinge") || findNode(bookScene, "FrontCover");
    pageHingesRef.current = collectNamed(bookScene, "PageHinge_");

    animationRefs.current.book = book;
    animationRefs.current.frontCover = frontHingeRef.current;
    onReady?.();

    parallaxControlRef.current = createCursorParallax({ maxRotation: 0.04 });
    floatRef.current = createFloatAnimation(book, { amplitude: 0.025, duration: 3.6 });

    return () => {
      animationRefs.current.book = null;
      animationRefs.current.frontCover = null;
      parallaxControlRef.current?.dispose();
      floatRef.current?.kill();
    };
  }, [animationRefs, bookScene, onReady]);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;
    floatRef.current?.kill();
    if (!hovered) {
      floatRef.current = createFloatAnimation(book, { amplitude: 0.025, duration: 3.6 });
    }
  }, [hovered]);

  useFrame((_, delta) => {
    const reduced = prefersReducedMotion();
    const alpha = 1 - Math.exp(-delta * (reduced ? 16 : 8));
    open.current = THREE.MathUtils.lerp(open.current, hovered ? 1 : 0, alpha);
    const t = open.current;

    const book = bookRef.current;
    if (book) {
      book.rotation.x = THREE.MathUtils.lerp(0.18, 0.22, t);
      book.rotation.y = THREE.MathUtils.lerp(-0.85, -0.25, t);
      book.rotation.z = 0.03;
    }

    const hinge = frontHingeRef.current;
    if (hinge) {
      hinge.rotation.y = -1.15 * t;
    }

    const camera = animationRefs.current.camera;
    if (camera) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, hovered ? 0.15 : 0.85, alpha);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, hovered ? 0.12 : 0.08, alpha);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, hovered ? 3.15 : 3.35, alpha);
      camera.lookAt(0, 0, 0);
    }

    if (hovered || reduced) return;
    const group = parallaxRef.current;
    const parallax = parallaxControlRef.current?.rotation;
    if (!group || !parallax) return;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, parallax.x, alpha);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, parallax.y, alpha);
  });

  return (
    <group ref={bookRef}>
      <group ref={parallaxRef}>
        <primitive object={bookScene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
