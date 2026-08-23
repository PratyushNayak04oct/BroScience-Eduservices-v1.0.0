import { GOLD, MAROON, drawGlow, rgba } from "@/lib/loading/canvasTheme";

export function drawKnowledge(ctx, { cx, cy, alpha, time, w, h }) {
  if (alpha <= 0.01) return;

  ctx.save();
  const pull = alpha;
  ctx.translate(cx, cy);
  ctx.scale(1 - pull * 0.35, 1 - pull * 0.35);

  drawGlow(ctx, 0, 0, Math.min(w, h) * 0.34, GOLD, 0.16 * pull);
  drawGlow(ctx, 0, 0, Math.min(w, h) * 0.18, MAROON, 0.1 * pull);

  const count = 18;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 + time * 0.2;
    const radius = (1 - pull * 0.72) * (110 + (i % 4) * 18);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.62;
    ctx.fillStyle = rgba(i % 2 ? GOLD : MAROON, 0.45 * (1 - pull * 0.3));
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
