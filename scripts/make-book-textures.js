const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.resolve(__dirname, "..", "public", "models", "textures");
fs.mkdirSync(outDir, { recursive: true });

function svgToPng(file, svg, width, height) {
  return sharp(Buffer.from(svg)).resize(width, height).png().toFile(path.join(outDir, file));
}

async function main() {
  await svgToPng(
    "paper.png",
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1408" viewBox="0 0 1024 1408">
      <rect width="1024" height="1408" fill="#F5F2E9"/>
      <rect x="0" y="0" width="64" height="1408" fill="#EFE8D8"/>
    </svg>`,
    1024,
    1408
  );

  await svgToPng(
    "left-spread.png",
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1408" viewBox="0 0 1024 1408">
      <rect width="1024" height="1408" fill="#F5F2E9"/>
      <rect x="0" y="0" width="56" height="1408" fill="#EDE6D4"/>
      <text x="110" y="180" fill="#6E171D" font-family="Georgia, Times, serif" font-size="22" letter-spacing="6">ABOUT BROSCIENCE</text>
      <text x="110" y="280" fill="#0B0A0A" font-family="Georgia, Times, serif" font-size="64" font-weight="700">Education With</text>
      <text x="110" y="360" fill="#0B0A0A" font-family="Georgia, Times, serif" font-size="64" font-weight="700">Direction</text>
      <rect x="110" y="400" width="140" height="3" fill="#D6A51F"/>
      <text x="110" y="500" fill="#3A3228" font-family="Georgia, Times, serif" font-size="28">
        <tspan x="110" dy="0">BroScience Eduservices is built for students</tspan>
        <tspan x="110" dy="42">who need more than pressure. They need a</tspan>
        <tspan x="110" dy="42">clear path: concepts first, then practice,</tspan>
        <tspan x="110" dy="42">then performance — with mentors close</tspan>
        <tspan x="110" dy="42">enough to notice when understanding slips.</tspan>
      </text>
      <text x="110" y="1280" fill="#8A6D28" font-family="Georgia, Times, serif" font-size="20">Knowledge · Direction · Discipline · Future</text>
    </svg>`,
    1024,
    1408
  );

  await svgToPng(
    "right-spread.png",
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1408" viewBox="0 0 1024 1408">
      <rect width="1024" height="1408" fill="#F5F2E9"/>
      <text x="110" y="180" fill="#6E171D" font-family="Georgia, Times, serif" font-size="22" letter-spacing="6">OUR APPROACH</text>
      <text x="110" y="280" fill="#0B0A0A" font-family="Georgia, Times, serif" font-size="54" font-weight="700">How we teach</text>
      <rect x="110" y="320" width="140" height="3" fill="#D6A51F"/>
      <g fill="#0B0A0A" font-family="Georgia, Times, serif">
        <text x="110" y="460" fill="#D6A51F" font-size="22">01</text>
        <text x="180" y="460" font-size="32" font-weight="700">Concept Clarity</text>
        <text x="110" y="580" fill="#D6A51F" font-size="22">02</text>
        <text x="180" y="580" font-size="32" font-weight="700">Expert Mentorship</text>
        <text x="110" y="700" fill="#D6A51F" font-size="22">03</text>
        <text x="180" y="700" font-size="32" font-weight="700">Structured Practice</text>
        <text x="110" y="820" fill="#D6A51F" font-size="22">04</text>
        <text x="180" y="820" font-size="32" font-weight="700">Continuous Progress</text>
      </g>
      <text x="110" y="1280" fill="#8A6D28" font-family="Georgia, Times, serif" font-size="20">Classes 7–12  ·  JEE  ·  NEET  ·  Boards</text>
    </svg>`,
    1024,
    1408
  );

  console.log("Book textures written to", outDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
