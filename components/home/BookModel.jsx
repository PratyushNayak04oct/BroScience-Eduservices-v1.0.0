"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { createCursorParallax, createFloatAnimation } from "@/lib/bookAnimation";
import {
  SPREAD_COPY,
  createCoverCanvas,
  createLinedPaperCanvas,
  createSpreadCanvas,
} from "@/lib/bookTextures";
import { prefersReducedMotion } from "@/lib/gsap";

const PAGE_W = 1.18;
const PAGE_H = 1.62;
const PAGE_T = 0.01;
const PAGE_COUNT = 10;
const COVER_T = 0.034;
const COVER_OVERHANG = 0.045;
const REST_ROTATION = { x: 0.06, y: -0.48, z: 0.02 };
const REST_POSITION = { x: 0.04, y: -0.06, z: 0 };
const OPEN_ROTATION = { x: 0.16, y: 0, z: 0 };
const OPEN_POSITION = { x: 0, y: 0.02, z: 0.08 };
const REST_CAMERA = { x: 0.72, y: 0.06, z: 3.05 };
const OPEN_CAMERA = { x: 0, y: 0.16, z: 2.85 };

function canvasTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createBentPage(width, height, segments = 14, bend = 0.045) {
  const geometry = new THREE.PlaneGeometry(width, height, segments, 2);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const t = (x + width / 2) / width;
    positions.setZ(i, Math.sin(t * Math.PI) * bend);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function LeatherMaterial({ color = "#14110f", map, roughness = 0.48, metalness = 0.14 }) {
  return (
    <meshStandardMaterial
      color={map ? "#ffffff" : color}
      map={map}
      roughness={roughness}
      metalness={metalness}
    />
  );
}

export default function BookModel({ animationRefs, onReady, hovered = false }) {
  const bookRef = useRef(null);
  const parallaxGroupRef = useRef(null);
  const coverRef = useRef(null);
  const pageRefs = useRef([]);
  const hoverTlRef = useRef(null);
  const parallaxControlRef = useRef(null);
  const floatRef = useRef(null);
  const [rigReady, setRigReady] = useState(false);
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = "/brand/logo.png";
    image.onload = () => setLogoImage(image);
  }, []);

  const textures = useMemo(() => {
    if (typeof document === "undefined") return null;
    return {
      cover: canvasTexture(createCoverCanvas(logoImage)),
      paper: canvasTexture(createLinedPaperCanvas()),
      left: canvasTexture(createSpreadCanvas(SPREAD_COPY.left)),
      right: canvasTexture(createSpreadCanvas(SPREAD_COPY.right)),
    };
  }, [logoImage]);

  useEffect(() => {
    return () => {
      if (!textures) return;
      Object.values(textures).forEach((texture) => texture.dispose());
    };
  }, [textures]);

  const coverW = PAGE_W + COVER_OVERHANG;
  const coverH = PAGE_H + COVER_OVERHANG;
  const blockT = PAGE_COUNT * PAGE_T;
  const mid = Math.floor(PAGE_COUNT / 2);
  const pageGeometry = useMemo(() => createBentPage(PAGE_W, PAGE_H), []);

  useLayoutEffect(() => {
    const book = bookRef.current;
    if (!book) return;
    animationRefs.current.book = book;
    animationRefs.current.frontCover = coverRef.current;
    onReady?.();
    setRigReady(true);
  }, [animationRefs, onReady]);

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    parallaxControlRef.current = createCursorParallax({ maxRotation: 0.06 });
    floatRef.current = createFloatAnimation(book, { amplitude: 0.035, duration: 3.6 });

    return () => {
      animationRefs.current.book = null;
      animationRefs.current.frontCover = null;
      parallaxControlRef.current?.dispose();
      floatRef.current?.kill();
    };
  }, [animationRefs]);

  useEffect(() => {
    if (!rigReady) return;

    const book = bookRef.current;
    const cover = coverRef.current;
    const pages = pageRefs.current.filter(Boolean);
    if (!book || !cover) return;

    const reduced = prefersReducedMotion();
    const camera = animationRefs.current.camera;
    const duration = reduced ? 0.01 : 0.75;

    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
    });

    timeline
      .to(book.rotation, { ...OPEN_ROTATION, duration }, 0)
      .to(book.position, { ...OPEN_POSITION, duration }, 0)
      .to(cover.rotation, { y: -Math.PI * 0.98, duration: reduced ? 0.01 : 0.6 }, reduced ? 0 : 0.08);

    if (camera) {
      timeline.to(
        camera.position,
        {
          ...OPEN_CAMERA,
          duration,
          onUpdate: () => camera.lookAt(0, 0.02, 0),
        },
        0
      );
    }

    pages.forEach((page, index) => {
      if (index >= mid) return;
      timeline.to(
        page.rotation,
        {
          y: -Math.PI * (0.985 - index * 0.01),
          duration: reduced ? 0.01 : 0.34,
          ease: "power3.inOut",
        },
        reduced ? 0 : 0.28 + index * 0.09
      );
    });

    hoverTlRef.current = timeline;
    return () => {
      timeline.kill();
      hoverTlRef.current = null;
    };
  }, [animationRefs, mid, rigReady]);

  useEffect(() => {
    const timeline = hoverTlRef.current;
    if (!timeline) return;
    const camera = animationRefs.current.camera;

    if (hovered) {
      floatRef.current?.kill();
      timeline.play();
      return;
    }

    timeline.reverse();
    if (camera) {
      gsap.to(camera.position, {
        ...REST_CAMERA,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(0, 0.02, 0),
      });
    }
    const book = bookRef.current;
    if (book) {
      floatRef.current?.kill();
      floatRef.current = createFloatAnimation(book, { amplitude: 0.035, duration: 3.6 });
    }
  }, [animationRefs, hovered]);

  useFrame((_, delta) => {
    if (hovered || prefersReducedMotion()) return;
    const group = parallaxGroupRef.current;
    const parallax = parallaxControlRef.current?.rotation;
    if (!group || !parallax) return;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, parallax.x, 1 - Math.exp(-delta * 4));
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, parallax.y, 1 - Math.exp(-delta * 4));
  });

  const paperMat = textures?.paper;
  const leftMat = textures?.left;
  const rightMat = textures?.right;

  return (
    <group
      ref={bookRef}
      position={[REST_POSITION.x, REST_POSITION.y, REST_POSITION.z]}
      rotation={[REST_ROTATION.x, REST_ROTATION.y, REST_ROTATION.z]}
    >
      <group ref={parallaxGroupRef}>
        {/* Back cover */}
        <group position={[0, 0, -blockT / 2 - COVER_T / 2]}>
          <RoundedBox args={[coverW, coverH, COVER_T]} radius={0.018} smoothness={4} position={[coverW / 2, 0, 0]}>
            <LeatherMaterial />
          </RoundedBox>
        </group>

        {/* Rounded spine */}
        <mesh position={[0.002, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry
            args={[blockT / 2 + COVER_T / 2, blockT / 2 + COVER_T / 2, coverH, 28, 1, false, Math.PI * 0.55, Math.PI * 0.9]}
          />
          <LeatherMaterial color="#6b1d26" roughness={0.4} metalness={0.22} />
        </mesh>

        {/* Page block — stacked paper edge */}
        <RoundedBox
          args={[PAGE_W * 0.985, PAGE_H * 0.985, blockT * 0.94]}
          radius={0.01}
          smoothness={3}
          position={[PAGE_W / 2 + 0.012, 0, 0]}
        >
          <meshStandardMaterial color="#efe2c8" roughness={0.92} />
        </RoundedBox>
        <mesh position={[PAGE_W + 0.018, 0, 0]}>
          <boxGeometry args={[0.01, PAGE_H * 0.97, blockT * 0.88]} />
          <meshStandardMaterial color="#e8d7b4" roughness={0.85} />
        </mesh>

        {/* Head and tail bands */}
        <mesh position={[0.04, PAGE_H / 2 - 0.01, 0]}>
          <boxGeometry args={[0.07, 0.016, blockT + 0.01]} />
          <meshStandardMaterial color="#c9a84d" metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[0.04, -PAGE_H / 2 + 0.01, 0]}>
          <boxGeometry args={[0.07, 0.016, blockT + 0.01]} />
          <meshStandardMaterial color="#6b1d26" roughness={0.45} />
        </mesh>

        {/* Flipping pages */}
        {Array.from({ length: PAGE_COUNT }).map((_, index) => {
          const isLeftSpread = index === mid - 1;
          const isRightSpread = index === mid;
          return (
            <group
              key={`page-${index}`}
              ref={(node) => {
                pageRefs.current[index] = node;
              }}
              position={[0, 0, blockT / 2 - index * PAGE_T - PAGE_T / 2]}
            >
              <mesh geometry={pageGeometry} position={[PAGE_W / 2, 0, 0]}>
                <meshStandardMaterial
                  map={isRightSpread ? rightMat : paperMat}
                  color={isRightSpread || paperMat ? "#ffffff" : "#f3ead8"}
                  roughness={0.88}
                  side={THREE.FrontSide}
                />
              </mesh>
              <mesh geometry={pageGeometry} position={[PAGE_W / 2, 0, -0.001]} rotation={[0, Math.PI, 0]}>
                <meshStandardMaterial
                  map={isLeftSpread ? leftMat : paperMat}
                  color="#ffffff"
                  roughness={0.88}
                  side={THREE.FrontSide}
                />
              </mesh>
            </group>
          );
        })}

        {/* Front cover + inner endpaper */}
        <group ref={coverRef} position={[0, 0, blockT / 2 + COVER_T / 2]}>
          <RoundedBox args={[coverW, coverH, COVER_T]} radius={0.018} smoothness={4} position={[coverW / 2, 0, 0]}>
            <LeatherMaterial />
          </RoundedBox>
          {textures?.cover && (
            <mesh position={[coverW / 2, 0, COVER_T / 2 + 0.0016]}>
              <planeGeometry args={[coverW * 0.9, coverH * 0.9]} />
              <meshStandardMaterial map={textures.cover} roughness={0.38} metalness={0.16} />
            </mesh>
          )}
          <mesh position={[coverW / 2, 0, -COVER_T / 2 - 0.001]}>
            <planeGeometry args={[coverW * 0.92, coverH * 0.92]} />
            <meshStandardMaterial color="#6b1d26" roughness={0.7} />
          </mesh>
        </group>

      </group>
    </group>
  );
}
