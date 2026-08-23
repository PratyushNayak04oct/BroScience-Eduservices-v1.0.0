function noise(ctx, width, height, alpha = 0.08) {
  const image = ctx.createImageData(width, height);
  for (let i = 0; i < image.data.length; i += 4) {
    const v = 80 + Math.random() * 40;
    image.data[i]     = v;
    image.data[i + 1] = v * 0.85;
    image.data[i + 2] = v * 0.55;
    image.data[i + 3] = alpha * 255;
  }
  ctx.putImageData(image, 0, 0);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  words.forEach((word, index) => {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && index > 0) {
      ctx.fillText(line.trim(), x, cursorY);
      line = `${word} `;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  });
  ctx.fillText(line.trim(), x, cursorY);
  return cursorY;
}

// ─── Aged warm paper base ────────────────────────────────────────────────────
function createAgedPaperCanvas(w = 1024, h = 1408) {
  const canvas = document.createElement("canvas");
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // Warm cream base
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0,    "#f2e8cc");
  bg.addColorStop(0.4,  "#ede0be");
  bg.addColorStop(0.85, "#e8d9b4");
  bg.addColorStop(1,    "#e2d0a8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Edge aging vignette
  const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.85);
  vignette.addColorStop(0, "transparent");
  vignette.addColorStop(1, "rgba(90, 55, 10, 0.22)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // Grain
  noise(ctx, w, h, 0.07);
  return canvas;
}

// ─── Leather cover ───────────────────────────────────────────────────────────
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
  noise(ctx, canvas.width, canvas.height, 0.12);

  ctx.strokeStyle = "rgba(201,168,77,0.28)";
  ctx.lineWidth   = 6;
  roundRect(ctx, 48, 48, canvas.width - 96, canvas.height - 96, 18);
  ctx.stroke();

  return canvas;
}

// ─── Full cover with logo & text (matches reference) ─────────────────────────
export function createCoverCanvas(logoImage) {
  const canvas = createLeatherCanvas();
  const ctx    = canvas.getContext("2d");
  const { width, height } = canvas;

  // Logo emblem — centered in top third
  const emblemSize = 390;
  const emblemX    = width / 2;
  const emblemY    = height * 0.25;

  // Gold ring behind emblem
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
    ctx.drawImage(logoImage, emblemX - emblemSize/2, emblemY - emblemSize/2, emblemSize, emblemSize);
    ctx.restore();
  }

  const gold   = "#c9a84d";
  const ltGold = "#e6d08a";

  ctx.textAlign = "center";

  // COURSE MATERIAL
  ctx.fillStyle = gold;
  ctx.font      = "700 58px 'Times New Roman', Georgia, serif";
  ctx.fillText("COURSE MATERIAL", width / 2, height * 0.505);

  // INTRODUCTION TO / FOUNDATIONAL CONCEPTS
  ctx.font      = "600 36px 'Times New Roman', Georgia, serif";
  ctx.fillStyle = ltGold;
  ctx.fillText("INTRODUCTION TO",       width / 2, height * 0.575);
  ctx.fillText("FOUNDATIONAL CONCEPTS", width / 2, height * 0.620);

  // separator
  ctx.strokeStyle = "rgba(201,168,77,0.40)";
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.28, height * 0.648);
  ctx.lineTo(width * 0.72, height * 0.648);
  ctx.stroke();

  // BROSCIENCE — large
  ctx.fillStyle = gold;
  ctx.font      = "700 90px 'Times New Roman', Georgia, serif";
  ctx.fillText("BROSCIENCE", width / 2, height * 0.715);

  // EDUSERVICES
  ctx.font      = "700 52px 'Times New Roman', Georgia, serif";
  ctx.fillStyle = ltGold;
  ctx.fillText("EDUSERVICES", width / 2, height * 0.780);

  // separator
  ctx.strokeStyle = "rgba(201,168,77,0.35)";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.30, height * 0.808);
  ctx.lineTo(width * 0.70, height * 0.808);
  ctx.stroke();

  // Education with Direction
  ctx.font      = "400 30px Georgia, serif";
  ctx.fillStyle = "rgba(201,168,77,0.72)";
  ctx.fillText("Education with Direction", width / 2, height * 0.855);

  return canvas;
}

// ─── Left spread page ────────────────────────────────────────────────────────
function createLeftSpreadCanvas({ eyebrow, headline, body, footer }) {
  const w = 1024, h = 1408;
  const canvas = createAgedPaperCanvas(w, h);
  const ctx    = canvas.getContext("2d");

  const dark   = "#2a1e0e";
  const maroon = "#6b1420";
  const muted  = "#5a4020";

  ctx.textAlign = "left";

  // Eyebrow
  ctx.fillStyle = maroon;
  ctx.font      = "600 20px Georgia, serif";
  ctx.fillText(eyebrow.toUpperCase(), 90, 148);

  // Thin rule below eyebrow
  ctx.strokeStyle = "rgba(107,20,32,0.25)";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(90, 162);
  ctx.lineTo(w - 90, 162);
  ctx.stroke();

  // Headline
  ctx.fillStyle = dark;
  ctx.font      = "700 56px Georgia, 'Times New Roman', serif";
  wrapText(ctx, headline, 90, 228, w - 180, 68);

  // Body text
  ctx.fillStyle = muted;
  ctx.font      = "400 27px Georgia, serif";
  let bodyY = 400;
  body.forEach((para) => {
    bodyY = wrapText(ctx, para, 90, bodyY, w - 180, 40) + 52;
  });

  // Footer rule
  ctx.strokeStyle = "rgba(107,20,32,0.28)";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(90, h - 148);
  ctx.lineTo(w - 90, h - 148);
  ctx.stroke();

  // Footer text
  ctx.fillStyle = maroon;
  ctx.font      = "500 19px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(footer, w / 2, h - 100);

  return canvas;
}

// ─── Right spread page ───────────────────────────────────────────────────────
function createRightSpreadCanvas({ eyebrow, items, footer }) {
  const w = 1024, h = 1408;
  const canvas = createAgedPaperCanvas(w, h);
  const ctx    = canvas.getContext("2d");

  const dark   = "#2a1e0e";
  const maroon = "#6b1420";
  const muted  = "#5a4020";

  ctx.textAlign = "left";

  // Eyebrow
  ctx.fillStyle = maroon;
  ctx.font      = "600 20px Georgia, serif";
  ctx.fillText(eyebrow.toUpperCase(), 90, 148);

  ctx.strokeStyle = "rgba(107,20,32,0.25)";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(90, 162);
  ctx.lineTo(w - 90, 162);
  ctx.stroke();

  // Large center quote
  ctx.fillStyle   = dark;
  ctx.font        = `italic 700 58px Georgia, 'Times New Roman', serif`;
  ctx.textAlign   = "center";
  wrapText(ctx, "Your Attitude\nDecides\nYour Altitude", w / 2, 240, w - 140, 72);

  // Numbered items
  ctx.textAlign = "left";
  let iy = 560;
  items.forEach(({ num, label, text }) => {
    ctx.fillStyle = maroon;
    ctx.font      = "700 22px Georgia, serif";
    ctx.fillText(`${num} — ${label}.`, 90, iy);
    iy += 32;
    ctx.fillStyle = muted;
    ctx.font      = "400 24px Georgia, serif";
    iy = wrapText(ctx, text, 90, iy, w - 180, 36) + 46;
  });

  // Footer
  ctx.strokeStyle = "rgba(107,20,32,0.28)";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(90, h - 148);
  ctx.lineTo(w - 90, h - 148);
  ctx.stroke();

  ctx.fillStyle = maroon;
  ctx.font      = "500 19px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(footer, w / 2, h - 100);

  return canvas;
}

// ─── Public API ──────────────────────────────────────────────────────────────
export function createSpreadCanvas({ side, ...data }) {
  if (side === "right") return createRightSpreadCanvas(data);
  return createLeftSpreadCanvas(data);
}

export const SPREAD_COPY = {
  left: {
    side: "left",
    eyebrow: "ABOUT BROSCIENCE",
    headline: "Your Attitude Decides Your Altitude",
    body: [
      "BroScience Eduservices is built on a simple belief: every student deserves direction, not just content. We build concepts first, practice second, performance third.",
      "From Class 7 to Class 12, JEE and NEET — every learning path is planned with the student at the centre.",
      "Our classrooms are calm, structured, and serious about understanding.",
    ],
    footer: "BROSCIENCE EDUSERVICES · Your Attitude Decides Your Altitude",
  },
  right: {
    side: "right",
    eyebrow: "OUR PHILOSOPHY",
    items: [
      { num: "01", label: "Learn",    text: "We establish deep conceptual understanding before introducing any problem-solving technique." },
      { num: "02", label: "Believe",  text: "Students who understand believe in their ability. Confidence comes from clarity, not repetition." },
      { num: "03", label: "Practice", text: "Deliberate, structured practice with regular assessments keeps progress visible at every stage." },
      { num: "04", label: "Achieve",  text: "Consistent mentorship and personalised guidance deliver measurable results in every exam." },
    ],
    footer: "Classes 7–12  ·  JEE  ·  NEET  ·  Boards",
  },
};
