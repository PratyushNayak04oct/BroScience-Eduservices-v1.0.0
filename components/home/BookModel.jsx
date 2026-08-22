"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { CONCEPT_WORDS, createCursorParallax, createFloatAnimation } from "@/lib/bookAnimation";
import { prefersReducedMotion } from "@/lib/gsap";

const PAGE_W = 1.22;
const PAGE_H = 1.68;
const PAGE_T = 0.012;
const PAGE_COUNT = 8;
const COVER_T = 0.03;
const COVER_OVERHANG = 0.04;
const REST_ROTATION = { x: 0.2, y: -0.58, z: 0.04 };
const REST_POSITION = { x: 0.08, y: -0.04, z: 0 };

function LeatherMaterial({ color, roughness = 0.42, metalness = 0.12, map }) {
  return (
    <meshStandardMaterial
      color={color}
      map={map}
      roughness={roughness}
      metalness={metalness}
      envMapIntensity={0.7}
    />
  );
}

function PaperMaterial({ color = "#f4ead8" }) {
  return <meshStandardMaterial color={color} roughness={0.9} metalness={0} />;
}

function CoverPlate({ map, width, height, thickness }) {
  return (
    <group>
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={[width, height, thickness]} />
        <LeatherMaterial color="#121010" />
      </mesh>
      {map ? (
        <mesh position={[width / 2, 0, thickness / 2 + 0.0015]}>
          <planeGeometry args={[width * 0.9, height * 0.9]} />
          <meshStandardMaterial map={map} roughness={0.35} metalness={0.16} />
        </mesh>
      ) : null}
    </group>
  );
}

function PageLeaf({ width, height, thickness, shade }) {
  return (
    <mesh position={[width / 2, 0, 0]}>
      <boxGeometry args={[width, height, thickness]} />
      <PaperMaterial color={shade} />
    </mesh>
  );
}

export default function BookModel({ animationRefs, onReady, hovered = false }) {
  const bookRef = useRef(null);
  const parallaxGroupRef = useRef(null);
  const coverRef = useRef(null);
  const pageRefs = useRef([]);
  const wordRefs = useRef([]);
  const hoverTlRef = useRef(null);
  const parallaxControlRef = useRef(null);
  const floatRef = useRef(null);
  const [rigReady, setRigReady] = useState(false);

  const coverMap = useTexture("/brand/logo.png");

  useMemo(() => {
    coverMap.colorSpace = THREE.SRGBColorSpace;
    coverMap.anisotropy = 8;
    coverMap.needsUpdate = true;
  }, [coverMap]);

  const coverW = PAGE_W + COVER_OVERHANG;
  const coverH = PAGE_H + COVER_OVERHANG;
  const blockT = PAGE_COUNT * PAGE_T;
  const mid = Math.floor(PAGE_COUNT / 2);
  const pageShades = useMemo(
    () =>
      Array.from({ length: PAGE_COUNT }, (_, i) => {
        const t = i / Math.max(PAGE_COUNT - 1, 1);
        const r = 0.96 - t * 0.03;
        const g = 0.91 - t * 0.03;
        const b = 0.82 - t * 0.02;
        return new THREE.Color(r, g, b);
      }),
    []
  );

  useEffect(() => {
    const book = bookRef.current;
    if (!book) return;

    animationRefs.current.book = book;
    animationRefs.current.frontCover = coverRef.current;
    animationRefs.current.pages = pageRefs.current.filter(Boolean);
    animationRefs.current.conceptWords = wordRefs.current.filter(Boolean);

    parallaxControlRef.current = createCursorParallax({ maxRotation: 0.08 });
    floatRef.current = createFloatAnimation(book, { amplitude: 0.045, duration: 3.4 });
    onReady?.();
    setRigReady(true);

    return () => {
      animationRefs.current.book = null;
      animationRefs.current.frontCover = null;
      animationRefs.current.pages = [];
      animationRefs.current.conceptWords = [];
      parallaxControlRef.current?.dispose();
      floatRef.current?.kill();
    };
  }, [animationRefs, onReady]);

  useEffect(() => {
    if (!rigReady) return;

    const book = bookRef.current;
    const cover = coverRef.current;
    const pages = pageRefs.current.filter(Boolean);
    const words = wordRefs.current.filter(Boolean);
    if (!book || !cover) return;

    const reduced = prefersReducedMotion();
    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
      onReverseComplete: () => {
        animationRefs.current.hoverLocked = false;
        animationRefs.current.scrollTimeline?.resume();
      },
    });

    const camera = animationRefs.current.camera;

    timeline
      .to(
        book.rotation,
        { x: 0.58, y: 0, z: 0, duration: reduced ? 0.01 : 0.7 },
        0
      )
      .to(
        book.position,
        { x: 0, y: 0.06, z: 0.18, duration: reduced ? 0.01 : 0.7 },
        0
      )
      .to(
        cover.rotation,
        { y: -Math.PI * 0.97, duration: reduced ? 0.01 : 0.55 },
        reduced ? 0 : 0.12
      );

    if (camera) {
      timeline.to(
        camera.position,
        {
          x: 0,
          y: 0.78,
          z: 3.25,
          duration: reduced ? 0.01 : 0.7,
          onUpdate: () => camera.lookAt(0, 0.04, 0),
        },
        0
      );
    }

    pages.forEach((page, index) => {
      if (index >= mid) return;
      const open = -Math.PI * (0.97 - index * 0.012);
      timeline.to(
        page.rotation,
        {
          y: open,
          duration: reduced ? 0.01 : 0.32,
          ease: "power3.inOut",
        },
        reduced ? 0 : 0.32 + index * 0.11
      );
    });

    pages.forEach((page, index) => {
      if (index < mid) return;
      timeline.to(
        page.rotation,
        { y: -0.045 * (index - mid), duration: reduced ? 0.01 : 0.35 },
        reduced ? 0 : 0.55
      );
    });

    words.forEach((word, index) => {
      if (!word.material) return;
      timeline.to(
        word.material,
        { opacity: 1, duration: reduced ? 0.01 : 0.28 },
        reduced ? 0 : 0.7 + index * 0.08
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

    if (hovered) {
      animationRefs.current.hoverLocked = true;
      animationRefs.current.scrollTimeline?.pause();
      floatRef.current?.kill();
      timeline.play();
      return;
    }

    timeline.reverse();
    const book = bookRef.current;
    if (book) {
      floatRef.current?.kill();
      floatRef.current = createFloatAnimation(book, { amplitude: 0.045, duration: 3.4 });
    }
  }, [animationRefs, hovered]);

  useFrame((_, delta) => {
    if (hovered || prefersReducedMotion()) return;
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
    <group ref={bookRef} position={[REST_POSITION.x, REST_POSITION.y, REST_POSITION.z]} rotation={[REST_ROTATION.x, REST_ROTATION.y, REST_ROTATION.z]}>
      <group ref={parallaxGroupRef}>
        {/* Back cover */}
        <group position={[0, 0, -blockT / 2 - COVER_T / 2]}>
          <CoverPlate width={coverW} height={coverH} thickness={COVER_T} />
        </group>

        {/* Spine */}
        <mesh position={[-COVER_T / 2, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[COVER_T, coverH, blockT + COVER_T * 2]} />
          <LeatherMaterial color="#6b1d26" roughness={0.45} metalness={0.2} />
        </mesh>

        {/* Remaining page block under unflipped pages */}
        <mesh position={[PAGE_W / 2 + 0.01, 0, 0]}>
          <boxGeometry args={[PAGE_W * 0.98, PAGE_H * 0.985, blockT * 0.92]} />
          <PaperMaterial color="#efe4cf" />
        </mesh>

        {/* Individual pages */}
        {pageShades.map((shade, index) => (
          <group
            key={`page-${index}`}
            ref={(node) => {
              pageRefs.current[index] = node;
            }}
            position={[0, 0, blockT / 2 - index * PAGE_T - PAGE_T / 2]}
          >
            <PageLeaf
              width={PAGE_W}
              height={PAGE_H}
              thickness={PAGE_T}
              shade={shade}
            />
          </group>
        ))}

        {/* Front cover — hinged at the spine */}
        <group ref={coverRef} position={[0, 0, blockT / 2 + COVER_T / 2]}>
          <CoverPlate map={coverMap} width={coverW} height={coverH} thickness={COVER_T} />
          <mesh position={[coverW * 0.14, 0, COVER_T / 2 + 0.001]}>
            <boxGeometry args={[0.03, coverH * 0.62, 0.002]} />
            <meshStandardMaterial color="#c9a84d" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>

        {/* Open-spread words */}
        {CONCEPT_WORDS.map((word, index) => {
          const left = index < 2;
          const row = index % 2;
          return (
            <Text
              key={word}
              ref={(node) => {
                if (node) {
                  node.userData.baseY = 0.28 - row * 0.28;
                  wordRefs.current[index] = node;
                }
              }}
              position={left ? [-0.58, 0.22 - row * 0.32, 0.04] : [0.28, 0.22 - row * 0.32, 0.04]}
              fontSize={0.11}
              color="#8a6d28"
              anchorX={left ? "right" : "left"}
              anchorY="middle"
              letterSpacing={0.08}
              fillOpacity={0}
              material-transparent
              material-toneMapped={false}
            >
              {word}
            </Text>
          );
        })}
      </group>
    </group>
  );
}
