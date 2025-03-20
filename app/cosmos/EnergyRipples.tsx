import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Torus, Stars } from "@react-three/drei";

/* ✨ Black Hole Effect */
const BlackHole = () => {
  const blackHoleRef = useRef<any>(null);
  const accretionDiskRef = useRef<any>(null);

  useFrame(() => {
    if (blackHoleRef.current) {
      blackHoleRef.current.rotation.z += 0.005; // Slow rotation
    }
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.y += 0.01; // Faster spinning
    }
  });

  return (
    <>
      {/* 🌌 Background Stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={6}
        saturation={0}
        fade
      />

      {/* 🌀 Black Hole Core */}
      <Torus ref={blackHoleRef} args={[1, 0.4, 16, 100]} position={[0, 0, -3]}>
        <meshStandardMaterial
          color="black"
          roughness={0}
          metalness={1}
          emissive="black"
        />
      </Torus>

      {/* 🔥 Accretion Disk (Glowing Energy Around Black Hole) */}
      <Torus
        ref={accretionDiskRef}
        args={[1.5, 0.1, 32, 200]}
        position={[0, 0, -3]}
      >
        <meshStandardMaterial
          color="cyan"
          emissive="cyan"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.9}
        />
      </Torus>

      {/* ✨ Light Warp Effect Around Black Hole */}
      <Torus args={[2.5, 0.05, 32, 200]} position={[0, 0, -3]}>
        <meshStandardMaterial
          color="cyan"
          transparent
          opacity={1}
          roughness={0}
          metalness={1}
          emissive="white"
          emissiveIntensity={1.2}
        />
      </Torus>
    </>
  );
};

export default BlackHole;
