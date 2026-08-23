import { GOLD, MAROON, IVORY, rgba } from "@/lib/loading/canvasTheme";

export function drawBiology(ctx, { cx, cy, alpha, time, mouse, compact }) {
  if (alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx + mouse.x * 10, cy + mouse.y * 8);
  ctx.rotate(mouse.x * 0.12 + time * 0.06);

  const height = compact ? 168 : 230;
  const radius = compact ? 18 : 26;
  const steps = compact ? 18 : 28;

  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const y = (t - 0.5) * height;
    const a = t * Math.PI * 4.2 + time * 0.7;
    const x1 = Math.cos(a) * radius;
    const z1 = Math.sin(a);
    const x2 = Math.cos(a + Math.PI) * radius;
    const z2 = Math.sin(a + Math.PI);

    ctx.strokeStyle = rgba(GOLD, 0.18 + (z1 + 1) * 0.08);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();

    ctx.fillStyle = rgba(GOLD, 0.55 + z1 * 0.2);
    ctx.beginPath();
    ctx.arc(x1, y, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = rgba(MAROON, 0.7 + z2 * 0.15);
    ctx.beginPath();
    ctx.arc(x2, y, 2.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = rgba(GOLD, 0.55);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const y = (t - 0.5) * height;
    const a = t * Math.PI * 4.2 + time * 0.7;
    const x = Math.cos(a) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = rgba(MAROON, 0.5);
  ctx.beginPath();
  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const y = (t - 0.5) * height;
    const a = t * Math.PI * 4.2 + time * 0.7 + Math.PI;
    const x = Math.cos(a) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  if (!compact) {
    ctx.strokeStyle = rgba(IVORY, 0.12);
    ctx.beginPath();
    ctx.ellipse(-150, 20, 46, 32, -0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(150, -10, 38, 26, 0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = rgba(GOLD, 0.2);
    ctx.beginPath();
    ctx.arc(-150, 20, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
