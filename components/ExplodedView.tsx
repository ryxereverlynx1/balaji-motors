"use client";

import React, { useState, useRef, useMemo, useEffect, Suspense, Component, ErrorInfo, ReactNode } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { explodedPartsData, VehiclePart } from "@/data/parts";
import { useLanguage } from "@/context/LanguageContext";
import {
  Layers,
  RotateCcw,
  ShieldCheck,
  Wrench,
  Clock,
  Info,
  CheckCircle,
  X,
  Play,
  Pause,
  Loader2,
} from "lucide-react";

interface ExplodedViewProps {
  vehicleName?: string;
  defaultAssembledImage?: string;
}

class ThreeErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function CameraController({
  isExploded,
  isAutoRotate,
  resetTrigger,
}: {
  isExploded: boolean;
  isAutoRotate: boolean;
  resetTrigger: number;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const prevExplodedRef = useRef(isExploded);
  const prevResetRef = useRef(resetTrigger);
  const animatingRef = useRef(false);
  const startTimeRef = useRef(0);
  const startPosRef = useRef(new THREE.Vector3());
  const targetPosRef = useRef(new THREE.Vector3());
  const startTargetRef = useRef(new THREE.Vector3());
  const targetLookRef = useRef(new THREE.Vector3());
  const controlsTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const stopAnimation = () => {
      animatingRef.current = false;
    };

    controls.addEventListener("start", stopAnimation);

    const dom = gl.domElement;
    if (dom) {
      dom.addEventListener("wheel", stopAnimation, { passive: true });
      dom.addEventListener("pointerdown", stopAnimation, { passive: true });
    }

    return () => {
      controls.removeEventListener("start", stopAnimation);
      if (dom) {
        dom.removeEventListener("wheel", stopAnimation);
        dom.removeEventListener("pointerdown", stopAnimation);
      }
    };
  }, [gl]);

  useEffect(() => {
    if (prevExplodedRef.current !== isExploded) {
      prevExplodedRef.current = isExploded;
      animatingRef.current = true;
      startTimeRef.current = performance.now();
      startPosRef.current.copy(camera.position);
      if (controlsRef.current) {
        startTargetRef.current.copy(controlsRef.current.target);
      }
      if (isExploded) {
        targetPosRef.current.set(3.0, 1.4, 3.2);
        targetLookRef.current.set(0, 0, 0);
      } else {
        targetPosRef.current.set(2.1, 0.95, 2.3);
        targetLookRef.current.set(0, 0, 0);
      }
    }
  }, [isExploded, camera]);

  useEffect(() => {
    if (prevResetRef.current !== resetTrigger && resetTrigger > 0) {
      prevResetRef.current = resetTrigger;
      animatingRef.current = true;
      startTimeRef.current = performance.now();
      startPosRef.current.copy(camera.position);
      if (controlsRef.current) {
        startTargetRef.current.copy(controlsRef.current.target);
      }
      targetPosRef.current.set(2.1, 0.95, 2.3);
      targetLookRef.current.set(0, 0, 0);
    }
  }, [resetTrigger, camera]);

  useFrame(() => {
    if (animatingRef.current) {
      const elapsed = (performance.now() - startTimeRef.current) / 750;
      if (elapsed >= 1) {
        animatingRef.current = false;
        camera.position.copy(targetPosRef.current);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookRef.current);
          controlsRef.current.update();
        }
      } else {
        const ease = 1 - Math.pow(1 - elapsed, 3);
        camera.position.lerpVectors(startPosRef.current, targetPosRef.current, ease);
        if (controlsRef.current) {
          controlsRef.current.target.lerpVectors(startTargetRef.current, targetLookRef.current, ease);
          controlsRef.current.update();
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={controlsTarget}
      enablePan={false}
      enableZoom={true}
      enableDamping={true}
      dampingFactor={0.06}
      minDistance={1.0}
      maxDistance={6.0}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.05}
      autoRotate={isAutoRotate}
      autoRotateSpeed={1.2}
    />
  );
}

function ExplodedRickshawModel({
  isExploded,
  selectedPartId,
  hoveredPartId,
  isHindi,
  onSelectPart,
  onHoverPart,
}: {
  isExploded: boolean;
  selectedPartId: string | null;
  hoveredPartId: string | null;
  isHindi: boolean;
  onSelectPart: (part: VehiclePart) => void;
  onHoverPart: (id: string | null) => void;
}) {
  const { scene } = useGLTF("/models/balaji-rickshaw.glb");
  const progressRef = useRef(0);
  const [showPins, setShowPins] = useState(false);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const groupsMap = useMemo(() => {
    const map: Record<string, THREE.Object3D> = {};
    clonedScene.traverse((child) => {
      if (child.name && child.name.startsWith("Rickshaw_")) {
        map[child.name] = child;
      }
    });
    return map;
  }, [clonedScene]);

  const originalPositions = useMemo(() => {
    const map: Record<string, THREE.Vector3> = {};
    for (const [name, obj] of Object.entries(groupsMap)) {
      map[name] = obj.position.clone();
    }
    return map;
  }, [groupsMap]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        if (m.material) {
          const mat = Array.isArray(m.material) ? m.material[0] : m.material;
          if (mat && mat.transparent) {
            mat.depthWrite = false;
          }
        }
      }
    });
  }, [clonedScene]);

  const partByModelObject = useMemo(() => {
    const map: Record<string, VehiclePart> = {};
    for (const p of explodedPartsData) {
      map[p.modelObject] = p;
    }
    return map;
  }, []);

  const partById = useMemo(() => {
    const map: Record<string, VehiclePart> = {};
    for (const p of explodedPartsData) {
      map[p.id] = p;
    }
    return map;
  }, []);

  useFrame((_, delta) => {
    const targetProgress = isExploded ? 1.0 : 0.0;
    progressRef.current = THREE.MathUtils.damp(progressRef.current, targetProgress, 4.2, delta);

    if (progressRef.current > 0.45 && !showPins && isExploded) {
      setShowPins(true);
    } else if (progressRef.current <= 0.45 && showPins) {
      setShowPins(false);
    }

    for (const part of explodedPartsData) {
      const obj = groupsMap[part.modelObject];
      const orig = originalPositions[part.modelObject];
      if (obj && orig) {
        obj.position.x = orig.x + part.explosionVector[0] * progressRef.current;
        obj.position.y = orig.y + part.explosionVector[1] * progressRef.current;
        obj.position.z = orig.z + part.explosionVector[2] * progressRef.current;
      }
    }

    for (const [name, obj] of Object.entries(groupsMap)) {
      const part = partByModelObject[name];
      const isSelected = part && part.id === selectedPartId;
      const isHovered = part && part.id === hoveredPartId;

      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          if (m.material) {
            const mat = Array.isArray(m.material) ? m.material[0] : m.material;
            if (mat && (mat as THREE.MeshStandardMaterial).emissive) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              if (isSelected) {
                stdMat.emissive.set("#C9232A");
                stdMat.emissiveIntensity = 0.45;
              } else if (isHovered) {
                stdMat.emissive.set("#F2C94C");
                stdMat.emissiveIntensity = 0.35;
              } else {
                stdMat.emissive.set("#000000");
                stdMat.emissiveIntensity = 0.0;
              }
            }
          }
        }
      });
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    let curr: THREE.Object3D | null = e.object;
    while (curr && curr !== clonedScene) {
      if (curr.name && curr.name.startsWith("Rickshaw_")) {
        const part = partByModelObject[curr.name];
        if (part) {
          onHoverPart(part.id);
          document.body.style.cursor = "pointer";
          return;
        }
      }
      curr = curr.parent;
    }
  };

  const handlePointerOut = () => {
    onHoverPart(null);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    let curr: THREE.Object3D | null = e.object;
    while (curr && curr !== clonedScene) {
      if (curr.name && curr.name.startsWith("Rickshaw_")) {
        const part = partByModelObject[curr.name];
        if (part) {
          onSelectPart(part);
          return;
        }
      }
      curr = curr.parent;
    }
  };

  return (
    <group position={[0, 0, 0]}>
      <primitive
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {showPins &&
        explodedPartsData.map((part) => {
          const obj = groupsMap[part.modelObject];
          if (!obj) return null;

          const isSelected = selectedPartId === part.id;

          return (
            <group
              key={part.id}
              position={[
                part.annotationPosition[0] + part.explosionVector[0] * progressRef.current,
                part.annotationPosition[1] + part.explosionVector[1] * progressRef.current,
                part.annotationPosition[2] + part.explosionVector[2] * progressRef.current,
              ]}
            >
              <Html distanceFactor={5} center zIndexRange={[100, 0]}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const p = partById[part.id];
                    if (p) onSelectPart(p);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-elevated cursor-pointer transform hover:scale-110 active:scale-95 ${
                    isSelected
                      ? "bg-brand-red text-white ring-2 ring-brand-red/50 scale-105"
                      : "bg-white/95 text-brand-charcoal hover:bg-brand-cream border border-brand-border"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-white" : "bg-brand-red"
                    }`}
                  />
                  <span>{isHindi ? part.nameHi.split(" ")[0] : part.name.split(" ")[0]}</span>
                </button>
              </Html>
            </group>
          );
        })}
    </group>
  );
}

useGLTF.preload("/models/balaji-rickshaw.glb");

function ShowroomPlatform({ platformY = -0.875 }: { platformY?: number }) {
  return (
    <group position={[0, platformY, 0]}>
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[2.3, 2.4, 0.08, 64]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <shadowMaterial opacity={0.25} />
      </mesh>
    </group>
  );
}

function ViewerLoadingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-warmWhite/85 backdrop-blur-xs z-10 space-y-3">
      <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
      <div className="text-xs font-black uppercase tracking-wideUpper text-brand-charcoal">
        Loading 3D Product Architecture...
      </div>
    </div>
  );
}

export default function ExplodedView({
  vehicleName = "Sargam Victor Passenger E-Rickshaw",
  defaultAssembledImage = "/images/rickshaw-red.webp",
}: ExplodedViewProps) {
  const { isHindi } = useLanguage();
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPart, setSelectedPart] = useState<VehiclePart | null>(null);
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const toggleExploded = () => {
    setIsExploded((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedPart(null);
      }
      return next;
    });
  };

  const handleReset = () => {
    setIsExploded(false);
    setSelectedPart(null);
    setHoveredPartId(null);
    setIsAutoRotate(false);
    setResetTrigger((prev) => prev + 1);
  };

  const fallbackView = (
    <div className="relative w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative w-full max-w-[420px] h-[240px]">
        <Image
          src={defaultAssembledImage}
          alt={vehicleName}
          fill
          className="object-contain"
        />
      </div>
      <p className="text-xs text-brand-muted max-w-sm">
        Interactive 3D preview is currently unavailable on this device. You can still inspect verified specifications below.
      </p>
    </div>
  );

  return (
    <section className="relative w-full bg-gradient-to-b from-brand-warmWhite via-brand-cream/70 to-brand-warmWhite border border-brand-border rounded-lg overflow-hidden p-4 sm:p-8 lg:p-10 shadow-card">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-brand-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-bold uppercase tracking-wideUpper text-brand-red mb-2 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-brand-red" />
            <span>{isHindi ? "वास्तविक 3D पुर्जे एक्सप्लोरर" : "Real 3D Product Architecture"}</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
            {isHindi ? "ई-रिक्शा की 3D बनावट व आंतरिक पुर्जे" : "Interactive 3D Exploded Architecture"}
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl leading-relaxed">
            {isHindi
              ? "गाड़ी को 3D में घुमाकर, ज़ूम करके देखें। 'पुर्जे अलग करें' पर क्लिक करने पर वास्तविक 3D पार्ट्स अलग होते हैं। किसी भी हिस्से पर टैप करके विवरण जानें।"
              : "Rotate, zoom, and inspect the commercial e-rickshaw in real 3D space. Click 'Explore Parts' to mechanically separate genuine sub-assemblies along physical vectors."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleExploded}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm cursor-pointer ${
              isExploded
                ? "bg-brand-charcoal text-white hover:bg-brand-charcoalSoft"
                : "bg-brand-red text-white hover:bg-brand-darkRed"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              {isExploded
                ? isHindi
                  ? "गाड़ी जोड़ें (Assemble)"
                  : "Assemble Vehicle"
                : isHindi
                ? "पुर्जे अलग करें (Explore Parts)"
                : "Explore Parts"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded border text-xs font-bold uppercase tracking-wider transition-colors active:scale-[0.98] shadow-xs cursor-pointer ${
              isAutoRotate
                ? "bg-brand-red text-white border-brand-red"
                : "bg-white hover:bg-brand-cream border-brand-border text-brand-charcoal"
            }`}
            title="Toggle Auto Rotation"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isHindi ? "ऑटो घुमाव" : "Auto Rotate"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-colors active:scale-[0.98] shadow-xs cursor-pointer"
            title="Reset 3D View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isHindi ? "रीसेट" : "Reset"}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-5 sm:mb-6 pb-2 overflow-x-auto no-scrollbar max-w-full">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-muted mr-1 shrink-0">
          {isHindi ? "पुर्जे चुनें:" : "Select Module:"}
        </span>
        {explodedPartsData.map((part) => {
          const isSelected = selectedPart?.id === part.id;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => {
                setIsExploded(true);
                setSelectedPart(part);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-brand-red text-white shadow-xs"
                  : "bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal"
              }`}
            >
              {isHindi ? part.nameHi : part.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-8 relative h-[340px] sm:h-[480px] lg:h-[620px] w-full bg-gradient-to-b from-white via-brand-warmWhite to-brand-cream/40 border border-brand-border rounded-lg overflow-hidden shadow-card">
          <div className="absolute inset-0 w-full h-full">
            <ThreeErrorBoundary fallback={fallbackView}>
              <Suspense fallback={<ViewerLoadingOverlay />}>
                <Canvas
                  shadows
                  camera={{ position: [2.1, 0.95, 2.3], fov: 40 }}
                  dpr={[1, 2]}
                  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                >
                  <ambientLight color="#FFF9F0" intensity={1.1} />
                  <hemisphereLight args={["#FFFFFF", "#64748B", 0.9]} />
                  <directionalLight
                    position={[4.5, 6.5, 4.5]}
                    intensity={2.5}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-bias={-0.0001}
                  />
                  <directionalLight position={[-4.5, 3.5, -2.5]} intensity={1.2} color="#E2E8F0" />
                  <directionalLight position={[0, 5.5, -5.5]} intensity={1.6} color="#FFFBEB" />
                  <directionalLight position={[0, 1.8, 3.8]} intensity={0.8} color="#FFFDF8" />

                  <ShowroomPlatform platformY={-0.870} />

                  <ExplodedRickshawModel
                    isExploded={isExploded}
                    selectedPartId={selectedPart?.id || null}
                    hoveredPartId={hoveredPartId}
                    isHindi={isHindi}
                    onSelectPart={(p) => {
                      setIsExploded(true);
                      setSelectedPart(p);
                    }}
                    onHoverPart={setHoveredPartId}
                  />

                  <CameraController
                    isExploded={isExploded}
                    isAutoRotate={isAutoRotate}
                    resetTrigger={resetTrigger}
                  />
                </Canvas>
              </Suspense>
            </ThreeErrorBoundary>
          </div>

          <div className="absolute bottom-3 left-3 pointer-events-none z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-white/95 backdrop-blur-sm border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-muted shadow-xs">
              3D Drag to Orbit • Scroll to Zoom
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-start space-y-4">
          {selectedPart ? (
            <div className="bg-white border border-brand-border rounded-lg p-6 space-y-4 shadow-elevated animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="flex items-start justify-between gap-3 border-b border-brand-border pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wideUpper text-brand-red">
                    {isHindi ? "मॉड्यूल विवरण" : "MODULE SPECIFICATION"}
                  </span>
                  <h4 className="text-lg font-black text-brand-charcoal mt-0.5">
                    {isHindi ? selectedPart.nameHi : selectedPart.name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPart(null)}
                  className="p-1 rounded bg-brand-cream hover:bg-brand-border text-brand-charcoal transition-colors cursor-pointer"
                  aria-label="Close part details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                  {isHindi ? "मुख्य कार्य" : "Core Function"}
                </span>
                <p className="text-xs text-brand-charcoal font-medium leading-relaxed">
                  {isHindi ? selectedPart.functionTextHi : selectedPart.functionText}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                  {isHindi ? "विस्तृत विवरण" : "Technical Details"}
                </span>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {isHindi ? selectedPart.descriptionHi : selectedPart.description}
                </p>
              </div>

              <div className="p-3 rounded bg-brand-cream border border-brand-border space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-charcoal">
                  <ShieldCheck className="w-4 h-4 text-brand-red flex-shrink-0" />
                  <span>{isHindi ? "वारंटी दिशानिर्देश" : "Warranty Guidelines"}</span>
                </div>
                <p className="text-[11px] text-brand-muted leading-relaxed pl-5">
                  {isHindi ? selectedPart.warrantyHi : selectedPart.warranty}
                </p>
              </div>

              <div className="p-3 rounded bg-brand-warmWhite border border-brand-border space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-charcoal">
                  <Wrench className="w-4 h-4 text-brand-red flex-shrink-0" />
                  <span>{isHindi ? "सर्विस व मेंटेनेंस सुझाव" : "Service & Maintenance Check"}</span>
                </div>
                <p className="text-[11px] text-brand-muted leading-relaxed pl-5">
                  {isHindi ? selectedPart.serviceNotesHi : selectedPart.serviceNotes}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-brand-red pl-5 pt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>
                    {isHindi
                      ? `अनुशंसित जांच: ${selectedPart.recommendedCheckHi}`
                      : `Recommended Check: ${selectedPart.recommendedCheck}`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-brand-border rounded-lg p-6 text-center space-y-4 shadow-card">
              <div className="w-12 h-12 rounded-full bg-brand-cream border border-brand-border flex items-center justify-center mx-auto text-brand-red">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-brand-charcoal">
                {isHindi ? "किसी भी पुर्जे को चुनें" : "Select Any Module to Inspect"}
              </h4>
              <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                {isHindi
                  ? "बैटरी, मोटर, चेसिस, रूफ या फ्रंट असेंबली को 3D में छूकर उसकी कार्यप्रणाली और सर्विस नोट्स देखें।"
                  : "Click 'Explore Parts' and tap on any 3D component or selection pill to open certified technical notes, inspection intervals, and warranty terms."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsExploded(true);
                  const battPart = explodedPartsData.find((p) => p.id === "battery") || explodedPartsData[0];
                  setSelectedPart(battPart);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-brand-cream hover:bg-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-brand-red" />
                <span>{isHindi ? "बैटरी कम्पार्टमेंट देखें" : "Inspect Battery System"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
