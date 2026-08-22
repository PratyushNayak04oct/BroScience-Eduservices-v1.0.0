"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import BookModel from "./BookModel";

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

function SceneContent({ animationRefs, onReady, hovered }) {
  return (
    <>
      <CameraBridge animationRefs={animationRefs} />

      <hemisphereLight args={["#fff6ea", "#1a1012", 0.9]} />
      <ambientLight intensity={0.6} color="#f7edd8" />
      <directionalLight position={[3.2, 4.5, 4]} intensity={2.2} color="#fff8ee" />
      <directionalLight position={[-3.4, 1.6, 1.4]} intensity={0.75} color="#c9a84d" />
      <spotLight
        position={[0.2, 3.6, 2.4]}
        angle={0.55}
        penumbra={0.85}
        intensity={1.5}
        color="#e8c56a"
      />

      <BookModel animationRefs={animationRefs} onReady={onReady} hovered={hovered} />
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

  if (!isWebGLAvailable()) {
    return null;
  }

  return (
    <div
      className={`relative h-full w-full cursor-pointer ${className ?? ""}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1.15, 0.38, 3.55], fov: 34, near: 0.1, far: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.05, 0)}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <SceneContent animationRefs={animationRefs} onReady={onReady} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
