"use client";

import React, { useRef, useMemo, Component, ErrorInfo, ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

interface RickshawModelProps {
  bodyColor?: string;
  category?: "Passenger" | "Cargo / Loader";
  interactive?: boolean;
}

class GlbErrorBoundary extends Component<
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

function GlbVehicle({ bodyColor = "#C9232A" }: { bodyColor: string }) {
  const { scene } = useGLTF("/models/balaji-rickshaw.glb");
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.2 / maxDim;
    c.scale.set(scale, scale, scale);
    c.position.x = -center.x * scale;
    c.position.z = -center.z * scale;
    c.position.y = -box.min.y * scale - 0.75;

    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (
          mesh.name.toLowerCase().includes("body") ||
          mesh.name.toLowerCase().includes("paint") ||
          mesh.name.toLowerCase().includes("hood") ||
          mesh.name.toLowerCase().includes("canopy")
        ) {
          if (mesh.material) {
            const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
            mat.color = new THREE.Color(bodyColor);
            mesh.material = mat;
          }
        }
      }
    });
    return c;
  }, [scene, bodyColor]);

  return <primitive object={cloned} />;
}

export function ProceduralRickshaw({
  bodyColor = "#C9232A",
  category = "Passenger",
  interactive = true,
}: RickshawModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!interactive || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.012;
  });

  return (
    <group ref={groupRef} dispose={null} position={[0, -0.75, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.92, 0.08, 2.4]} />
        <meshStandardMaterial color="#2B2D30" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[0.72, 0.06, 2.5]} />
        <meshStandardMaterial color="#1C1E20" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.5, 0.1]}>
        <boxGeometry args={[0.88, 0.02, 2.1]} />
        <meshStandardMaterial color="#242628" roughness={0.9} />
      </mesh>

      <group position={[0, 0.42, 1.25]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
          <meshStandardMaterial color="#A0A8B0" metalness={0.9} roughness={0.15} />
        </mesh>

        <mesh position={[-0.12, 0.15, 0]} rotation={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.022, 0.022, 0.55, 16]} />
          <meshStandardMaterial color="#D0D5DD" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.12, 0.15, 0]} rotation={[0, 0, -0.05]}>
          <cylinderGeometry args={[0.022, 0.022, 0.55, 16]} />
          <meshStandardMaterial color="#D0D5DD" metalness={0.95} roughness={0.1} />
        </mesh>

        <mesh position={[0, 0.78, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.65, 16]} />
          <meshStandardMaterial color="#33383F" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[-0.3, 0.78, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.1, 16]} />
          <meshStandardMaterial color="#1A1C1E" roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 0.78, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.1, 16]} />
          <meshStandardMaterial color="#1A1C1E" roughness={0.9} />
        </mesh>

        <mesh position={[0, 0.82, -0.04]}>
          <boxGeometry args={[0.14, 0.08, 0.05]} />
          <meshStandardMaterial color="#1E2228" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.825, -0.014]}>
          <planeGeometry args={[0.11, 0.05]} />
          <meshBasicMaterial color="#C9232A" />
        </mesh>

        <group position={[0, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.1, 32]} />
            <meshStandardMaterial color="#1E2022" roughness={0.88} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.105, 24]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.13, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.16, 0.02]}>
            <boxGeometry args={[0.16, 0.25, 0.32]} />
            <meshStandardMaterial color={bodyColor} metalness={0.65} roughness={0.25} />
          </mesh>
        </group>
      </group>

      <group position={[0, 0.42, -0.75]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.15, 16]} />
          <meshStandardMaterial color="#2B3037" metalness={0.9} roughness={0.2} />
        </mesh>

        <group position={[-0.55, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.11, 32]} />
            <meshStandardMaterial color="#1E2022" roughness={0.88} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.115, 24]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        <group position={[0.55, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.11, 32]} />
            <meshStandardMaterial color="#1E2022" roughness={0.88} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.115, 24]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        <mesh position={[-0.55, 0.18, 0]}>
          <boxGeometry args={[0.16, 0.18, 0.58]} />
          <meshStandardMaterial color={bodyColor} metalness={0.65} roughness={0.25} />
        </mesh>
        <mesh position={[0.55, 0.18, 0]}>
          <boxGeometry args={[0.16, 0.18, 0.58]} />
          <meshStandardMaterial color={bodyColor} metalness={0.65} roughness={0.25} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.26, 16]} />
          <meshStandardMaterial color="#151719" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0, 0.78, 1.05]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.82, 0.52, 0.15]} />
          <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.22, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFF8E7" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
        <mesh position={[-0.32, 0.18, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          <meshStandardMaterial color="#F2C94C" emissive="#F2C94C" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.32, 0.18, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          <meshStandardMaterial color="#F2C94C" emissive="#F2C94C" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, -0.22, 0.06]}>
          <boxGeometry args={[0.88, 0.06, 0.06]} />
          <meshStandardMaterial color="#2B3037" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0, 0.72, 0.6]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.48, 0.12, 0.38]} />
          <meshStandardMaterial color="#23262A" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.24, -0.16]}>
          <boxGeometry args={[0.44, 0.36, 0.08]} />
          <meshStandardMaterial color="#23262A" roughness={0.8} />
        </mesh>
      </group>

      <group position={[0, 0.58, -0.1]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.65, 0.22, 0.45]} />
          <meshStandardMaterial color="#1E232A" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.3, 0.04, 0.15]} />
          <meshStandardMaterial color="#C9232A" roughness={0.4} />
        </mesh>
      </group>

      {category === "Passenger" ? (
        <group position={[0, 0.8, -0.45]}>
          <mesh position={[0, 0, 0.18]}>
            <boxGeometry args={[0.86, 0.14, 0.42]} />
            <meshStandardMaterial color="#23272C" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.28, 0.36]}>
            <boxGeometry args={[0.84, 0.42, 0.08]} />
            <meshStandardMaterial color="#23272C" roughness={0.8} />
          </mesh>

          <mesh position={[0, 0, -0.42]}>
            <boxGeometry args={[0.86, 0.14, 0.42]} />
            <meshStandardMaterial color="#23272C" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.28, -0.6]}>
            <boxGeometry args={[0.84, 0.42, 0.08]} />
            <meshStandardMaterial color="#23272C" roughness={0.8} />
          </mesh>

          <mesh position={[-0.44, 0.15, -0.1]}>
            <boxGeometry args={[0.02, 0.4, 1.25]} />
            <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0.44, 0.15, -0.1]}>
            <boxGeometry args={[0.02, 0.4, 1.25]} />
            <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.25, -0.74]}>
            <boxGeometry args={[0.88, 0.6, 0.03]} />
            <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0.88, -0.45]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.96, 0.08, 1.4]} />
            <meshStandardMaterial color="#282C32" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.46, 0.25, 0]}>
            <boxGeometry args={[0.04, 0.45, 1.4]} />
            <meshStandardMaterial color={bodyColor} metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0.46, 0.25, 0]}>
            <boxGeometry args={[0.04, 0.45, 1.4]} />
            <meshStandardMaterial color={bodyColor} metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.25, -0.68]}>
            <boxGeometry args={[0.96, 0.45, 0.04]} />
            <meshStandardMaterial color={bodyColor} metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.25, 0.68]}>
            <boxGeometry args={[0.96, 0.45, 0.04]} />
            <meshStandardMaterial color={bodyColor} metalness={0.75} roughness={0.25} />
          </mesh>
        </group>
      )}

      <group position={[0, 1.35, 0.2]}>
        <mesh position={[-0.43, 0, 0.75]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.43, 0, 0.75]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[-0.43, 0, -0.95]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.43, 0, -0.95]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.7, -0.1]}>
          <boxGeometry args={[0.94, 0.05, 2.2]} />
          <meshStandardMaterial color="#1E2228" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.74, -0.1]}>
          <boxGeometry args={[0.9, 0.03, 2.15]} />
          <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
        </mesh>
      </group>

      <group position={[0, 1.38, 0.9]}>
        <mesh position={[0, 0, 0]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.8, 0.62, 0.02]} />
          <meshPhysicalMaterial
            color="#C8DCF0"
            transparent
            opacity={0.4}
            roughness={0.1}
            transmission={0.85}
            ior={1.5}
            reflectivity={0.9}
          />
        </mesh>
      </group>

      <mesh position={[-0.46, 1.4, 0.85]}>
        <boxGeometry args={[0.08, 0.12, 0.02]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.46, 1.4, 0.85]}>
        <boxGeometry args={[0.08, 0.12, 0.02]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>

      <group position={[0, 0.8, -1.2]}>
        <mesh position={[-0.34, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
          <meshStandardMaterial color="#C9232A" emissive="#C9232A" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.34, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
          <meshStandardMaterial color="#C9232A" emissive="#C9232A" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export function RickshawModel(props: RickshawModelProps) {
  const fallback = <ProceduralRickshaw {...props} />;
  return (
    <GlbErrorBoundary fallback={fallback}>
      <GlbVehicle bodyColor={props.bodyColor || "#C9232A"} />
    </GlbErrorBoundary>
  );
}