import sharp from "sharp";
import fs from "fs";
import path from "path";

const root = process.cwd();
const pub = path.join(root, "public");

async function createLogo() {
  const size = 512;
  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D9262D" />
        <stop offset="50%" stop-color="#B3181E" />
        <stop offset="100%" stop-color="#73090E" />
      </linearGradient>

      <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF5D1" />
        <stop offset="35%" stop-color="#F3CA4E" />
        <stop offset="70%" stop-color="#D49B18" />
        <stop offset="100%" stop-color="#9E6E06" />
      </linearGradient>

      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#8F0F14" />
        <stop offset="60%" stop-color="#66080C" />
        <stop offset="100%" stop-color="#3D0306" />
      </linearGradient>

      <linearGradient id="silverChrome" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="45%" stop-color="#ECEFF1" />
        <stop offset="55%" stop-color="#D3DCE0" />
        <stop offset="100%" stop-color="#9AA9B0" />
      </linearGradient>

      <radialGradient id="sunburst" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.4" />
      </radialGradient>

      <filter id="badgeShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.35" />
      </filter>

      <filter id="innerBevel" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.5" />
      </filter>
    </defs>

    <!-- Main Circular Disc Badge -->
    <circle cx="256" cy="256" r="240" fill="url(#bgGrad)" filter="url(#badgeShadow)" />
    <circle cx="256" cy="256" r="240" fill="url(#sunburst)" />

    <!-- Outer Dual Chrome & Gold Beveled Rings -->
    <circle cx="256" cy="256" r="236" fill="none" stroke="url(#goldLight)" stroke-width="6" />
    <circle cx="256" cy="256" r="226" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2" />
    <circle cx="256" cy="256" r="222" fill="none" stroke="#000000" stroke-opacity="0.25" stroke-width="2" />

    <!-- Speed Wing Feathers (Left Side) -->
    <g fill="url(#goldLight)" opacity="0.95">
      <path d="M 56 210 Q 135 205 170 230 Q 120 220 66 228 Z" />
      <path d="M 44 232 Q 130 228 165 250 Q 110 242 54 250 Z" />
      <path d="M 60 254 Q 130 252 162 268 Q 115 264 70 270 Z" />
    </g>

    <!-- Speed Wing Feathers (Right Side) -->
    <g fill="url(#goldLight)" opacity="0.95">
      <path d="M 456 210 Q 377 205 342 230 Q 392 220 446 228 Z" />
      <path d="M 468 232 Q 382 228 347 250 Q 402 242 458 250 Z" />
      <path d="M 452 254 Q 382 252 350 268 Q 397 264 442 270 Z" />
    </g>

    <!-- Center Automotive Shield Crest -->
    <path d="M 152 135 L 360 135 Q 364 225 256 300 Q 148 225 152 135 Z" fill="url(#shieldGrad)" stroke="url(#goldLight)" stroke-width="4.5" filter="url(#innerBevel)" />
    <path d="M 162 144 L 350 144 Q 354 220 256 288 Q 158 220 162 144 Z" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.5" />

    <!-- Stylized Central BM Automotive Crest -->
    <!-- B Letterform -->
    <path d="M 188 160 L 226 160 Q 248 160 248 178 Q 248 188 240 193 Q 252 198 252 214 Q 252 234 226 234 L 188 234 Z M 207 175 L 207 188 L 222 188 Q 230 188 230 181 Q 230 175 222 175 Z M 207 203 L 207 219 L 224 219 Q 234 219 234 211 Q 234 203 224 203 Z" fill="url(#silverChrome)" />

    <!-- M Letterform -->
    <path d="M 260 160 L 278 160 L 295 214 L 312 160 L 330 160 L 330 234 L 313 234 L 313 188 L 300 234 L 290 234 L 277 188 L 277 234 L 260 234 Z" fill="url(#silverChrome)" />

    <!-- Electric Lightning Bolt (Center of Shield) -->
    <polygon points="256,236 266,254 254,254 263,276 246,252 255,252" fill="url(#goldLight)" stroke="#52070A" stroke-width="1.2" />

    <!-- Ribbon Banner for "BALAJI MOTORS" -->
    <path d="M 115 315 L 397 315 L 382 360 L 130 360 Z" fill="#1C1816" stroke="url(#goldLight)" stroke-width="2.5" filter="url(#innerBevel)" />
    
    <!-- Ribbon Ends / Tails -->
    <polygon points="115,315 130,360 96,345 108,315" fill="url(#goldLight)" />
    <polygon points="397,315 382,360 416,345 404,315" fill="url(#goldLight)" />

    <!-- BALAJI MOTORS Banner Typography -->
    <text x="256" y="347" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="27" font-weight="900" fill="url(#goldLight)" text-anchor="middle" letter-spacing="3.5">
      BALAJI MOTORS
    </text>

    <!-- Subtitle: JALANDHAR • E-RICKSHAWS -->
    <rect x="156" y="380" width="200" height="24" rx="12" fill="#000000" fill-opacity="0.45" />
    <text x="256" y="396" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11.5" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      JALANDHAR • E-RICKSHAWS
    </text>

    <!-- 5 Quality Stars -->
    <g fill="url(#goldLight)">
      <polygon points="216,422 218,427 224,427 219,431 221,436 216,433 211,436 213,431 208,427 214,427" transform="scale(0.8) translate(50, 95)" />
      <polygon points="236,420 238,425 244,425 239,429 241,434 236,431 231,434 233,429 228,425 234,425" transform="scale(0.85) translate(35, 70)" />
      <polygon points="256,416 258,421 264,421 259,425 261,430 256,427 251,430 253,425 248,421 254,421" />
      <polygon points="276,420 278,425 284,425 279,429 281,434 276,431 271,434 273,429 268,425 274,425" transform="scale(0.85) translate(48, 70)" />
      <polygon points="296,422 298,427 304,427 299,431 301,436 296,433 291,436 293,431 288,427 294,427" transform="scale(0.8) translate(75, 95)" />
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(pub, "logo.png"));

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(pub, "icon.png"));

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(pub, "apple-icon.png"));

  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(pub, "favicon.ico"));

  console.log("Updated brand assets generated: logo.png, icon.png, apple-icon.png, favicon.ico");
}

createLogo().catch((err) => {
  console.error(err);
  process.exit(1);
});
