"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Points } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// 🐉 Dragon Hologram Component
const DragonHologram = () => {
  const { scene } = useGLTF("/models/dragon_rigged.glb");
  const dragonRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (dragonRef.current) {
      dragonRef.current.rotation.y = t * 0.5;

      // Hologram flickering effect
      dragonRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = 0.8 + Math.sin(t * 5) * 0.1;
        }
      });
    }
  });

  return (
    <primitive
      object={scene}
      ref={dragonRef}
      scale={1.5}
      position={[0, -1, 0]}
      onUpdate={(self: THREE.Group) => {
        self.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color("cyan"),
              emissive: new THREE.Color("cyan"),
              transparent: true,
              opacity: 0.8,
              wireframe: true,
              roughness: 0.2,
              metalness: 0.9,
            });
          }
        });
      }}
    />
  );
};

// 🌀 Floating Particles for Hologram Atmosphere
const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    console.log(clock);
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005; // Slow rotation
    }
  });

  return (
    <Points ref={pointsRef} limit={200} range={5}>
      <sphereGeometry args={[5, 32, 32]} />
      <pointsMaterial size={0.05} color="cyan" transparent opacity={0.6} />
    </Points>
  );
};

// ⚡ Sci-Fi Grid Floor for Depth Effect
const GridFloor = () => {
  return (
    <gridHelper
      args={[20, 40, "cyan", "cyan"]}
      position={[0, -2, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

// 🌌 Hologram Scene
export default function HologramScene() {
  return (
    <main className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 50 }}
        className="w-full h-full"
      >
        {/* Ambient Scene Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <fog attach="fog" args={["#000", 5, 15]} />

        {/* Hologram Elements */}
        <DragonHologram />
        <FloatingParticles />
        <GridFloor />

        <OrbitControls />
      </Canvas>
    </main>
  );
}
