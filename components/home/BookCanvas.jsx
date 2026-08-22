"use client";

import { Suspense, useEffect, useState } from "react";
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
    return () => {
      animationRefs.current.camera = null;
    };
  }, [animationRefs, camera]);

  return null;
}

function SceneContent({ animationRefs, onReady, hovered, mouse }) {
  return (
    <>
      <CameraBridge animationRefs={animationRefs} />
      <hemisphereLight args={["#fff6ea", "#1a1012", 0.75]} />
      <ambientLight intensity={0.55} color="#f7efe0" />
      <directionalLight position={[2.4, 3.0, 3.2]} intensity={2.1} color="#fff8ee" />
      <BookModel animationRefs={animationRefs} onReady={onReady} hovered={hovered} mouse={mouse} />
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
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      });
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
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [1.15, 0.35, 3.15], fov: 32, near: 0.1, far: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <SceneContent
            animationRefs={animationRefs}
            onReady={onReady}
            hovered={hovered}
            mouse={mouse}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
