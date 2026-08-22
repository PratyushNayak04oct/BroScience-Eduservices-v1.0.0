"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createCursorParallax, createFloatAnimation } from "@/lib/bookAnimation";
import { prefersReducedMotion } from "@/lib/gsap";

const MODEL_PATH = "/models/broscience-book.glb";
const TARGET_SIZE = 2.7;
const REST_ROTATION = { x: 0.05, y: -0.42, z: 0.02 };
const OPEN_ROTATION = { x: 0.12, y: 0, z: 0 };
const REST_POSITION = { x: 0.02, y: -0.04, z: 0 };
const OPEN_POSITION = { x: 0, y: 0.01, z: 0.06 };

function findByName(root, exact) {
  let match = null;
  root.traverse((child) => {
    if (child.name === exact) match = child;
  });
  return match;
}

function collectPages(root) {
  const pages = [];
  root.traverse((child) => {
    const match = child.name?.match(/^Page_(\d+)$/);
    if (match) pages.push({ index: Number(match[1]), object: child });
  });
  return pages.sort((a, b) => a.index - b.index).map((item) => item.object);
}

function fitAndCenter(object, targetSize) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  object.position.sub(center);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  object.scale.multiplyScalar(targetSize / maxDim);
}

function whitenPages(root) {
  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const name = child.name || child.parent?.name || "";
    const isPage = name.startsWith("Page") || name === "PageBlock";
    if (!isPage) return;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      const next = material.clone();
      next.color = new THREE.Color("#f7f7f7");
      next.emissive = new THREE.Color("#ffffff");
      next.emissiveIntensity = 0.04;
      next.roughness = 0.78;
      next.metalness = 0;
      next.needsUpdate = true;
      if (Array.isArray(child.material)) {
        child.material = child.material.map((item) => (item === material ? next : item));
      } else {
        child.material = next;
      }
    });
  });
}

export default function BookModel({ animationRefs, onReady, hovered = false }) {
  const bookRef = useRef(null);
  const parallaxGroupRef = useRef(null);
  const coverRef = useRef(null);
  const pagesRef = useRef([]);
  const openAmount = useRef(0);
  const parallaxControlRef = useRef(null);
  const floatRef = useRef(null);

  const { scene } = useGLTF(MODEL_PATH);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) child.material = child.material.clone();
      }
    });
    whitenPages(clone);
    fitAndCenter(clone, TARGET_SIZE);
    return clone;
  }, [scene]);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    coverRef.current = findByName(clonedScene, "FrontCover");
    pagesRef.current = collectPages(clonedScene);

    animationRefs.current.book = book;
    animationRefs.current.frontCover = coverRef.current;
    animationRefs.current.pages = pagesRef.current;

    parallaxControlRef.current = createCursorParallax({ maxRotation: 0.05 });
    floatRef.current = createFloatAnimation(book, { amplitude: 0.03, duration: 3.4 });
    onReady?.();

    return () => {
      animationRefs.current.book = null;
      animationRefs.current.frontCover = null;
      animationRefs.current.pages = [];
      parallaxControlRef.current?.dispose();
      floatRef.current?.kill();
    };
  }, [animationRefs, clonedScene, onReady]);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;
    floatRef.current?.kill();
    if (!hovered) {
      floatRef.current = createFloatAnimation(book, { amplitude: 0.03, duration: 3.4 });
    }
  }, [hovered]);

  useFrame((_, delta) => {
    const reduced = prefersReducedMotion();
    const speed = reduced ? 18 : 9;
    const alpha = 1 - Math.exp(-delta * speed);
    const target = hovered ? 1 : 0;
    openAmount.current = THREE.MathUtils.lerp(openAmount.current, target, alpha);

    const book = bookRef.current;
    const cover = coverRef.current;
    const pages = pagesRef.current;
    const t = openAmount.current;

    if (book) {
      const rot = {
        x: THREE.MathUtils.lerp(REST_ROTATION.x, OPEN_ROTATION.x, t),
        y: THREE.MathUtils.lerp(REST_ROTATION.y, OPEN_ROTATION.y, t),
        z: THREE.MathUtils.lerp(REST_ROTATION.z, OPEN_ROTATION.z, t),
      };
      book.rotation.x = rot.x;
      book.rotation.y = rot.y;
      book.rotation.z = rot.z;
      book.position.x = THREE.MathUtils.lerp(REST_POSITION.x, OPEN_POSITION.x, t);
      book.position.y = THREE.MathUtils.lerp(REST_POSITION.y, OPEN_POSITION.y, t);
      book.position.z = THREE.MathUtils.lerp(REST_POSITION.z, OPEN_POSITION.z, t);
    }

    if (cover) {
      cover.rotation.y = -Math.PI * 0.96 * t;
    }

    const mid = Math.floor(pages.length / 2);
    pages.forEach((page, index) => {
      if (index >= mid) {
        page.rotation.y = THREE.MathUtils.lerp(page.rotation.y, -0.03 * (index - mid) * t, alpha);
        return;
      }
      const stagger = Math.max(0, Math.min(1, (t - index * 0.07) / 0.45));
      page.rotation.y = -Math.PI * 0.96 * stagger;
    });

    const camera = animationRefs.current.camera;
    if (camera) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, hovered ? 0 : 0.68, alpha);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, hovered ? 0.14 : 0.05, alpha);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, hovered ? 2.75 : 3.0, alpha);
      camera.lookAt(0, 0.02, 0);
    }

    if (hovered || reduced) return;
    const group = parallaxGroupRef.current;
    const parallax = parallaxControlRef.current?.rotation;
    if (!group || !parallax) return;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, parallax.x, alpha);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, parallax.y, alpha);
  });

  return (
    <group ref={bookRef}>
      <group ref={parallaxGroupRef}>
        <primitive object={clonedScene} />
        <mesh position={[0.15, 0, 0]} visible={false}>
          <boxGeometry args={[3.2, 3.4, 2.2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
