"use client";

import { useEffect, useRef } from "react";
import { drawMath } from "./MathSequence";
import { drawPhysics } from "./PhysicsSequence";
import { drawChemistry } from "./ChemistrySequence";
import { drawBiology } from "./BiologySequence";
import { drawKnowledge } from "./KnowledgeReveal";
import { getPhaseAlphas, getQuality } from "@/lib/loading/loaderProgress";
import { GOLD, MAROON, rgba } from "@/lib/loading/canvasTheme";

export default function ScientificCanvas({ storyRef, reduced = false }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let quality = getQuality();
    const start = performance.now();

    const resize = () => {
      quality = getQuality();
      const dpr = quality.dpr;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.current = Array.from({ length: quality.particles }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        s: 0.8 + (i % 4) * 0.25,
      }));
    };

    const onMove = (event) => {
      mouse.current.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = (now) => {
      if (!running) return;
      const time = (now - start) / 1000;
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.08;
      const story = storyRef.current ?? 0;
      const phases = getPhaseAlphas(story);
      const cx = width * 0.5;
      const cy = height * (quality.compact ? 0.44 : 0.46);

      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx, width, height, mouse.current, time);

      if (!reduced) {
        const payload = {
          cx,
          cy,
          time,
          mouse: mouse.current,
          compact: quality.compact,
          w: width,
          h: height,
          alpha: 1,
        };
        drawMath(ctx, { ...payload, alpha: phases.math });
        drawPhysics(ctx, { ...payload, alpha: phases.physics });
        drawChemistry(ctx, { ...payload, alpha: phases.chemistry });
        drawBiology(ctx, { ...payload, alpha: phases.biology });
        drawKnowledge(ctx, { ...payload, alpha: Math.max(phases.knowledge, phases.brand * 0.35) });
        drawParticles(ctx, particles.current, mouse.current, width, height);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, storyRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function drawBackground(ctx, width, height, mouse, time) {
  const grid = 72;
  const offsetX = mouse.x * 8;
  const offsetY = mouse.y * 6;
  ctx.strokeStyle = rgba(GOLD, 0.045);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = (offsetX % grid) - grid; x < width + grid; x += grid) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = (offsetY % grid) - grid; y < height + grid; y += grid) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  const glow = ctx.createRadialGradient(
    width * 0.5 + mouse.x * 30,
    height * 0.42 + mouse.y * 20,
    40,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.55
  );
  glow.addColorStop(0, rgba(GOLD, 0.07 + Math.sin(time) * 0.01));
  glow.addColorStop(0.45, rgba(MAROON, 0.06));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawParticles(ctx, items, mouse, width, height) {
  for (const p of items) {
    const dx = (mouse.x * width * 0.5 + width * 0.5 - p.x) * 0.0008;
    const dy = (mouse.y * height * 0.5 + height * 0.5 - p.y) * 0.0008;
    p.vx = p.vx * 0.94 + dx;
    p.vy = p.vy * 0.94 + dy;
    p.x += p.vx * 8;
    p.y += p.vy * 8;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    ctx.fillStyle = rgba(GOLD, 0.22);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
    ctx.fill();
  }
}
