import * as THREE from "three";
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

const root = process.cwd();
const outputDir = path.join(root, "public", "models");
fs.mkdirSync(outputDir, { recursive: true });

const scene = new THREE.Scene();
scene.name = "BalajiMotors_Rickshaw_Root";

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

const matMatteBlack = new THREE.MeshStandardMaterial({
  color: 0x141618,
  roughness: 0.72,
  metalness: 0.15,
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

const matGlass = new THREE.MeshPhysicalMaterial({
  color: 0xDCEBFA,
  transparent: true,
  opacity: 0.42,
  roughness: 0.06,
  transmission: 0.88,
  ior: 1.52,
  reflectivity: 0.85,
});

const matHeadlightLens = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  emissive: 0xFFF9E8,
  emissiveIntensity: 0.9,
  roughness: 0.08,
  metalness: 0.1,
});

const matAmberLens = new THREE.MeshStandardMaterial({
  color: 0xFB923C,
  emissive: 0xEA580C,
  emissiveIntensity: 0.75,
  roughness: 0.15,
});

const matTailLightLens = new THREE.MeshStandardMaterial({
  color: 0xEF4444,
  emissive: 0xDC2626,
  emissiveIntensity: 0.8,
  roughness: 0.15,
});

const matDigitalDisplay = new THREE.MeshStandardMaterial({
  color: 0x0F172A,
  emissive: 0x38BDF8,
  emissiveIntensity: 0.45,
  roughness: 0.2,
});

const matCurtain = new THREE.MeshStandardMaterial({
  color: 0xE2E8F0,
  roughness: 0.8,
  metalness: 0.05,
});

function createWheelMesh(isFront = false) {
  const wheelGroup = new THREE.Group();

  const tireGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.13, 32);
  const tire = new THREE.Mesh(tireGeom, matTireRubber);
  tire.rotation.z = Math.PI / 2;
  wheelGroup.add(tire);

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const ribGeom = new THREE.BoxGeometry(0.015, 0.012, 0.132);
    const rib = new THREE.Mesh(ribGeom, matMatteBlack);
    rib.position.set(0, Math.cos(angle) * 0.238, Math.sin(angle) * 0.238);
    rib.rotation.x = -angle;
    wheelGroup.add(rib);
  }

  const rimOuterGeom = new THREE.CylinderGeometry(0.165, 0.165, 0.132, 28);
  const rimOuter = new THREE.Mesh(rimOuterGeom, matAlloyRim);
  rimOuter.rotation.z = Math.PI / 2;
  wheelGroup.add(rimOuter);

  const hubGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.14, 20);
  const hub = new THREE.Mesh(hubGeom, matChrome);
  hub.rotation.z = Math.PI / 2;
  wheelGroup.add(hub);

  const hubRingGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.142, 16);
  const hubRing = new THREE.Mesh(hubRingGeom, matDarkRed);
  hubRing.rotation.z = Math.PI / 2;
  wheelGroup.add(hubRing);

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const spokeGeom = new THREE.BoxGeometry(0.136, 0.018, 0.024);
    const spoke = new THREE.Mesh(spokeGeom, matAlloyRim);
    spoke.position.set(0, Math.sin(angle) * 0.105, Math.cos(angle) * 0.105);
    spoke.rotation.x = -angle;
    wheelGroup.add(spoke);

    const nutGeom = new THREE.CylinderGeometry(0.009, 0.009, 0.144, 8);
    const nut = new THREE.Mesh(nutGeom, matGoldAccent);
    nut.rotation.z = Math.PI / 2;
    nut.position.set(0, Math.sin(angle) * 0.055, Math.cos(angle) * 0.055);
    wheelGroup.add(nut);
  }

  return wheelGroup;
}

const chassisGroup = new THREE.Group();
chassisGroup.name = "Rickshaw_Chassis";

const mainRailLeft = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 2.35), matDarkSteel);
mainRailLeft.position.set(-0.38, 0.28, -0.05);
chassisGroup.add(mainRailLeft);

const mainRailRight = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 2.35), matDarkSteel);
mainRailRight.position.set(0.38, 0.28, -0.05);
chassisGroup.add(mainRailRight);

for (let i = 0; i < 5; i++) {
  const zPos = -1.05 + i * 0.52;
  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.055, 0.055), matDarkSteel);
  crossBeam.position.set(0, 0.28, zPos);
  chassisGroup.add(crossBeam);
}

const rearBumperTube = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.98, 16), matChrome);
rearBumperTube.rotation.z = Math.PI / 2;
rearBumperTube.position.set(0, 0.32, -1.24);
chassisGroup.add(rearBumperTube);

const bumperStayL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), matDarkSteel);
bumperStayL.position.set(-0.35, 0.3, -1.16);
chassisGroup.add(bumperStayL);

const bumperStayR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), matDarkSteel);
bumperStayR.position.set(0.35, 0.3, -1.16);
chassisGroup.add(bumperStayR);

for (let s = -1; s <= 1; s += 2) {
  const leafGroup = new THREE.Group();
  leafGroup.position.set(s * 0.44, 0.22, -0.65);
  for (let l = 0; l < 4; l++) {
    const leafLength = 0.52 - l * 0.09;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.012, leafLength), matDarkSteel);
    leaf.position.y = -l * 0.011;
    leafGroup.add(leaf);
  }
  const uBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.07, 8), matChrome);
  uBolt.position.set(0, -0.015, 0);
  leafGroup.add(uBolt);
  chassisGroup.add(leafGroup);
}

const floorPlate = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.022, 1.15), matDarkSteel);
floorPlate.position.set(0, 0.31, 0.12);
chassisGroup.add(floorPlate);

for (let r = 0; r < 8; r++) {
  const ribZ = -0.38 + r * 0.14;
  const rubberRib = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.01, 0.025), matMatteBlack);
  rubberRib.position.set(0, 0.322, ribZ);
  chassisGroup.add(rubberRib);
}

const footStepLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.65), matGoldAccent);
footStepLeft.position.set(-0.48, 0.26, 0.12);
chassisGroup.add(footStepLeft);

const footStepRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.65), matGoldAccent);
footStepRight.position.set(0.48, 0.26, 0.12);
chassisGroup.add(footStepRight);

scene.add(chassisGroup);

const motorGroup = new THREE.Group();
motorGroup.name = "Rickshaw_Motor";

const motorCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.28, 24), matDarkSteel);
motorCylinder.rotation.z = Math.PI / 2;
motorCylinder.position.set(0, 0.26, -0.65);
motorGroup.add(motorCylinder);

for (let f = 0; f < 9; f++) {
  const finX = -0.12 + f * 0.03;
  const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.118, 0.008, 24), matAlloyRim);
  fin.rotation.z = Math.PI / 2;
  fin.position.set(finX, 0.26, -0.65);
  motorGroup.add(fin);
}

const diffCase = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), matDarkSteel);
diffCase.scale.set(1.1, 0.95, 1.25);
diffCase.position.set(0, 0.26, -0.65);
motorGroup.add(diffCase);

const diffCover = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 16), matChrome);
diffCover.rotation.x = Math.PI / 2;
diffCover.position.set(0, 0.26, -0.74);
motorGroup.add(diffCover);

const axleTubeLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.44, 16), matDarkSteel);
axleTubeLeft.rotation.z = Math.PI / 2;
axleTubeLeft.position.set(-0.3, 0.26, -0.65);
motorGroup.add(axleTubeLeft);

const axleTubeRight = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.44, 16), matDarkSteel);
axleTubeRight.rotation.z = Math.PI / 2;
axleTubeRight.position.set(0.3, 0.26, -0.65);
motorGroup.add(axleTubeRight);

scene.add(motorGroup);

const batteryGroup = new THREE.Group();
batteryGroup.name = "Rickshaw_Battery";

const batteryBox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.48), matDarkSteel);
batteryBox.position.set(0, 0.46, -0.15);
batteryGroup.add(batteryBox);

const batteryLid = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.035, 0.50), matBodyRed);
batteryLid.position.set(0, 0.61, -0.15);
batteryGroup.add(batteryLid);

const lidBorder = new THREE.Mesh(new THREE.BoxGeometry(0.745, 0.015, 0.505), matGoldAccent);
lidBorder.position.set(0, 0.595, -0.15);
batteryGroup.add(lidBorder);

for (let s = 0; s < 4; s++) {
  const ventSlot = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.018, 0.02), matMatteBlack);
  ventSlot.position.set(0, 0.41 + s * 0.042, 0.095);
  batteryGroup.add(ventSlot);
}

const terminalPositive = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.045, 12), matTailLightLens);
terminalPositive.position.set(0.24, 0.63, -0.15);
batteryGroup.add(terminalPositive);

const terminalNegative = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.045, 12), matMatteBlack);
terminalNegative.position.set(-0.24, 0.63, -0.15);
batteryGroup.add(terminalNegative);

const cableCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.24, 0.63, -0.15),
  new THREE.Vector3(0.26, 0.52, -0.32),
  new THREE.Vector3(0.08, 0.32, -0.58),
  new THREE.Vector3(0.0, 0.28, -0.65),
]);
const cableGeom = new THREE.TubeGeometry(cableCurve, 18, 0.014, 8, false);
const cableMesh = new THREE.Mesh(cableGeom, matAmberLens);
batteryGroup.add(cableMesh);

scene.add(batteryGroup);

const cabinGroup = new THREE.Group();
cabinGroup.name = "Rickshaw_Cabin";

const rearCowlLower = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.36, 0.94), matBodyRed);
rearCowlLower.position.set(0, 0.48, -0.68);
cabinGroup.add(rearCowlLower);

const rearPanelStrip = new THREE.Mesh(new THREE.BoxGeometry(0.885, 0.03, 0.945), matGoldAccent);
rearPanelStrip.position.set(0, 0.52, -0.68);
cabinGroup.add(rearPanelStrip);

const driverSeatBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.36), matSeatDark);
driverSeatBase.position.set(0, 0.66, 0.32);
cabinGroup.add(driverSeatBase);

const driverCushion = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.065, 0.34), matSeatRed);
driverCushion.position.set(0, 0.73, 0.32);
cabinGroup.add(driverCushion);

const driverBackrest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.06), matSeatDark);
driverBackrest.position.set(0, 0.88, 0.15);
cabinGroup.add(driverBackrest);

const passSeatBase1 = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.09, 0.40), matSeatDark);
passSeatBase1.position.set(0, 0.67, -0.38);
cabinGroup.add(passSeatBase1);

const passCushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.065, 0.38), matSeatRed);
passCushion1.position.set(0, 0.74, -0.38);
cabinGroup.add(passCushion1);

const passSeatBase2 = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.09, 0.40), matSeatDark);
passSeatBase2.position.set(0, 0.67, -0.92);
cabinGroup.add(passSeatBase2);

const passCushion2 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.065, 0.38), matSeatRed);
passCushion2.position.set(0, 0.74, -0.92);
cabinGroup.add(passCushion2);

const backrestDivider = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.42, 0.12), matSeatDark);
backrestDivider.position.set(0, 0.94, -0.65);
cabinGroup.add(backrestDivider);

const backrestFrontCushion = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.36, 0.04), matSeatRed);
backrestFrontCushion.position.set(0, 0.94, -0.58);
cabinGroup.add(backrestFrontCushion);

const backrestRearCushion = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.36, 0.04), matSeatRed);
backrestRearCushion.position.set(0, 0.94, -0.72);
cabinGroup.add(backrestRearCushion);

for (let side = -1; side <= 1; side += 2) {
  const xPos = side * 0.45;

  const railTop = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.12, 12), matChrome);
  railTop.rotation.x = Math.PI / 2;
  railTop.position.set(xPos, 0.98, -0.65);
  cabinGroup.add(railTop);

  const railMid = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 1.12, 12), matChrome);
  railMid.rotation.x = Math.PI / 2;
  railMid.position.set(xPos, 0.82, -0.65);
  cabinGroup.add(railMid);

  const postF = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.58, 12), matChrome);
  postF.position.set(xPos, 0.69, -0.12);
  cabinGroup.add(postF);

  const postM = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.58, 12), matChrome);
  postM.position.set(xPos, 0.69, -0.65);
  cabinGroup.add(postM);

  const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.58, 12), matChrome);
  postR.position.set(xPos, 0.69, -1.18);
  cabinGroup.add(postR);

  const guardPlate = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.16, 0.42), matBodyRed);
  guardPlate.position.set(xPos, 0.72, -0.42);
  cabinGroup.add(guardPlate);
}

const spareWheelHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.52, 12), matChrome);
spareWheelHolder.position.set(0, 0.92, -1.22);
cabinGroup.add(spareWheelHolder);

const spareWheelTire = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.11, 24), matTireRubber);
spareWheelTire.rotation.x = Math.PI / 2;
spareWheelTire.position.set(0, 0.92, -1.26);
cabinGroup.add(spareWheelTire);

const spareWheelRim = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.115, 20), matAlloyRim);
spareWheelRim.rotation.x = Math.PI / 2;
spareWheelRim.position.set(0, 0.92, -1.26);
cabinGroup.add(spareWheelRim);

const spareWheelCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16), matDarkRed);
spareWheelCap.rotation.x = Math.PI / 2;
spareWheelCap.position.set(0, 0.92, -1.26);
cabinGroup.add(spareWheelCap);

for (let s = -1; s <= 1; s += 2) {
  const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.09, 0.03), matTailLightLens);
  tailLight.position.set(s * 0.38, 0.48, -1.16);
  cabinGroup.add(tailLight);
}

scene.add(cabinGroup);

const canopyGroup = new THREE.Group();
canopyGroup.name = "Rickshaw_Canopy";

const roofCurve = new THREE.Shape();
roofCurve.moveTo(-0.48, 0);
roofCurve.lineTo(-0.46, 0.045);
roofCurve.lineTo(0, 0.08);
roofCurve.lineTo(0.46, 0.045);
roofCurve.lineTo(0.48, 0);
roofCurve.lineTo(-0.48, 0);

const extrudeSettings = {
  steps: 2,
  depth: 2.22,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.03,
  bevelSegments: 4,
};
const roofGeom = new THREE.ExtrudeGeometry(roofCurve, extrudeSettings);
const roofMesh = new THREE.Mesh(roofGeom, matBodyRed);
roofMesh.position.set(0, 1.68, -1.22);
canopyGroup.add(roofMesh);

const roofLip = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.03, 2.28), matGoldAccent);
roofLip.position.set(0, 1.67, -0.11);
canopyGroup.add(roofLip);

const signBox = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.14), matChrome);
signBox.position.set(0, 1.81, 0.88);
canopyGroup.add(signBox);

const signFace = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.09), matGoldAccent);
signFace.position.set(0, 1.81, 0.952);
canopyGroup.add(signFace);

const rackOuterL = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.45, 12), matChrome);
rackOuterL.rotation.x = Math.PI / 2;
rackOuterL.position.set(-0.36, 1.84, -0.32);
canopyGroup.add(rackOuterL);

const rackOuterR = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.45, 12), matChrome);
rackOuterR.rotation.x = Math.PI / 2;
rackOuterR.position.set(0.36, 1.84, -0.32);
canopyGroup.add(rackOuterR);

const rackCrossF = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.72, 12), matChrome);
rackCrossF.rotation.z = Math.PI / 2;
rackCrossF.position.set(0, 1.84, 0.4);
canopyGroup.add(rackCrossF);

const rackCrossR = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.72, 12), matChrome);
rackCrossR.rotation.z = Math.PI / 2;
rackCrossR.position.set(0, 1.84, -1.04);
canopyGroup.add(rackCrossR);

for (let r = 0; r < 4; r++) {
  const rZ = -0.76 + r * 0.32;
  const rackRib = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.72, 8), matChrome);
  rackRib.rotation.z = Math.PI / 2;
  rackRib.position.set(0, 1.78, rZ);
  canopyGroup.add(rackRib);
}

for (let side = -1; side <= 1; side += 2) {
  const xP = side * 0.44;

  const pillarF = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.88, 12), matChrome);
  pillarF.position.set(xP, 1.25, 0.42);
  canopyGroup.add(pillarF);

  const pillarR = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.88, 12), matChrome);
  pillarR.position.set(xP, 1.25, -1.08);
  canopyGroup.add(pillarR);

  const curtainRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 1.85, 12), matCurtain);
  curtainRoll.rotation.x = Math.PI / 2;
  curtainRoll.position.set(xP * 1.04, 1.64, -0.32);
  canopyGroup.add(curtainRoll);

  for (let b = 0; b < 4; b++) {
    const strapZ = -0.92 + b * 0.48;
    const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.03, 8), matMatteBlack);
    strap.rotation.x = Math.PI / 2;
    strap.position.set(xP * 1.04, 1.64, strapZ);
    canopyGroup.add(strap);
  }
}

for (let g = 0; g < 4; g++) {
  const handleZ = -0.85 + g * 0.38;
  const gripL = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 8, 16), matGoldAccent);
  gripL.position.set(-0.36, 1.55, handleZ);
  canopyGroup.add(gripL);

  const gripR = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 8, 16), matGoldAccent);
  gripR.position.set(0.36, 1.55, handleZ);
  canopyGroup.add(gripR);
}

scene.add(canopyGroup);

const frontGroup = new THREE.Group();
frontGroup.name = "Rickshaw_Front";

const stemTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52, 16), matDarkSteel);
stemTube.rotation.x = -0.18;
stemTube.position.set(0, 0.56, 0.98);
frontGroup.add(stemTube);

const crownPlate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.12), matChrome);
crownPlate.position.set(0, 0.78, 1.02);
frontGroup.add(crownPlate);

for (let side = -1; side <= 1; side += 2) {
  const forkX = side * 0.11;

  const upperFork = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.58, 16), matChrome);
  upperFork.rotation.x = -0.18;
  upperFork.position.set(forkX, 0.52, 1.06);
  frontGroup.add(upperFork);

  const coilSpring = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.32, 16), matAlloyRim);
  coilSpring.rotation.x = -0.18;
  coilSpring.position.set(forkX, 0.44, 1.09);
  frontGroup.add(coilSpring);

  for (let c = 0; c < 6; c++) {
    const ringZ = 1.04 + c * 0.024;
    const ringY = 0.52 - c * 0.046;
    const springRing = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.007, 8, 16), matChrome);
    springRing.rotation.x = Math.PI / 2 - 0.18;
    springRing.position.set(forkX, ringY, ringZ);
    frontGroup.add(springRing);
  }
}

const mudguardGeom = new THREE.CylinderGeometry(0.29, 0.29, 0.16, 24, 1, true, Math.PI * 0.08, Math.PI * 0.85);
const mudguard = new THREE.Mesh(mudguardGeom, matBodyRed);
mudguard.rotation.z = Math.PI / 2;
mudguard.rotation.x = -0.22;
mudguard.position.set(0, 0.36, 1.15);
frontGroup.add(mudguard);

const mudguardTrim = new THREE.Mesh(new THREE.BoxGeometry(0.165, 0.025, 0.02), matGoldAccent);
mudguardTrim.position.set(0, 0.18, 0.94);
frontGroup.add(mudguardTrim);

const frontCowlShield = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.55, 0.12), matBodyRed);
frontCowlShield.rotation.x = -0.16;
frontCowlShield.position.set(0, 0.62, 0.78);
frontGroup.add(frontCowlShield);

const cowlBumperBar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.74, 16), matChrome);
cowlBumperBar.rotation.z = Math.PI / 2;
cowlBumperBar.position.set(0, 0.44, 0.86);
frontGroup.add(cowlBumperBar);

const headlampHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.12, 24), matChrome);
headlampHousing.rotation.x = Math.PI / 2 - 0.14;
headlampHousing.position.set(0, 0.68, 1.04);
frontGroup.add(headlampHousing);

const headlampLens = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.015, 24), matHeadlightLens);
headlampLens.rotation.x = Math.PI / 2 - 0.14;
headlampLens.position.set(0, 0.68, 1.102);
frontGroup.add(headlampLens);

for (let ind = -1; ind <= 1; ind += 2) {
  const indPod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.05, 16), matChrome);
  indPod.rotation.x = Math.PI / 2 - 0.14;
  indPod.position.set(ind * 0.18, 0.68, 0.99);
  frontGroup.add(indPod);

  const indLens = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 16), matAmberLens);
  indLens.rotation.x = Math.PI / 2 - 0.14;
  indLens.position.set(ind * 0.18, 0.68, 1.02);
  frontGroup.add(indLens);
}

const numPlate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.012), matAlloyRim);
numPlate.position.set(0, 0.54, 1.04);
frontGroup.add(numPlate);

const numPlateTag = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.014), matGoldAccent);
numPlateTag.position.set(0, 0.54, 1.045);
frontGroup.add(numPlateTag);

const barCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 12), matChrome);
barCenter.rotation.z = Math.PI / 2;
barCenter.position.set(0, 0.96, 0.86);
frontGroup.add(barCenter);

for (let b = -1; b <= 1; b += 2) {
  const gripBar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26, 12), matChrome);
  gripBar.rotation.z = b * (Math.PI / 2 - 0.22);
  gripBar.rotation.y = -b * 0.25;
  gripBar.position.set(b * 0.24, 0.94, 0.82);
  frontGroup.add(gripBar);

  const rubberGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 12), matMatteBlack);
  rubberGrip.rotation.z = b * (Math.PI / 2 - 0.22);
  rubberGrip.rotation.y = -b * 0.25;
  rubberGrip.position.set(b * 0.32, 0.92, 0.8);
  frontGroup.add(rubberGrip);

  const brakeLever = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.008, 0.018), matAlloyRim);
  brakeLever.position.set(b * 0.27, 0.91, 0.84);
  frontGroup.add(brakeLever);
}

const meterBinnacle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.07), matChrome);
meterBinnacle.rotation.x = -0.55;
meterBinnacle.position.set(0, 0.98, 0.88);
frontGroup.add(meterBinnacle);

const meterScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.07), matDigitalDisplay);
meterScreen.rotation.x = -0.55;
meterScreen.position.set(0, 0.99, 0.91);
frontGroup.add(meterScreen);

for (let side = -1; side <= 1; side += 2) {
  const strutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.38, 0.88, 0.72),
    new THREE.Vector3(side * 0.42, 1.28, 0.58),
    new THREE.Vector3(side * 0.44, 1.65, 0.45),
  ]);
  const strutGeom = new THREE.TubeGeometry(strutCurve, 16, 0.016, 10, false);
  const strutMesh = new THREE.Mesh(strutGeom, matChrome);
  frontGroup.add(strutMesh);

  const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), matChrome);
  mirrorStem.position.set(side * 0.46, 1.18, 0.62);
  mirrorStem.rotation.z = side * 0.45;
  frontGroup.add(mirrorStem);

  const mirrorHead = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16), matChrome);
  mirrorHead.rotation.x = Math.PI / 2;
  mirrorHead.position.set(side * 0.52, 1.24, 0.62);
  frontGroup.add(mirrorHead);

  const mirrorGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.006, 16), matAlloyRim);
  mirrorGlass.rotation.x = Math.PI / 2;
  mirrorGlass.position.set(side * 0.52, 1.24, 0.61);
  frontGroup.add(mirrorGlass);
}

const windshieldFrame = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.72, 0.025), matDarkSteel);
windshieldFrame.rotation.x = -0.34;
windshieldFrame.position.set(0, 1.26, 0.58);
frontGroup.add(windshieldFrame);

const glassPane = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.66, 0.012), matGlass);
glassPane.rotation.x = -0.34;
glassPane.position.set(0, 1.26, 0.582);
frontGroup.add(glassPane);

const wiperMotor = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.04), matMatteBlack);
wiperMotor.position.set(-0.04, 0.96, 0.68);
frontGroup.add(wiperMotor);

const wiperArm = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.28, 0.01), matMatteBlack);
wiperArm.rotation.x = -0.34;
wiperArm.rotation.z = 0.35;
wiperArm.position.set(0.08, 1.15, 0.61);
frontGroup.add(wiperArm);

const wiperBlade = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.32, 0.012), matTireRubber);
wiperBlade.rotation.x = -0.34;
wiperBlade.rotation.z = -0.22;
wiperBlade.position.set(0.09, 1.24, 0.63);
frontGroup.add(wiperBlade);

scene.add(frontGroup);

const frontWheelGroup = new THREE.Group();
frontWheelGroup.name = "Rickshaw_FrontWheel";
const frontWheel = createWheelMesh(true);
frontWheel.position.set(0, 0.24, 1.18);
frontWheelGroup.add(frontWheel);
scene.add(frontWheelGroup);

const rearWheelLeftGroup = new THREE.Group();
rearWheelLeftGroup.name = "Rickshaw_RearWheel_Left";
const rearWheelLeft = createWheelMesh(false);
rearWheelLeft.position.set(-0.52, 0.24, -0.65);
rearWheelLeftGroup.add(rearWheelLeft);
scene.add(rearWheelLeftGroup);

const rearWheelRightGroup = new THREE.Group();
rearWheelRightGroup.name = "Rickshaw_RearWheel_Right";
const rearWheelRight = createWheelMesh(false);
rearWheelRight.position.set(0.52, 0.24, -0.65);
rearWheelRightGroup.add(rearWheelRight);
scene.add(rearWheelRightGroup);

const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (gltf) => {
    const outputPath = path.join(outputDir, "balaji-rickshaw.glb");
    fs.writeFileSync(outputPath, Buffer.from(gltf));
    console.log("Successfully generated realistic 3D model:", outputPath, "Size:", (gltf.byteLength / 1024).toFixed(1), "KB");
  },
  (err) => {
    console.error("Export error:", err);
    process.exit(1);
  },
  { binary: true }
);
