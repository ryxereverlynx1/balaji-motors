import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const imgDir = path.join(root, "public", "images");
const prodDir = path.join(root, "public", "products");
const explodedDir = path.join(root, "public", "exploded", "sargam-victor");

fs.mkdirSync(prodDir, { recursive: true });
fs.mkdirSync(explodedDir, { recursive: true });

async function processImages() {
  const redSrc = path.join(imgDir, "rickshaw-red.webp");
  const blueSrc = path.join(imgDir, "rickshaw-blue.webp");
  const greenSrc = path.join(imgDir, "rickshaw-green.webp");
  const whiteSrc = path.join(imgDir, "rickshaw-white.webp");

  if (fs.existsSync(redSrc)) {
    await sharp(redSrc).png({ quality: 90 }).toFile(path.join(prodDir, "sargam-victor.png"));
  }
  if (fs.existsSync(blueSrc)) {
    await sharp(blueSrc).png({ quality: 90 }).toFile(path.join(prodDir, "king-cargo.png"));
  }
  if (fs.existsSync(greenSrc)) {
    await sharp(greenSrc).png({ quality: 90 }).toFile(path.join(prodDir, "balaji-passenger.png"));
  }
  if (fs.existsSync(whiteSrc)) {
    await sharp(whiteSrc).png({ quality: 90 }).toFile(path.join(prodDir, "balaji-van.png"));
  }

  if (fs.existsSync(redSrc)) {
    const meta = await sharp(redSrc).metadata();
    const w = meta.width || 1024;
    const h = meta.height || 1024;

    await sharp(redSrc)
      .extract({ left: Math.round(w * 0.15), top: 0, width: Math.round(w * 0.75), height: Math.round(h * 0.35) })
      .png()
      .toFile(path.join(explodedDir, "canopy.png"));

    await sharp(redSrc)
      .extract({ left: Math.round(w * 0.3), top: Math.round(h * 0.28), width: Math.round(w * 0.65), height: Math.round(h * 0.45) })
      .png()
      .toFile(path.join(explodedDir, "cabin.png"));

    await sharp(redSrc)
      .extract({ left: 0, top: Math.round(h * 0.25), width: Math.round(w * 0.45), height: Math.round(h * 0.65) })
      .png()
      .toFile(path.join(explodedDir, "front.png"));

    await sharp(redSrc)
      .extract({ left: Math.round(w * 0.35), top: Math.round(h * 0.5), width: Math.round(w * 0.35), height: Math.round(h * 0.25) })
      .png()
      .toFile(path.join(explodedDir, "battery.png"));

    await sharp(redSrc)
      .extract({ left: Math.round(w * 0.15), top: Math.round(h * 0.6), width: Math.round(w * 0.4), height: Math.round(h * 0.35) })
      .png()
      .toFile(path.join(explodedDir, "motor.png"));

    await sharp(redSrc)
      .extract({ left: Math.round(w * 0.1), top: Math.round(h * 0.55), width: Math.round(w * 0.85), height: Math.round(h * 0.45) })
      .png()
      .toFile(path.join(explodedDir, "chassis.png"));
  }
}

processImages()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    process.exit(1);
  });
