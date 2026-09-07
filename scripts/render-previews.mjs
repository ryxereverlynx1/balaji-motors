import fs from "fs";
import path from "path";
import * as THREE from "three";
import sharp from "sharp";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
    });
  }
};

const explosionVectors = {
  Rickshaw_Canopy: [0, 0.75, 0],
  Rickshaw_LuggageRack: [0, 1.25, 0],
  Rickshaw_Curtains: [0, 0.40, 0.20],
  Rickshaw_Windshield: [0, 0.35, -0.85],
  Rickshaw_FrontCowl: [0, 0.10, -0.75],
  Rickshaw_Handlebars: [0, 0.40, -0.40],
  Rickshaw_FrontFork: [0, -0.05, -0.75],
  Rickshaw_FrontWheel: [0, -0.10, -1.05],
  Rickshaw_RearWheel_Left: [0.65, 0, 0.20],
  Rickshaw_RearWheel_Right: [-0.65, 0, 0.20],
  Rickshaw_SpareWheel: [0, 0.10, 0.85],
  Rickshaw_Seats: [0, 0.45, 0.10],
  Rickshaw_SafetyGates: [0, 0.20, -0.15],
  Rickshaw_BodyPanels: [0, 0.15, 0.35],
  Rickshaw_Battery: [0, 0.25, 0.10],
  Rickshaw_Motor: [0, -0.35, 0.45],
  Rickshaw_Chassis: [0, -0.25, 0],
};

const inputPath = path.join(process.cwd(), "public", "models", "balaji-rickshaw.glb");
const data = fs.readFileSync(inputPath);
const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

function renderSceneToFile(scene, outPath, exploded = false) {
  const W = 700, H = 700;
  const buf = Buffer.alloc(W * H * 3, 246);
  const zbuf = new Float32Array(W * H).fill(-Infinity);

  const cosY = Math.cos(0.75), sinY = Math.sin(0.75);
  const cosX = Math.cos(0.28), sinX = Math.sin(0.28);
  const scale = exploded ? 110 : 155;

  if (exploded) {
    for (const [name, vec] of Object.entries(explosionVectors)) {
      const obj = scene.getObjectByName(name);
      if (obj) {
        obj.position.x += vec[0];
        obj.position.y += vec[1];
        obj.position.z += vec[2];
      }
    }
  }

  scene.updateMatrixWorld(true);

  const meshes = [];
  scene.traverse(n => { if (n.isMesh) meshes.push(n); });
  meshes.sort((a, b) => {
    const aTrans = a.material && a.material.transparent ? 1 : 0;
    const bTrans = b.material && b.material.transparent ? 1 : 0;
    return aTrans - bTrans;
  });

  const lightDir = new THREE.Vector3(0.5, 0.8, 0.6).normalize();

  for (const node of meshes) {
    const geom = node.geometry;
    const pos = geom.attributes.position;
    const index = geom.index;
    const mat = node.material;
    const baseColor = mat && mat.color ? mat.color : new THREE.Color(0.8, 0.2, 0.2);
    const isTrans = Boolean(mat && mat.transparent);
    const opacity = isTrans ? (mat.opacity || 0.4) : 1.0;

    node.updateWorldMatrix(true, false);
    const worldMat = node.matrixWorld;

    const count = index ? index.count / 3 : pos.count / 3;

    for (let t = 0; t < count; t++) {
      const i0 = index ? index.getX(t * 3) : t * 3;
      const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;

      const getV = (i) => {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        v.applyMatrix4(worldMat);
        const rx = v.x * cosY - v.z * sinY;
        const rz = v.x * sinY + v.z * cosY;
        const ry = v.y * cosX - rz * sinX;
        const rz2 = v.y * sinX + rz * cosX;
        return {
          px: Math.floor(W / 2 + rx * scale),
          py: Math.floor(H / 2 - ry * scale),
          pz: rz2,
          v
        };
      };

      const p0 = getV(i0), p1 = getV(i1), p2 = getV(i2);
      const e1 = new THREE.Vector3().subVectors(p1.v, p0.v);
      const e2 = new THREE.Vector3().subVectors(p2.v, p0.v);
      const normal = new THREE.Vector3().crossVectors(e1, e2).normalize();
      const dot = Math.max(0.15, normal.dot(lightDir));

      let r = Math.floor(baseColor.r * 255 * (0.35 + 0.65 * dot));
      let g = Math.floor(baseColor.g * 255 * (0.35 + 0.65 * dot));
      let b = Math.floor(baseColor.b * 255 * (0.35 + 0.65 * dot));

      if (mat && mat.metalness && mat.metalness > 0.8) {
        const highlight = Math.pow(Math.max(0, normal.dot(lightDir)), 16);
        r = Math.min(255, r + Math.floor(highlight * 140));
        g = Math.min(255, g + Math.floor(highlight * 140));
        b = Math.min(255, b + Math.floor(highlight * 140));
      }

      const minPX = Math.max(0, Math.min(p0.px, p1.px, p2.px));
      const maxPX = Math.min(W - 1, Math.max(p0.px, p1.px, p2.px));
      const minPY = Math.max(0, Math.min(p0.py, p1.py, p2.py));
      const maxPY = Math.min(H - 1, Math.max(p0.py, p1.py, p2.py));

      const den = (p1.py - p2.py) * (p0.px - p2.px) + (p2.px - p1.px) * (p0.py - p2.py);
      if (Math.abs(den) < 1e-6) continue;

      for (let y = minPY; y <= maxPY; y++) {
        for (let x = minPX; x <= maxPX; x++) {
          const w0 = ((p1.py - p2.py) * (x - p2.px) + (p2.px - p1.px) * (y - p2.py)) / den;
          const w1 = ((p2.py - p0.py) * (x - p2.px) + (p0.px - p2.px) * (y - p2.py)) / den;
          const w2 = 1 - w0 - w1;

          if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
            const z = w0 * p0.pz + w1 * p1.pz + w2 * p2.pz;
            const idx = y * W + x;

            if (isTrans) {
              if (z >= zbuf[idx] - 0.05) {
                const off = idx * 3;
                buf[off] = Math.floor(buf[off] * (1 - opacity) + r * opacity);
                buf[off + 1] = Math.floor(buf[off + 1] * (1 - opacity) + g * opacity);
                buf[off + 2] = Math.floor(buf[off + 2] * (1 - opacity) + b * opacity);
              }
            } else {
              if (z > zbuf[idx]) {
                zbuf[idx] = z;
                const off = idx * 3;
                buf[off] = r;
                buf[off + 1] = g;
                buf[off + 2] = b;
              }
            }
          }
        }
      }
    }
  }

  sharp(buf, { raw: { width: W, height: H, channels: 3 } }).png().toFile(outPath);
  console.log("Saved preview to:", outPath);
}

new GLTFLoader().parse(arrayBuffer, "", (gltf) => {
  const brainDir = "C:/Users/gamer/.gemini/antigravity/brain/58ef3f7b-2428-413b-baa9-293fb9b2e633";
  renderSceneToFile(gltf.scene.clone(true), path.join(brainDir, "balaji_preview_split.png"), false);
  renderSceneToFile(gltf.scene.clone(true), path.join(brainDir, "balaji_preview_exploded.png"), true);
});