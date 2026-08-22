function noise(ctx, width, height, alpha = 0.08) {
  const image = ctx.createImageData(width, height);
  for (let i = 0; i < image.data.length; i += 4) {
    const value = 80 + Math.random() * 40;
    image.data[i] = value;
    image.data[i + 1] = value * 0.85;
    image.data[i + 2] = value * 0.55;
    image.data[i + 3] = alpha * 255;
  }
  ctx.putImageData(image, 0, 0);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
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

export function createLeatherCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1408;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#161210");
  gradient.addColorStop(0.5, "#0f0d0c");
  gradient.addColorStop(1, "#1a1412");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  noise(ctx, canvas.width, canvas.height, 0.12);

  ctx.strokeStyle = "rgba(201,168,77,0.28)";
  ctx.lineWidth = 6;
  roundRect(ctx, 48, 48, canvas.width - 96, canvas.height - 96, 18);
  ctx.stroke();

  return canvas;
}

export function createCoverCanvas(logoImage) {
  const canvas = createLeatherCanvas();
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  const emblemSize = 420;
  const emblemX = width / 2;
  const emblemY = height * 0.34;

  ctx.save();
  ctx.beginPath();
  ctx.arc(emblemX, emblemY, emblemSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (logoImage) {
    ctx.drawImage(logoImage, emblemX - emblemSize / 2, emblemY - emblemSize / 2, emblemSize, emblemSize);
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(201,168,77,0.55)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(emblemX, emblemY, emblemSize / 2 + 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#c9a84d";
  ctx.textAlign = "center";
  ctx.font = "700 72px 'Times New Roman', Georgia, serif";
  ctx.fillText("BROSCIENCE", width / 2, height * 0.62);

  ctx.font = "700 42px 'Times New Roman', Georgia, serif";
  ctx.fillStyle = "#e6d08a";
  ctx.fillText("EDUSERVICES", width / 2, height * 0.68);

  ctx.strokeStyle = "rgba(201,168,77,0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.28, height * 0.72);
  ctx.lineTo(width * 0.72, height * 0.72);
  ctx.stroke();

  ctx.font = "500 22px Georgia, serif";
  ctx.fillStyle = "rgba(201,168,77,0.72)";
  ctx.fillText("EDUCATION WITH DIRECTION", width / 2, height * 0.77);

  return canvas;
}

export function createLinedPaperCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1408;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(201,168,77,0.08)";
  ctx.fillRect(0, 0, 70, canvas.height);

  ctx.strokeStyle = "rgba(107,29,38,0.08)";
  ctx.lineWidth = 1;
  for (let y = 120; y < canvas.height - 80; y += 36) {
    ctx.beginPath();
    ctx.moveTo(90, y);
    ctx.lineTo(canvas.width - 70, y);
    ctx.stroke();
  }

  noise(ctx, canvas.width, canvas.height, 0.04);
  return canvas;
}

export function createSpreadCanvas({ eyebrow, title, paragraphs, footer }) {
  const canvas = createLinedPaperCanvas();
  const ctx = canvas.getContext("2d");
  const { width } = canvas;

  ctx.fillStyle = "#6b1d26";
  ctx.font = "600 22px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText(eyebrow.toUpperCase(), 110, 150);

  ctx.fillStyle = "#1a1410";
  ctx.font = "700 54px Georgia, 'Times New Roman', serif";
  wrapText(ctx, title, 110, 230, width - 220, 64);

  ctx.fillStyle = "#3b3228";
  ctx.font = "400 28px Georgia, serif";
  let y = 360;
  paragraphs.forEach((paragraph) => {
    y = wrapText(ctx, paragraph, 110, y, width - 220, 42) + 56;
  });

  ctx.strokeStyle = "rgba(201,168,77,0.4)";
  ctx.beginPath();
  ctx.moveTo(110, canvas.height - 140);
  ctx.lineTo(width - 110, canvas.height - 140);
  ctx.stroke();

  ctx.fillStyle = "#8a6d28";
  ctx.font = "600 20px Georgia, serif";
  ctx.fillText(footer, 110, canvas.height - 100);

  return canvas;
}

export const SPREAD_COPY = {
  left: {
    eyebrow: "BroScience Eduservices",
    title: "About the Institute",
    paragraphs: [
      "BroScience Eduservices is built on a simple belief: students do not need more pressure. They need direction.",
      "We teach concepts first, then practice, then performance — with mentors who stay close to every learner.",
      "The classroom is calm, structured, and serious about understanding.",
    ],
    footer: "Knowledge · Direction · Discipline · Future",
  },
  right: {
    eyebrow: "Our Promise",
    title: "How we teach",
    paragraphs: [
      "From Class 7 foundation to JEE and NEET, every path is planned with the student in mind.",
      "Doubt support, one-to-one guidance, and regular assessment keep progress visible — never vague.",
      "This is education with direction: premium in standard, personal in method.",
    ],
    footer: "Classes 7–12  ·  JEE  ·  NEET  ·  Boards",
  },
};
