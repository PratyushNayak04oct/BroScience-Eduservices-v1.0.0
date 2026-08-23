"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
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

// World-space extents that must stay in frame: the open spread is ~2.62 wide,
// the closed book ~1.9 tall. Small margins keep the book dominant in its column.
const NEEDED_WIDTH  = 2.8;
const NEEDED_HEIGHT = 2.15;
const CAM_DIST      = 4.7;

function CameraBridge({ animationRefs }) {
  const { camera, size } = useThree();

  // Three's fov is vertical, so a narrow container would crop the wide open
  // spread. Derive the fov from the aspect ratio to guarantee the horizontal
  // field, with a floor so wide containers don't push the book too far away.
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const byWidth  = 2 * Math.atan(NEEDED_WIDTH  / (2 * CAM_DIST * Math.max(aspect, 0.01)));
    const byHeight = 2 * Math.atan(NEEDED_HEIGHT / (2 * CAM_DIST));
    camera.fov = THREE.MathUtils.radToDeg(Math.max(byWidth, byHeight));
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useEffect(() => {
    animationRefs.current.camera = camera;
    // Slight downward look. Combined with the book's own -24° tilt when open,
    // this gives the ~30° elevated read angle of the reference composition.
    camera.lookAt(0, 0.02, 0);
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
      {/* Page content is unlit, so these lights shape the cover, spine, page
          blocks and the gold foil only. Key comes from above-front so it reads
          on both the upright closed cover and the laid-back open spread. */}
      <hemisphereLight args={["#fff6e8", "#2c1a14", 0.6]} />
      <ambientLight intensity={0.55} color="#fff6ea" />
      <directionalLight position={[0.6, 3.2, 3.6]} intensity={2.2} color="#fff8ee" />
      <directionalLight position={[-2.2, -0.6, 3.0]} intensity={0.8} color="#fff0e0" />
      <directionalLight position={[-1.0, 1.2, 2.6]} intensity={0.7} color="#f0c040" />
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
  // Elevated and centred; CameraBridge refines the fov from the container aspect.
  const camera = useMemo(
    () => ({ position: [0, 0.5, CAM_DIST], fov: 36, near: 0.1, far: 40 }),
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
