"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import BookModel from "./BookModel";

if (typeof window !== "undefined" && !window.__broscienceFilteredThreeWarnings) {
  window.__broscienceFilteredThreeWarnings = true;
  const warn = console.warn.bind(console);
  console.warn = (...args) => {
    const text = args.map(String).join(" ");
    if (text.includes("THREE.Clock") || text.includes("X3557")) return;
    warn(...args);
  };
}

function CameraBridge({ animationRefs }) {
  const { camera } = useThree();

  useEffect(() => {
    animationRefs.current.camera = camera;
    camera.lookAt(0, 0, 0);
    return () => {
      animationRefs.current.camera = null;
    };
  }, [animationRefs, camera]);

  return null;
}

function SceneContent({ animationRefs, onReady, hoverRef, mouseRef }) {
  return (
    <>
      <CameraBridge animationRefs={animationRefs} />
      <hemisphereLight args={["#fff4e4", "#3a1818", 0.95]} />
      <ambientLight intensity={0.85} color="#fff6ea" />
      <directionalLight position={[2.2, 2.8, 3.4]} intensity={2.6} color="#fff8ee" />
      <directionalLight position={[-1.8, 1.2, 2.2]} intensity={0.7} color="#e6b640" />
      <BookModel
        animationRefs={animationRefs}
        onReady={onReady}
        hoverRef={hoverRef}
        mouseRef={mouseRef}
      />
    </>
  );
}

export function isWebGLAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function BookCanvas({ animationRefs, onReady, className }) {
  const hoverRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const camera = useMemo(
    () => ({ position: [0.55, 0.18, 4.55], fov: 26, near: 0.1, far: 40 }),
    []
  );
  const gl = useMemo(
    () => ({ antialias: true, alpha: true, powerPreference: "high-performance" }),
    []
  );

  useEffect(() => {
    const onMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!isWebGLAvailable()) {
    return null;
  }

  return (
    <div
      className={`relative h-full w-full ${className ?? ""}`}
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={camera}
        gl={gl}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <SceneContent
            animationRefs={animationRefs}
            onReady={onReady}
            hoverRef={hoverRef}
            mouseRef={mouseRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
