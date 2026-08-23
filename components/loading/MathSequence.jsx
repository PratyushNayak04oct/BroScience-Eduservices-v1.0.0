import { GOLD, clamp, ink, rgba, strokeLine } from "@/lib/loading/canvasTheme";

const SYMBOLS = ["∫ f(x) dx", "π", "Σ", "√x", "∇", "lim", "sin θ", "a²+b²=c²"];

function plotY(x) {
  return Math.sin(x * 1.15) * Math.exp(-0.07 * Math.abs(x)) * 72;
}

export function drawMath(ctx, { cx, cy, alpha, time, mouse, compact }) {
  if (alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx + mouse.x * 10, cy + mouse.y * 8);

  const axis = compact ? 118 : 168;
  strokeLine(ctx, -axis, 0, axis, 0, GOLD, 0.32, 1);
  strokeLine(ctx, 0, -axis * 0.72, 0, axis * 0.72, GOLD, 0.28, 1);

  ctx.strokeStyle = rgba(GOLD, 0.72);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  const steps = compact ? 64 : 110;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = (t * 2 - 1) * axis * 0.92;
    const y = -plotY(x / 28) - mouse.y * 6 * Math.sin(t * Math.PI);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const pointCount = compact ? 6 : 10;
  for (let i = 0; i < pointCount; i += 1) {
    const t = (i + 0.5) / pointCount;
    const x = (t * 2 - 1) * axis * 0.8;
    const y = -plotY(x / 28) + Math.sin(time * 1.4 + i) * 2;
    ctx.fillStyle = rgba(GOLD, 0.85);
    ctx.beginPath();
    ctx.arc(x + mouse.x * 4, y + mouse.y * 3, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const construct = clamp((alpha - 0.15) * 1.4, 0, 1);
  const size = compact ? 42 : 58;
  const ax = -size;
  const ay = size * 0.7;
  const bx = size;
  const by = size * 0.7;
  const cx2 = 0;
  const cy2 = -size * 0.85;
  ctx.strokeStyle = rgba(ink(), 0.35 * construct);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(ax + (bx - ax) * construct, ay);
  if (construct > 0.4) {
    const edge = clamp((construct - 0.4) / 0.3, 0, 1);
    ctx.lineTo(bx + (cx2 - bx) * edge, by + (cy2 - by) * edge);
  }
  if (construct > 0.7) ctx.closePath();
  ctx.stroke();

  const circleT = clamp((construct - 0.75) / 0.25, 0, 1);
  if (circleT > 0) {
    ctx.strokeStyle = rgba(GOLD, 0.45 * circleT);
    ctx.beginPath();
    ctx.arc(0, 8, size * 0.92, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * circleT);
    ctx.stroke();
  }

  const shown = compact ? 4 : SYMBOLS.length;
  for (let i = 0; i < shown; i += 1) {
    const angle = (i / shown) * Math.PI * 2 + time * 0.08;
    const radius = (compact ? 132 : 188) + Math.sin(time + i) * 4;
    const x = Math.cos(angle) * radius + mouse.x * 12;
    const y = Math.sin(angle) * radius * 0.62 + mouse.y * 10;
    ctx.fillStyle = rgba(GOLD, 0.38 + Math.sin(time * 1.2 + i) * 0.08);
    ctx.font = `${compact ? 11 : 13}px "Cormorant Garamond", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText(SYMBOLS[i], x, y);
  }

  ctx.restore();
}

