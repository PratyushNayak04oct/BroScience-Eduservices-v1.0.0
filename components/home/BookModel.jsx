"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  CONCEPT_WORDS,
  createCursorParallax,
  createFloatAnimation,
} from "@/lib/bookAnimation";

const MODEL_PATH = "/models/broscience-book.glb";
const TARGET_SIZE = 2.55;

const WORD_LAYOUT = [
  { text: CONCEPT_WORDS[0], position: [-0.55, 0.42, 0.08] },
  { text: CONCEPT_WORDS[1], position: [-0.55, 0.16, 0.08] },
  { text: CONCEPT_WORDS[2], position: [-0.55, -0.1, 0.08] },
  { text: CONCEPT_WORDS[3], position: [-0.55, -0.36, 0.08] },
];

function findByName(root, names) {
  let match = null;
  const lowered = names.map((name) => name.toLowerCase());
  root.traverse((child) => {
    const label = child.name?.toLowerCase?.() ?? "";
    if (lowered.some((name) => label === name || label.includes(name))) {
      match = child;
    }
  });
  return match;
}

function findFrontCover(root) {
  return (
    findByName(root, ["frontcover", "front_cover", "cover_front"]) ||
    (() => {
      const meshes = [];
      root.traverse((child) => {
        if (child.isMesh) meshes.push(child);
      });
      meshes.sort((a, b) => b.position.x - a.position.x);
      return meshes[0] ?? null;
    })()
  );
}

function prepareFrontCoverPivot(coverMesh) {
  if (!coverMesh || coverMesh.userData.pivotReady) return coverMesh;

  const box = new THREE.Box3().setFromObject(coverMesh);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const pivot = new THREE.Group();
  pivot.name = `${coverMesh.name || "FrontCover"}_Pivot`;

  const parent = coverMesh.parent;
  if (!parent) return coverMesh;

  parent.add(pivot);
  pivot.position.set(box.min.x, center.y, center.z);
  parent.remove(coverMesh);
  pivot.add(coverMesh);
  coverMesh.position.sub(pivot.position);
  pivot.userData.pivotReady = true;
  return pivot;
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

export default function BookModel({ animationRefs, onReady }) {
  const bookRef = useRef(null);
  const parallaxGroupRef = useRef(null);
  const wordRefs = useRef([]);
  const parallaxControlRef = useRef(null);
  const floatRef = useRef(null);

  const { scene } = useGLTF(MODEL_PATH);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
          child.material.needsUpdate = true;
        }
      }
    });
    fitAndCenter(clone, TARGET_SIZE);
    return clone;
  }, [scene]);

  useLayoutEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    const frontCoverMesh = findFrontCover(clonedScene);
    const coverPivot = frontCoverMesh ? prepareFrontCoverPivot(frontCoverMesh) : null;

    animationRefs.current.book = book;
    animationRefs.current.frontCover = coverPivot;
  }, [animationRefs, clonedScene]);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    parallaxControlRef.current = createCursorParallax({ maxRotation: 0.12 });
    floatRef.current = createFloatAnimation(book, { amplitude: 0.06, duration: 3.2 });
    onReady?.();

    return () => {
      animationRefs.current.book = null;
      animationRefs.current.frontCover = null;
      parallaxControlRef.current?.dispose();
      floatRef.current?.kill();
    };
  }, [animationRefs, onReady]);

  useEffect(() => {
    animationRefs.current.conceptWords = wordRefs.current.filter(Boolean);
  });

  useFrame((_, delta) => {
    const parallaxGroup = parallaxGroupRef.current;
    const parallax = parallaxControlRef.current?.rotation;
    if (!parallaxGroup || !parallax) return;

    parallaxGroup.rotation.x = THREE.MathUtils.lerp(
      parallaxGroup.rotation.x,
      parallax.x,
      1 - Math.exp(-delta * 4)
    );
    parallaxGroup.rotation.y = THREE.MathUtils.lerp(
      parallaxGroup.rotation.y,
      parallax.y,
      1 - Math.exp(-delta * 4)
    );
  });

  return (
    <group ref={bookRef} position={[0.05, -0.05, 0]} rotation={[0.16, -0.55, 0.04]}>
      <group ref={parallaxGroupRef}>
        <primitive object={clonedScene} />

        {WORD_LAYOUT.map((word, index) => (
          <Text
            key={word.text}
            ref={(node) => {
              if (node) {
                node.userData.baseY = word.position[1];
                wordRefs.current[index] = node;
              }
            }}
            position={word.position}
            fontSize={0.11}
            color="#c9a84d"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.06}
            fillOpacity={0}
            material-transparent
            material-toneMapped={false}
          >
            {word.text}
          </Text>
        ))}
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
