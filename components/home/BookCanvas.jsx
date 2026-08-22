"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import BookModel from "./BookModel";

const REST_CAMERA = { x: 0.72, y: 0.06, z: 3.05 };

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

      <hemisphereLight args={["#fff4e6", "#1c1210", 0.75]} />
      <ambientLight intensity={0.45} color="#f3e6c8" />
      <directionalLight position={[2.6, 2.8, 3.4]} intensity={1.7} color="#fff7ee" />
      <directionalLight position={[-2.8, 1.2, 1.6]} intensity={0.55} color="#c9a84d" />
      <spotLight
        position={[0.4, 2.2, 2.6]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.1}
        color="#f0d48a"
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
        camera={{ position: [REST_CAMERA.x, REST_CAMERA.y, REST_CAMERA.z], fov: 32, near: 0.1, far: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.02, 0)}
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
