import { GOLD, MAROON, IVORY, rgba } from "@/lib/loading/canvasTheme";

function atom(ctx, x, y, radius, fill, stroke) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function bond(ctx, x1, y1, x2, y2, alpha) {
  ctx.strokeStyle = rgba(GOLD, 0.45 * alpha);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function drawChemistry(ctx, { cx, cy, alpha, time, mouse, compact }) {
  if (alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  const rot = time * 0.18 + mouse.x * 0.25;
  ctx.rotate(rot * 0.15);
  ctx.translate(mouse.x * 12, mouse.y * 10);

  const scale = compact ? 0.78 : 1;

  for (let i = 0; i < 3; i += 1) {
    const tilt = i * 0.7;
    ctx.strokeStyle = rgba(GOLD, 0.22);
    ctx.beginPath();
    ctx.ellipse(0, 0, 70 * scale, 26 * scale, tilt, 0, Math.PI * 2);
    ctx.stroke();
    const a = time * (1.1 + i * 0.2) + i;
    atom(
      ctx,
      Math.cos(a) * 70 * scale,
      Math.sin(a) * 26 * scale,
      2.4,
      rgba(IVORY, 0.85),
      rgba(GOLD, 0.4)
    );
  }
  atom(ctx, 0, 0, 6.5 * scale, rgba(MAROON, 0.92), rgba(GOLD, 0.55));

  const water = compact ? { x: -130, y: 78 } : { x: -190, y: 96 };
  drawWater(ctx, water.x, water.y, scale, time);
  if (!compact) {
    drawCO2(ctx, 176, 88, scale);
    ctx.fillStyle = rgba(GOLD, 0.45);
    ctx.font = "13px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("H₂O", water.x - 10, water.y + 42);
    ctx.fillText("CO₂", 164, 132);
  } else {
    ctx.fillStyle = rgba(GOLD, 0.45);
    ctx.font = "12px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("H₂O", water.x - 8, water.y + 36);
  }

  ctx.restore();
}

function drawWater(ctx, x, y, scale, time) {
  const angle = (104.5 * Math.PI) / 180;
  const len = 34 * scale;
  const hx1 = x + Math.cos(Math.PI - angle / 2) * len;
  const hy1 = y + Math.sin(Math.PI - angle / 2) * len;
  const hx2 = x + Math.cos(angle / 2) * len;
  const hy2 = y + Math.sin(angle / 2) * len;
  const wobble = Math.sin(time * 1.3) * 1.5;
  bond(ctx, x, y, hx1, hy1 + wobble, 1);
  bond(ctx, x, y, hx2, hy2 - wobble, 1);
  atom(ctx, x, y, 8 * scale, rgba(GOLD, 0.85), rgba(IVORY, 0.3));
  atom(ctx, hx1, hy1 + wobble, 4.4 * scale, rgba(IVORY, 0.88), rgba(GOLD, 0.3));
  atom(ctx, hx2, hy2 - wobble, 4.4 * scale, rgba(IVORY, 0.88), rgba(GOLD, 0.3));
}

function drawCO2(ctx, x, y, scale) {
  const span = 38 * scale;
  bond(ctx, x - span, y, x + span, y, 1);
  bond(ctx, x - span, y - 3, x + span, y - 3, 0.7);
  atom(ctx, x, y, 7.2 * scale, rgba(MAROON, 0.88), rgba(GOLD, 0.4));
  atom(ctx, x - span, y, 5.2 * scale, rgba(GOLD, 0.8), rgba(IVORY, 0.25));
  atom(ctx, x + span, y, 5.2 * scale, rgba(GOLD, 0.8), rgba(IVORY, 0.25));
}
