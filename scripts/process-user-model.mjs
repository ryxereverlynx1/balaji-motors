import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import fs from "fs";
import path from "path";

global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }).catch(err => {
      if (this.onerror) this.onerror(err);
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
};

const inputPath = path.join(process.cwd(), "public", "models", "e_rickshaw.glb");
const outputPath = path.join(process.cwd(), "public", "models", "balaji-rickshaw.glb");

const data = fs.readFileSync(inputPath);
const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

const matBodyRed = new THREE.MeshStandardMaterial({
  color: 0xC9232A,
  roughness: 0.22,
  metalness: 0.52,
});

const matDarkRed = new THREE.MeshStandardMaterial({
  color: 0x9F171D,
  roughness: 0.28,
  metalness: 0.45,
});

const matGoldAccent = new THREE.MeshStandardMaterial({
  color: 0xF2C94C,
  roughness: 0.2,
  metalness: 0.65,
});

const matChrome = new THREE.MeshStandardMaterial({
  color: 0xF1F5F9,
  roughness: 0.08,
  metalness: 0.98,
});

const matDarkSteel = new THREE.MeshStandardMaterial({
  color: 0x1E2226,
  roughness: 0.38,
  metalness: 0.75,
});

const matTireRubber = new THREE.MeshStandardMaterial({
  color: 0x181A1C,
  roughness: 0.88,
  metalness: 0.04,
});

const matAlloyRim = new THREE.MeshStandardMaterial({
  color: 0xD8DEE6,
  roughness: 0.18,
  metalness: 0.88,
});

const matSeatDark = new THREE.MeshStandardMaterial({
  color: 0x22252A,
  roughness: 0.75,
  metalness: 0.08,
});

const matSeatRed = new THREE.MeshStandardMaterial({
  color: 0x991B1E,
  roughness: 0.68,
  metalness: 0.08,
});

const matHeadlightLens = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  emissive: 0xFFF9E8,
  emissiveIntensity: 0.9,
  roughness: 0.08,
  metalness: 0.1,
});

const matCurtain = new THREE.MeshStandardMaterial({
  color: 0xEAE6DF,
  roughness: 0.82,
  metalness: 0.05,
});

const loader = new GLTFLoader();
loader.parse(
  arrayBuffer,
  "",
  (gltf) => {
    const rawScene = gltf.scene;

    const exportRoot = new THREE.Group();
    exportRoot.name = "BalajiMotors_Rickshaw_Root";

    const canopyGroup = new THREE.Group();
    canopyGroup.name = "Rickshaw_Canopy";

    const cabinGroup = new THREE.Group();
    cabinGroup.name = "Rickshaw_Cabin";

    const frontGroup = new THREE.Group();
    frontGroup.name = "Rickshaw_Front";

    const frontWheelGroup = new THREE.Group();
    frontWheelGroup.name = "Rickshaw_FrontWheel";

    const rearWheelLeftGroup = new THREE.Group();
    rearWheelLeftGroup.name = "Rickshaw_RearWheel_Left";

    const rearWheelRightGroup = new THREE.Group();
    rearWheelRightGroup.name = "Rickshaw_RearWheel_Right";

    const chassisGroup = new THREE.Group();
    chassisGroup.name = "Rickshaw_Chassis";

    const batteryGroup = new THREE.Group();
    batteryGroup.name = "Rickshaw_Battery";

    const motorGroup = new THREE.Group();
    motorGroup.name = "Rickshaw_Motor";

    rawScene.updateMatrixWorld(true);

    const meshes = [];
    rawScene.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });

    for (const mesh of meshes) {
      mesh.geometry.applyMatrix4(mesh.matrixWorld);
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(1, 1, 1);
      mesh.updateMatrixWorld(true);

      const geomBox = mesh.geometry.boundingBox || new THREE.Box3().setFromBufferAttribute(mesh.geometry.attributes.position);
      const center = new THREE.Vector3();
      geomBox.getCenter(center);

      const name = mesh.name || "";

      if (name.includes("Tyre002") || name.includes("Rim_polySurface004") || name.includes("polySurface1_Rim002") || name.includes("Bolts_") || name.includes("pCylinder16_Bolts002")) {
        if (name.includes("Tyre002")) {
          mesh.material = matTireRubber;
        } else if (name.includes("Rim")) {
          mesh.material = matAlloyRim;
        } else {
          mesh.material = matGoldAccent;
        }
        frontWheelGroup.add(mesh);
      } else if (name.includes("Tyre001")) {
        if (center.z > 0.1) {
          mesh.material = matTireRubber;
          rearWheelRightGroup.add(mesh);
        } else {
          mesh.material = matTireRubber;
          rearWheelLeftGroup.add(mesh);
        }
      } else if (center.y > 1.08) {
        if (name.includes("Line007") || name.includes("Line009") || name.includes("Line011") || name.includes("Line013")) {
          mesh.material = matGoldAccent;
        } else if (name.includes("Line008") || name.includes("Line010") || name.includes("Line012") || name.includes("Line014")) {
          mesh.material = matCurtain;
        } else {
          mesh.material = matChrome;
        }
        canopyGroup.add(mesh);
      } else if (name.includes("Box002")) {
        mesh.material = matBodyRed;
        canopyGroup.add(mesh);
      } else if (center.x > 0.72) {
        if (name.includes("Line016") || name.includes("Line017")) {
          mesh.material = matChrome;
        } else if (name.includes("Object014") || name.includes("Object015")) {
          mesh.material = matHeadlightLens;
        } else if (name.includes("Box006")) {
          mesh.material = matBodyRed;
        } else {
          mesh.material = matChrome;
        }
        frontGroup.add(mesh);
      } else if (name.includes("ChamferBox")) {
        if (name.includes("ChamferBox001") || name.includes("ChamferBox002")) {
          mesh.material = matSeatRed;
        } else {
          mesh.material = matSeatDark;
        }
        cabinGroup.add(mesh);
      } else if (name.includes("Rectangle")) {
        mesh.material = matDarkRed;
        cabinGroup.add(mesh);
      } else if (name.includes("Object004") || name.includes("Object005") || name.includes("Object007") || name.includes("Line003")) {
        mesh.material = matChrome;
        cabinGroup.add(mesh);
      } else if (name.includes("Box004") || name.includes("Box005") || name.includes("Line005") || name.includes("Line006")) {
        mesh.material = matDarkSteel;
        chassisGroup.add(mesh);
      } else {
        mesh.material = matDarkSteel;
        chassisGroup.add(mesh);
      }
    }

    const batt = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.38), matDarkSteel);
    batt.position.set(0.18, 0.42, 0);
    const battLid = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.03, 0.40), matGoldAccent);
    battLid.position.set(0.18, 0.54, 0);
    batteryGroup.add(batt);
    batteryGroup.add(battLid);

    const motorMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.26, 20), matDarkSteel);
    motorMesh.rotation.z = Math.PI / 2;
    motorMesh.position.set(-0.35, 0.22, 0);
    motorGroup.add(motorMesh);

    exportRoot.add(canopyGroup);
    exportRoot.add(cabinGroup);
    exportRoot.add(frontGroup);
    exportRoot.add(frontWheelGroup);
    exportRoot.add(rearWheelLeftGroup);
    exportRoot.add(rearWheelRightGroup);
    exportRoot.add(chassisGroup);
    exportRoot.add(batteryGroup);
    exportRoot.add(motorGroup);

    exportRoot.rotation.y = -Math.PI / 2;
    exportRoot.updateMatrixWorld(true);

    const scaleFactor = 1.35;
    exportRoot.scale.set(scaleFactor, scaleFactor, scaleFactor);
    exportRoot.updateMatrixWorld(true);

    const scaledBox = new THREE.Box3().setFromObject(exportRoot);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);

    exportRoot.position.x = -scaledCenter.x;
    exportRoot.position.y = -scaledCenter.y;
    exportRoot.position.z = -scaledCenter.z;
    exportRoot.updateMatrixWorld(true);

    const finalScene = new THREE.Scene();
    finalScene.add(exportRoot);

    const finalBox = new THREE.Box3().setFromObject(finalScene);
    const finalSize = new THREE.Vector3();
    finalBox.getSize(finalSize);
    const finalCenter = new THREE.Vector3();
    finalBox.getCenter(finalCenter);

    console.log("Final Centered Scaled Model Dimensions:", JSON.stringify(finalSize));
    console.log("Final Centered Scaled Model Origin:", JSON.stringify(finalCenter));

    const exporter = new GLTFExporter();
    exporter.parse(
      finalScene,
      (gltf) => {
        fs.writeFileSync(outputPath, Buffer.from(gltf));
        console.log("Successfully processed and saved:", outputPath, "Size:", (gltf.byteLength / 1024).toFixed(1), "KB");
      },
      (err) => {
        console.error("Export error:", err);
        process.exit(1);
      },
      { binary: true }
    );
  },
  (err) => {
    console.error("Parse error:", err);
  }
);
