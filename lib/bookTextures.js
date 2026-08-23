// Canvas texture generation for the 3D book.
//
// The open spread is drawn as ONE wide canvas and then sliced into a left and a
// right half. This is deliberate: the large centre quote and the footer rule and
// text all straddle the gutter, so drawing them once on a single canvas is the
// only way to guarantee they line up across the two page meshes.

const SPREAD_W = 2048;
const SPREAD_H = 1480;
const GUTTER   = SPREAD_W / 2;

const INK        = "#34291b";
const INK_SOFT   = "#4e4335";
const INK_FAINT  = "#6b5b42";
const RULE       = "rgba(78,58,34,0.34)";

// ─── helpers ─────────────────────────────────────────────────────────────────

// Composites a fine paper grain over whatever has already been painted.
// Note: putImageData cannot be used directly on the target here — it REPLACES
// pixels rather than blending, which would wipe the gradients underneath. So the
// noise is built once as a small opaque tile and then blended in as a pattern.
function grain(ctx, w, h, alpha) {
  const tile  = document.createElement("canvas");
  tile.width  = 256;
  tile.height = 256;
  const tctx  = tile.getContext("2d");

  const img = tctx.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + Math.random() * 90;
    img.data[i]     = v;
    img.data[i + 1] = v * 0.9;
    img.data[i + 2] = v * 0.68;
    img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle   = ctx.createPattern(tile, "repeat");
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// Draws text with manual letter spacing (ctx.letterSpacing is not universal).
function tracked(ctx, text, x, y, spacing, align = "left") {
  const chars = [...text];
  let total = 0;
  chars.forEach((c) => { total += ctx.measureText(c).width + spacing; });
  total -= spacing;

  let cursor = x;
  if (align === "center") cursor = x - total / 2;
  if (align === "right")  cursor = x - total;

  chars.forEach((c) => {
    ctx.fillText(c, cursor, y);
    cursor += ctx.measureText(c).width + spacing;
  });
  return total;
}

// Word-wraps into a fixed column, returns the baseline after the last line.
function wrap(ctx, text, x, y, maxWidth, lineHeight, align = "left") {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;

  const flush = () => {
    if (!line) return;
    if (align === "center") ctx.fillText(line, x, cursorY);
    else ctx.fillText(line, x, cursorY);
  };

  words.forEach((word, i) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      flush();
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  });
  flush();
  return cursorY;
}

// ─── aged paper base for the full spread ─────────────────────────────────────

function paintAgedSpread(ctx) {
  // Bright warm cream base — the reference reads as light paper with the ageing
  // concentrated at the edges, not an overall wash.
  const base = ctx.createLinearGradient(0, 0, 0, SPREAD_H);
  base.addColorStop(0,    "#f6efdd");
  base.addColorStop(0.35, "#f2e9d2");
  base.addColorStop(0.75, "#eee3c6");
  base.addColorStop(1,    "#e7dab6");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SPREAD_W, SPREAD_H);

  // Staining toward both outer edges (the fore-edges of the book)
  const outer = ctx.createLinearGradient(0, 0, SPREAD_W, 0);
  outer.addColorStop(0,    "rgba(138,100,40,0.30)");
  outer.addColorStop(0.11, "rgba(138,100,40,0.04)");
  outer.addColorStop(0.5,  "rgba(138,100,40,0)");
  outer.addColorStop(0.89, "rgba(138,100,40,0.04)");
  outer.addColorStop(1,    "rgba(138,100,40,0.30)");
  ctx.fillStyle = outer;
  ctx.fillRect(0, 0, SPREAD_W, SPREAD_H);

  // Staining along the head and tail
  const vert = ctx.createLinearGradient(0, 0, 0, SPREAD_H);
  vert.addColorStop(0,    "rgba(132,94,36,0.20)");
  vert.addColorStop(0.08, "rgba(132,94,36,0.01)");
  vert.addColorStop(0.92, "rgba(132,94,36,0.02)");
  vert.addColorStop(1,    "rgba(132,94,36,0.22)");
  ctx.fillStyle = vert;
  ctx.fillRect(0, 0, SPREAD_W, SPREAD_H);

  // Gutter shadow — symmetric, so each sliced half gets its inner edge shaded.
  // Kept light because the physical spine already reads dark in the render.
  const gut = ctx.createLinearGradient(GUTTER - 230, 0, GUTTER + 230, 0);
  gut.addColorStop(0,    "rgba(70,48,18,0)");
  gut.addColorStop(0.34, "rgba(70,48,18,0.10)");
  gut.addColorStop(0.5,  "rgba(58,38,14,0.22)");
  gut.addColorStop(0.66, "rgba(70,48,18,0.10)");
  gut.addColorStop(1,    "rgba(70,48,18,0)");
  ctx.fillStyle = gut;
  ctx.fillRect(GUTTER - 230, 0, 460, SPREAD_H);

  // A few soft age blotches
  const blotches = [
    [180, 240, 150], [1880, 420, 190], [320, 1290, 170],
    [1760, 1210, 150], [1030, 90, 220], [1030, 1420, 200],
  ];
  blotches.forEach(([bx, by, r]) => {
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
    g.addColorStop(0, "rgba(130,92,36,0.09)");
    g.addColorStop(1, "rgba(130,92,36,0)");
    ctx.fillStyle = g;
    ctx.fillRect(bx - r, by - r, r * 2, r * 2);
  });

  grain(ctx, SPREAD_W, SPREAD_H, 0.035);
}

// ─── the spread layout (mirrors the reference art direction) ──────────────────

function paintSpreadContent(ctx, copy) {
  const SERIF = "Georgia, 'Times New Roman', serif";

  // ---- LEFT PAGE: eyebrow, headline, body column ----------------------------
  ctx.textAlign = "left";
  ctx.fillStyle = INK_FAINT;
  ctx.font = `400 27px ${SERIF}`;
  tracked(ctx, copy.left.eyebrow.toUpperCase(), 289, 212, 5);

  ctx.fillStyle = INK;
  ctx.font = `400 68px ${SERIF}`;
  let y = 306;
  copy.left.headline.forEach((line) => {
    ctx.fillText(line, 289, y);
    y += 78;
  });

  // short rule under the headline
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(289, y - 6);
  ctx.lineTo(289 + 120, y - 6);
  ctx.stroke();

  ctx.fillStyle = INK_SOFT;
  ctx.font = `400 27px ${SERIF}`;
  let by = y + 84;
  copy.left.body.forEach((para) => {
    by = wrap(ctx, para, 289, by, 372, 41) + 64;
  });

  // ---- CENTRE: display quote, straddling the gutter ------------------------
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = `400 104px ${SERIF}`;
  let qy = 636;
  copy.quote.forEach((line) => {
    ctx.fillText(line, 1030, qy);
    qy += 118;
  });

  // ---- RIGHT PAGE: eyebrow + numbered items -------------------------------
  ctx.textAlign = "left";
  ctx.fillStyle = INK_FAINT;
  ctx.font = `400 27px ${SERIF}`;
  tracked(ctx, copy.right.eyebrow.toUpperCase(), 1354, 212, 5);

  let iy = 306;
  copy.right.items.forEach(({ num, label, text }) => {
    ctx.fillStyle = INK;
    ctx.font = `700 28px ${SERIF}`;
    ctx.fillText(`${num} — ${label}.`, 1354, iy);
    iy += 46;

    ctx.fillStyle = INK_SOFT;
    ctx.font = `400 26px ${SERIF}`;
    iy = wrap(ctx, text, 1354, iy, 436, 38) + 74;
  });

  // ---- FOOTER: rule + centred lines, straddling the gutter -----------------
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(231, 1300);
  ctx.lineTo(1839, 1300);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = INK_FAINT;
  ctx.font = `400 26px ${SERIF}`;
  tracked(ctx, copy.footer.brand.toUpperCase(), 1030, 1356, 4, "center");

  ctx.fillStyle = INK;
  ctx.font = `400 34px ${SERIF}`;
  ctx.fillText(copy.footer.tagline, 1030, 1410);
}

// ─── public API ──────────────────────────────────────────────────────────────

// The two page meshes do not quite meet at the spine — each content plane starts
// at local x=0.006 of a 0.966 half-width, so 0.62% of the spread is swallowed by
// the fold. Dropping that centre strip is what keeps the straddling quote and
// footer aligned across the gutter instead of visibly stepping. Must stay in sync
// with CONTENT_X0 / CONTENT_W in the Blender build.
const FOLD_PX = Math.round(SPREAD_W * 0.0062);

/**
 * Renders the full spread once, then returns the two page halves.
 * Left half  = outer-left edge -> fold  (u=0 is the fore-edge)
 * Right half = fold -> outer-right edge (u=0 is the gutter)
 * That ordering matches the page UVs exported from Blender.
 */
export function createSpreadPair(copy = SPREAD_COPY) {
  const spread = document.createElement("canvas");
  spread.width  = SPREAD_W;
  spread.height = SPREAD_H;
  const ctx = spread.getContext("2d");

  paintAgedSpread(ctx);
  paintSpreadContent(ctx, copy);

  const halfW    = SPREAD_W / 2;
  const visible  = halfW - FOLD_PX / 2;

  // Each half is stretched from `visible` back up to `halfW` so it fills the
  // page mesh's full UV range.
  const half = (srcX) => {
    const c = document.createElement("canvas");
    c.width  = halfW;
    c.height = SPREAD_H;
    c.getContext("2d").drawImage(
      spread,
      srcX, 0, visible, SPREAD_H,
      0,    0, halfW,   SPREAD_H
    );
    return c;
  };

  return { left: half(0), right: half(halfW + FOLD_PX / 2) };
}

export const SPREAD_COPY = {
  quote: ["Your Attitude", "Decides", "Your Altitude"],
  left: {
    eyebrow: "About BroScience",
    headline: ["Your Attitude Decides", "Your Altitude"],
    body: [
      "BroScience Eduservices is built on a simple belief: every student deserves direction, not just content. Concepts come first, practice second, and performance follows on its own.",
      "From Class 7 through Class 12, JEE and NEET, every learning path is planned around the student — calm, structured, and serious about genuine understanding rather than rote drill.",
      "Mentors stay close enough to notice the moment understanding slips, and patient enough to rebuild it properly before moving on.",
    ],
  },
  right: {
    eyebrow: "Our Philosophy",
    items: [
      { num: "01", label: "Learn",    text: "We establish deep conceptual understanding before introducing any problem-solving technique, so nothing rests on memory alone." },
      { num: "02", label: "Believe",  text: "Students who genuinely understand begin to believe in their own ability. Confidence is built from clarity, never from repetition." },
      { num: "03", label: "Practice", text: "Deliberate, structured practice with regular assessment keeps progress visible and makes every weak area easy to find early." },
      { num: "04", label: "Achieve",  text: "Consistent mentorship and personalised guidance turn that understanding into results a student can measure and repeat." },
    ],
  },
  footer: {
    brand: "BroScience Eduservices",
    tagline: "Your Attitude Decides Your Altitude",
  },
};

// ─── cover textures (still used for the closed-book art direction) ───────────

export function createLeatherCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width  = 1024;
  canvas.height = 1408;
  const ctx = canvas.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0,   "#161210");
  g.addColorStop(0.5, "#0f0d0c");
  g.addColorStop(1,   "#1a1412");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  grain(ctx, canvas.width, canvas.height, 0.10);

  ctx.strokeStyle = "rgba(201,168,77,0.28)";
  ctx.lineWidth   = 6;
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

  return canvas;
}

export function createCoverCanvas(logoImage) {
  const canvas = createLeatherCanvas();
  const ctx    = canvas.getContext("2d");
  const { width, height } = canvas;
  const gold   = "#c9a84d";
  const ltGold = "#e6d08a";

  const emblemSize = 390;
  const emblemX    = width / 2;
  const emblemY    = height * 0.25;

  ctx.strokeStyle = "rgba(201,168,77,0.55)";
  ctx.lineWidth   = 5;
  ctx.beginPath();
  ctx.arc(emblemX, emblemY, emblemSize / 2 + 10, 0, Math.PI * 2);
  ctx.stroke();

  if (logoImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, emblemSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImage, emblemX - emblemSize / 2, emblemY - emblemSize / 2, emblemSize, emblemSize);
    ctx.restore();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = gold;
  ctx.font      = "700 58px 'Times New Roman', Georgia, serif";
  ctx.fillText("COURSE MATERIAL", width / 2, height * 0.505);

  ctx.font      = "600 36px 'Times New Roman', Georgia, serif";
  ctx.fillStyle = ltGold;
  ctx.fillText("INTRODUCTION TO",       width / 2, height * 0.575);
  ctx.fillText("FOUNDATIONAL CONCEPTS", width / 2, height * 0.620);

  ctx.strokeStyle = "rgba(201,168,77,0.40)";
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.28, height * 0.648);
  ctx.lineTo(width * 0.72, height * 0.648);
  ctx.stroke();

  ctx.fillStyle = gold;
  ctx.font      = "700 90px 'Times New Roman', Georgia, serif";
  ctx.fillText("BROSCIENCE", width / 2, height * 0.715);

  ctx.font      = "700 52px 'Times New Roman', Georgia, serif";
  ctx.fillStyle = ltGold;
  ctx.fillText("EDUSERVICES", width / 2, height * 0.780);

  ctx.font      = "400 30px Georgia, serif";
  ctx.fillStyle = "rgba(201,168,77,0.72)";
  ctx.fillText("Education with Direction", width / 2, height * 0.855);

  return canvas;
}
