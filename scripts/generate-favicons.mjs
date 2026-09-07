import sharp from "sharp";
import fs from "fs";
import path from "path";

const root = process.cwd();
const pub = path.join(root, "public");

async function generateBrandAssets() {
  const iconSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="100" fill="#C9232A"/>
    <circle cx="256" cy="256" r="180" fill="#9F171D"/>
    <circle cx="256" cy="256" r="140" fill="#FFFDF8"/>
    <text x="256" y="295" font-family="Arial, sans-serif" font-size="130" font-weight="900" fill="#C9232A" text-anchor="middle">BM</text>
    <circle cx="340" cy="180" r="28" fill="#F2C94C"/>
  </svg>
  `;

  const iconBuffer = Buffer.from(iconSvg);

  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(pub, "icon.png"));

  await sharp(iconBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(pub, "favicon.ico"));

  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#FFFDF8"/>
    <rect x="0" y="0" width="1200" height="24" fill="#C9232A"/>
    <rect x="0" y="24" width="1200" height="8" fill="#F2C94C"/>
    <rect x="60" y="80" width="1080" height="490" rx="16" fill="#F7F1E5" stroke="#E6DED0" stroke-width="2"/>
    <text x="110" y="190" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#C9232A" letter-spacing="4">JALANDHAR • COMMERCIAL ELECTRIC VEHICLES</text>
    <text x="110" y="280" font-family="Arial, sans-serif" font-size="76" font-weight="900" fill="#171717">BALAJI MOTORS</text>
    <text x="110" y="340" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#6F6B63">Official E-Rickshaws &amp; Commercial E-Loaders Dealership</text>
    <rect x="110" y="385" width="480" height="3" fill="#C9232A"/>
    <text x="110" y="440" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="#171717">Avtar Nagar Road, Near Hotel Regent Park, Gujral Nagar, Jalandhar</text>
    <text x="110" y="480" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#C9232A">Direct Sales Line: +91 94645 18091</text>
  </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(pub, "og-image.png"));

  console.log("Brand assets generated successfully: icon.png, favicon.ico, og-image.png");
}

generateBrandAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
