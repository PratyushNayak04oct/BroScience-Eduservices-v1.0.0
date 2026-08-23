import { GOLD, MAROON, IVORY, rgba, strokeLine } from "@/lib/loading/canvasTheme";

export function drawPhysics(ctx, { cx, cy, alpha, time, mouse, compact }) {
  if (alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx + mouse.x * 8, cy + mouse.y * 6);

  const orbitR = compact ? 78 : 108;
  ctx.strokeStyle = rgba(GOLD, 0.28);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, orbitR, orbitR * 0.42, -0.35, 0, Math.PI * 2);
  ctx.stroke();

  const angle = time * 0.9;
  const px = Math.cos(angle) * orbitR + mouse.x * 10;
  const py = Math.sin(angle) * orbitR * 0.42 + mouse.y * 6;
  ctx.fillStyle = rgba(GOLD, 0.95);
  ctx.beginPath();
  ctx.arc(px, py, 3.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = rgba(GOLD, 0.35);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(px, py);
  ctx.stroke();

  ctx.fillStyle = rgba(MAROON, 0.9);
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  const waveW = compact ? 150 : 220;
  ctx.strokeStyle = rgba(IVORY, 0.28);
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let i = 0; i <= 80; i += 1) {
    const t = i / 80;
    const x = -waveW / 2 + t * waveW;
    const y = 118 + Math.sin(t * Math.PI * 4 + time * 2 + mouse.x) * (10 + mouse.y * 4);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const vx = 86 + mouse.x * 18;
  const vy = -62 + mouse.y * 10;
  strokeLine(ctx, 40, 20, 40 + vx * 0.4, 20 + vy * 0.25, GOLD, 0.7, 1.4);
  ctx.fillStyle = rgba(GOLD, 0.7);
  ctx.font = `${compact ? 12 : 14}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText("F = ma", 48, -8);
  ctx.fillText("E = mc²", compact ? -120 : -168, compact ? -88 : -112);

  ctx.restore();
}
