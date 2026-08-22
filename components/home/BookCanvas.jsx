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
      <hemisphereLight args={["#ffffff", "#1c1210", 0.85]} />
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[2.4, 2.4, 3.2]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-2.4, 1.2, 1.8]} intensity={0.45} color="#c9a84d" />
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
      className={`relative h-full w-full ${className ?? ""}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={() => setHovered(true)}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1.35, 0.45, 3.2], fov: 35, near: 0.1, far: 40 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          gl.domElement.style.touchAction = "manipulation";
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent", width: "100%", height: "100%", touchAction: "manipulation" }}
      >
        <Suspense fallback={null}>
          <SceneContent animationRefs={animationRefs} onReady={onReady} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
