import fs from "fs";
import path from "path";
import * as THREE from "three";
import sharp from "sharp";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

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

function extractSubGeometry(geom, indices) {
  const pos = geom.attributes.position;
  const newIndices = [];
  const oldToNew = new Map();
  const newPositions = [];

  for (let i = 0; i < indices.length; i++) {
    const oldIdx = indices[i];
    let newIdx = oldToNew.get(oldIdx);
    if (newIdx === undefined) {
      newIdx = newPositions.length / 3;
      oldToNew.set(oldIdx, newIdx);
      newPositions.push(pos.getX(oldIdx), pos.getY(oldIdx), pos.getZ(oldIdx));
    }
    newIndices.push(newIdx);
  }

  const subGeom = new THREE.BufferGeometry();
  subGeom.setAttribute("position", new THREE.Float32BufferAttribute(newPositions, 3));
  subGeom.setIndex(newIndices);
  subGeom.computeVertexNormals();
  return subGeom;
}

const inputPath = path.join(process.cwd(), "public", "models", "e_rickshaw.glb");
const outputPath = path.join(process.cwd(), "public", "models", "balaji-rickshaw.glb");

const data = fs.readFileSync(inputPath);
const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

const matDealershipRed = new THREE.MeshStandardMaterial({
  color: 0xC9232A,
  roughness: 0.22,
  metalness: 0.48,
});

const matDarkRed = new THREE.MeshStandardMaterial({
  color: 0x991B1E,
  roughness: 0.68,
  metalness: 0.08,
});

const matChrome = new THREE.MeshStandardMaterial({
  color: 0xF8FAFC,
  roughness: 0.08,
  metalness: 0.96,
});

const matDarkSteel = new THREE.MeshStandardMaterial({
  color: 0x1E2226,
  roughness: 0.38,
  metalness: 0.75,
});

const matFloorSteel = new THREE.MeshStandardMaterial({
  color: 0x2A2E33,
  roughness: 0.65,
  metalness: 0.45,
});

const matTireRubber = new THREE.MeshStandardMaterial({
  color: 0x181A1C,
  roughness: 0.88,
  metalness: 0.04,
});

const matAlloyRim = new THREE.MeshStandardMaterial({
  color: 0xE2E8F0,
  roughness: 0.18,
  metalness: 0.88,
});

const matWindshieldGlass = new THREE.MeshPhysicalMaterial({
  color: 0xDCEBFA,
  roughness: 0.04,
  metalness: 0.08,
  transmission: 0.88,
  opacity: 0.32,
  transparent: true,
  depthWrite: false,
  ior: 1.5,
  reflectivity: 0.9,
});

const matCurtains = new THREE.MeshStandardMaterial({
  color: 0xF1F5F9,
  roughness: 0.65,
  metalness: 0.05,
  opacity: 0.45,
  transparent: true,
  depthWrite: false,
});

new GLTFLoader().parse(
  arrayBuffer,
  "",
  async (gltf) => {
    const rawMesh = gltf.scene.children[0];
    const geom = rawMesh.geometry;
    const pos = geom.attributes.position;
    const index = geom.index;
    const triCount = index.count / 3;

    const I = {
      canopy: [],
      luggageRack: [],
      curtains: [],
      windshieldGlass: [],
      windshieldFrame: [],
      frontCowl: [],
      handlebars: [],
      frontFork: [],
      frontWheelTire: [],
      frontWheelRim: [],
      rearWheelLeftTire: [],
      rearWheelLeftRim: [],
      rearWheelRightTire: [],
      rearWheelRightRim: [],
      spareWheelTire: [],
      spareWheelRim: [],
      seats: [],
      safetyGates: [],
      bodyPanels: [],
      battery: [],
      motor: [],
      chassisFloor: [],
      chassisFrame: []
    };

    for (let t = 0; t < triCount; t++) {
      const idx0 = index.getX(t * 3);
      const idx1 = index.getX(t * 3 + 1);
      const idx2 = index.getX(t * 3 + 2);
      const tris = [idx0, idx1, idx2];

      const cx = (pos.getX(idx0) + pos.getX(idx1) + pos.getX(idx2)) / 3;
      const cy = (pos.getY(idx0) + pos.getY(idx1) + pos.getY(idx2)) / 3;
      const cz = (pos.getZ(idx0) + pos.getZ(idx1) + pos.getZ(idx2)) / 3;

      const ax = pos.getX(idx1) - pos.getX(idx0), ay = pos.getY(idx1) - pos.getY(idx0), az = pos.getZ(idx1) - pos.getZ(idx0);
      const bx = pos.getX(idx2) - pos.getX(idx0), by = pos.getY(idx2) - pos.getY(idx0), bz = pos.getZ(idx2) - pos.getZ(idx0);
      const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
      const len = Math.hypot(nx, ny, nz) || 1;
      const nxNorm = Math.abs(nx / len);
      const nyNorm = Math.abs(ny / len);

      const spareDist = Math.hypot(cy - 0.096, cz);

      if (cx > 0.75 && spareDist < 0.22) {
        if (spareDist > 0.142) I.spareWheelTire.push(...tris);
        else I.spareWheelRim.push(...tris);
      } else if (cy < -0.22 && cx < -0.48 && Math.abs(cz) < 0.22) {
        const fwDist = Math.hypot(cx - (-0.716), cy - (-0.385));
        if (fwDist > 0.142) I.frontWheelTire.push(...tris);
        else I.frontWheelRim.push(...tris);
      } else if (cy < -0.22 && cx > 0.35 && cz < -0.22) {
        const rwlDist = Math.hypot(cx - 0.602, cy - (-0.385));
        if (rwlDist > 0.142) I.rearWheelLeftTire.push(...tris);
        else I.rearWheelLeftRim.push(...tris);
      } else if (cy < -0.22 && cx > 0.35 && cz > 0.22) {
        const rwrDist = Math.hypot(cx - 0.602, cy - (-0.385));
        if (rwrDist > 0.142) I.rearWheelRightTire.push(...tris);
        else I.rearWheelRightRim.push(...tris);
      } else if (cy > 0.35) {
        if (cy > 0.53 && (Math.abs(cz) > 0.32 || cx < -0.2 || cx > 0.45)) {
          I.luggageRack.push(...tris);
        } else if (Math.abs(cz) > 0.41 && cy < 0.43) {
          I.curtains.push(...tris);
        } else {
          I.canopy.push(...tris);
        }
      } else if (cx < -0.35 && cy > -0.22) {
        if (cx < -0.48 && cy > 0.10 && cy < 0.42 && Math.abs(cz) < 0.36 && nxNorm > 0.4) {
          I.windshieldGlass.push(...tris);
        } else if (cx < -0.48 && cy > 0.10) {
          I.windshieldFrame.push(...tris);
        } else if (cy > 0.05 && Math.abs(cz) < 0.25) {
          I.handlebars.push(...tris);
        } else if (cy <= -0.10 && Math.abs(cz) < 0.15) {
          I.frontFork.push(...tris);
        } else {
          I.frontCowl.push(...tris);
        }
      } else if (cy > -0.02 && cy <= 0.35 && cx > -0.35 && cx <= 0.65) {
        if (Math.abs(cz) > 0.40) {
          I.safetyGates.push(...tris);
        } else if (nyNorm > 0.5 || cy > 0.05) {
          I.seats.push(...tris);
        } else {
          I.safetyGates.push(...tris);
        }
      } else if (cx > 0.62 && cy > -0.22) {
        I.bodyPanels.push(...tris);
      } else if (Math.abs(cz) > 0.38 && cy > -0.25 && cy < 0.10) {
        I.bodyPanels.push(...tris);
      } else if (cx > 0.40 && cy < -0.25 && Math.abs(cz) < 0.22) {
        I.motor.push(...tris);
      } else if (cx > 0.02 && cx < 0.52 && cy > -0.35 && cy <= -0.02 && Math.abs(cz) < 0.38) {
        I.battery.push(...tris);
      } else {
        if (cy > -0.38 && Math.abs(cz) < 0.38) I.chassisFloor.push(...tris);
        else I.chassisFrame.push(...tris);
      }
    }

    const exportRoot = new THREE.Group();
    exportRoot.name = "BalajiMotors_Rickshaw_Root";

    const groupCanopy = new THREE.Group();
    groupCanopy.name = "Rickshaw_Canopy";
    if (I.canopy.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.canopy), matDealershipRed);
      m.name = "Canopy_Top";
      groupCanopy.add(m);
    }

    const groupLuggageRack = new THREE.Group();
    groupLuggageRack.name = "Rickshaw_LuggageRack";
    if (I.luggageRack.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.luggageRack), matChrome);
      m.name = "LuggageRack_Rails";
      groupLuggageRack.add(m);
    }

    const groupCurtains = new THREE.Group();
    groupCurtains.name = "Rickshaw_Curtains";
    if (I.curtains.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.curtains), matCurtains);
      m.name = "WeatherCurtains_Vinyl";
      groupCurtains.add(m);
    }

    const groupWindshield = new THREE.Group();
    groupWindshield.name = "Rickshaw_Windshield";
    if (I.windshieldGlass.length > 0) {
      const mGlass = new THREE.Mesh(extractSubGeometry(geom, I.windshieldGlass), matWindshieldGlass);
      mGlass.name = "Windshield_Glass";
      groupWindshield.add(mGlass);
    }
    if (I.windshieldFrame.length > 0) {
      const mFrame = new THREE.Mesh(extractSubGeometry(geom, I.windshieldFrame), matChrome);
      mFrame.name = "Windshield_Frame";
      groupWindshield.add(mFrame);
    }

    const groupFrontCowl = new THREE.Group();
    groupFrontCowl.name = "Rickshaw_FrontCowl";
    if (I.frontCowl.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.frontCowl), matDealershipRed);
      m.name = "FrontCowl_Apron";
      groupFrontCowl.add(m);
    }

    const groupHandlebars = new THREE.Group();
    groupHandlebars.name = "Rickshaw_Handlebars";
    if (I.handlebars.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.handlebars), matChrome);
      m.name = "Handlebars_Controls";
      groupHandlebars.add(m);
    }

    const groupFrontFork = new THREE.Group();
    groupFrontFork.name = "Rickshaw_FrontFork";
    if (I.frontFork.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.frontFork), matChrome);
      m.name = "FrontFork_Suspension";
      groupFrontFork.add(m);
    }

    const groupFrontWheel = new THREE.Group();
    groupFrontWheel.name = "Rickshaw_FrontWheel";
    if (I.frontWheelTire.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.frontWheelTire), matTireRubber);
      m.name = "FrontWheel_Tire";
      groupFrontWheel.add(m);
    }
    if (I.frontWheelRim.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.frontWheelRim), matAlloyRim);
      m.name = "FrontWheel_Rim";
      groupFrontWheel.add(m);
    }

    const groupRearWheelLeft = new THREE.Group();
    groupRearWheelLeft.name = "Rickshaw_RearWheel_Left";
    if (I.rearWheelLeftTire.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.rearWheelLeftTire), matTireRubber);
      m.name = "RearWheelLeft_Tire";
      groupRearWheelLeft.add(m);
    }
    if (I.rearWheelLeftRim.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.rearWheelLeftRim), matAlloyRim);
      m.name = "RearWheelLeft_Rim";
      groupRearWheelLeft.add(m);
    }

    const groupRearWheelRight = new THREE.Group();
    groupRearWheelRight.name = "Rickshaw_RearWheel_Right";
    if (I.rearWheelRightTire.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.rearWheelRightTire), matTireRubber);
      m.name = "RearWheelRight_Tire";
      groupRearWheelRight.add(m);
    }
    if (I.rearWheelRightRim.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.rearWheelRightRim), matAlloyRim);
      m.name = "RearWheelRight_Rim";
      groupRearWheelRight.add(m);
    }

    const groupSpareWheel = new THREE.Group();
    groupSpareWheel.name = "Rickshaw_SpareWheel";
    if (I.spareWheelTire.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.spareWheelTire), matTireRubber);
      m.name = "SpareWheel_Tire";
      groupSpareWheel.add(m);
    }
    if (I.spareWheelRim.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.spareWheelRim), matAlloyRim);
      m.name = "SpareWheel_Rim";
      groupSpareWheel.add(m);
    }

    const groupSeats = new THREE.Group();
    groupSeats.name = "Rickshaw_Seats";
    if (I.seats.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.seats), matDarkRed);
      m.name = "Cabin_Seats";
      groupSeats.add(m);
    }

    const groupSafetyGates = new THREE.Group();
    groupSafetyGates.name = "Rickshaw_SafetyGates";
    if (I.safetyGates.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.safetyGates), matChrome);
      m.name = "SafetyGates_Rails";
      groupSafetyGates.add(m);
    }

    const groupBodyPanels = new THREE.Group();
    groupBodyPanels.name = "Rickshaw_BodyPanels";
    if (I.bodyPanels.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.bodyPanels), matDealershipRed);
      m.name = "Body_Panels";
      groupBodyPanels.add(m);
    }

    const groupBattery = new THREE.Group();
    groupBattery.name = "Rickshaw_Battery";
    if (I.battery.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.battery), matDarkSteel);
      m.name = "Traction_Battery_Cradle";
      groupBattery.add(m);
    }

    const groupMotor = new THREE.Group();
    groupMotor.name = "Rickshaw_Motor";
    if (I.motor.length > 0) {
      const m = new THREE.Mesh(extractSubGeometry(geom, I.motor), matDarkSteel);
      m.name = "Motor_Differential";
      groupMotor.add(m);
    }

    const groupChassis = new THREE.Group();
    groupChassis.name = "Rickshaw_Chassis";
    if (I.chassisFloor.length > 0) {
      const mFloor = new THREE.Mesh(extractSubGeometry(geom, I.chassisFloor), matFloorSteel);
      mFloor.name = "Chassis_Floorboard";
      groupChassis.add(mFloor);
    }
    if (I.chassisFrame.length > 0) {
      const mFrame = new THREE.Mesh(extractSubGeometry(geom, I.chassisFrame), matDarkSteel);
      mFrame.name = "Chassis_Frame";
      groupChassis.add(mFrame);
    }

    exportRoot.add(groupCanopy);
    exportRoot.add(groupLuggageRack);
    exportRoot.add(groupCurtains);
    exportRoot.add(groupWindshield);
    exportRoot.add(groupFrontCowl);
    exportRoot.add(groupHandlebars);
    exportRoot.add(groupFrontFork);
    exportRoot.add(groupFrontWheel);
    exportRoot.add(groupRearWheelLeft);
    exportRoot.add(groupRearWheelRight);
    exportRoot.add(groupSpareWheel);
    exportRoot.add(groupSeats);
    exportRoot.add(groupSafetyGates);
    exportRoot.add(groupBodyPanels);
    exportRoot.add(groupBattery);
    exportRoot.add(groupMotor);
    exportRoot.add(groupChassis);

    exportRoot.rotation.y = -Math.PI / 2;
    exportRoot.updateMatrixWorld(true);

    const scaleFactor = 1.40;
    exportRoot.scale.set(scaleFactor, scaleFactor, scaleFactor);
    exportRoot.updateMatrixWorld(true);

    const rawBox = new THREE.Box3().setFromObject(exportRoot);
    const rawCenter = new THREE.Vector3();
    rawBox.getCenter(rawCenter);

    exportRoot.position.x = -rawCenter.x;
    exportRoot.position.z = -rawCenter.z;
    exportRoot.position.y = -rawBox.min.y - 0.870;
    exportRoot.updateMatrixWorld(true);

    const finalScene = new THREE.Scene();
    finalScene.add(exportRoot);

    const finalBox = new THREE.Box3().setFromObject(finalScene);
    const finalSize = new THREE.Vector3();
    finalBox.getSize(finalSize);
    const finalCenter = new THREE.Vector3();
    finalBox.getCenter(finalCenter);

    console.log("Model Bounds:", JSON.stringify({
      size: finalSize,
      center: finalCenter,
      minY: finalBox.min.y,
      maxY: finalBox.max.y
    }));

    const exporter = new GLTFExporter();
    exporter.parse(
      finalScene,
      (gltf) => {
        fs.writeFileSync(outputPath, Buffer.from(gltf));
        console.log("Saved perfected balaji-rickshaw.glb size:", (gltf.byteLength / 1024).toFixed(1), "KB");
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
    process.exit(1);
  }
);