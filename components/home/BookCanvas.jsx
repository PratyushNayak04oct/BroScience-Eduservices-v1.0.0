"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// Tight enough that the open spread fills the scene and page copy is readable.
// A little margin remains so the turn does not clip the cover edges.
const NEEDED_WIDTH  = 2.72;
const NEEDED_HEIGHT = 2.02;
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
      <pointLight position={[0, 0.15, 0.55]} intensity={3.2} color="#f3c14a" distance={5.5} decay={2} />
      <pointLight position={[0, -0.2, -0.8]} intensity={1.4} color="#8a1c2c" distance={4.5} decay={2} />
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

export default function BookCanvas({ animationRefs, onReady, hoverRef: hoverRefProp, className }) {
  const hoverFallback = useRef(false);
  const hoverRef = hoverRefProp ?? hoverFallback;
  const mouseRef = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef(null);
  const [contextKey, setContextKey] = useState(0);
  // Elevated and centred; CameraBridge refines the fov from the container aspect.
  const camera = useMemo(
    () => ({ position: [0, 0.5, CAM_DIST], fov: 36, near: 0.1, far: 40 }),
    []
  );
  const gl = useMemo(
    () => ({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    }),
    []
  );

  useEffect(() => {
    const pad = 12;
    let closeTimer = 0;

    const canHover = () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const isInside = (x, y) => {
      const el = wrapperRef.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
    };

    const onMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!canHover()) return;
      hoverRef.current = isInside(event.clientX, event.clientY);
    };

    const seed = () => {
      if (!canHover()) return;
      const el = wrapperRef.current;
      if (el) {
        try {
          if (el.matches(":hover")) hoverRef.current = true;
        } catch {
          /* :hover unsupported */
        }
      }
    };

    const onDown = (event) => {
      if (canHover() || event.pointerType === "mouse") return;
      if (!isInside(event.clientX, event.clientY)) return;
      hoverRef.current = true;
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        hoverRef.current = false;
      }, 10000);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    const frame = requestAnimationFrame(seed);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.clearTimeout(closeTimer);
      cancelAnimationFrame(frame);
    };
  }, [hoverRef]);

  // A dropped GPU context otherwise leaves a permanently blank canvas: the
  // default action makes the loss final, so prevent it to allow restoration and
  // remount the scene once the browser hands the context back, rebuilding the
  // textures and geometry that died with it.
  const handleCreated = useCallback(({ gl }) => {
    gl.setClearColor(0x000000, 0);
    const canvas = gl.domElement;
    const onLost = (event) => event.preventDefault();
    const onRestored = () => setContextKey((k) => k + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
  }, []);

  if (!isWebGLAvailable()) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full ${className ?? ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hoverRef.current = false;
      }}
    >
      <Canvas
        key={contextKey}
        dpr={[1, 1.5]}
        camera={camera}
        gl={gl}
        onCreated={handleCreated}
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
