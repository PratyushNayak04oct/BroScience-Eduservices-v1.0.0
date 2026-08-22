const sharp = require("sharp");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "public", "brand", "logo.png");

function circleSvg(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
  );
}

async function writePng(buffer, file, size) {
  await sharp(buffer)
    .resize(size, size)
    .composite([{ input: circleSvg(size), blend: "dest-in" }])
    .png()
    .toFile(file);
}

async function main() {
  const extract = 620;
  const left = Math.round((1024 - extract) / 2);
  const emblem = await sharp(src)
    .extract({ left, top: left, width: extract, height: extract })
    .toBuffer();

  await writePng(emblem, path.join(root, "app", "icon.png"), 64);
  await writePng(emblem, path.join(root, "app", "apple-icon.png"), 180);
  await writePng(emblem, path.join(root, "public", "favicon.ico"), 32);
  await writePng(emblem, path.join(root, "public", "brand", "favicon.png"), 64);
  console.log("Favicon assets written");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
