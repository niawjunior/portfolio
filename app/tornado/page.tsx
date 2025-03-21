"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

const Tornado = () => {
  const mouseIntensity = useRef(1);
  const tornadoPosition = useRef({ x: 0, z: 0 });

  // Handle mouse movement to affect tornado intensity and direction
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(mouseIntensity, {
        current: 1 + Math.abs(x) + Math.abs(y),
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(tornadoPosition.current, {
        x: x * 5,
        z: y * 5,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="h-screen w-screen bg-gradient-to-b from-black via-[#090a1a] to-black flex items-center justify-center">
      <Canvas camera={{ position: [0, 12, 18], fov: 50 }} gl={{ alpha: true }}>
        {/* Fog for Depth Effect */}
        <fog attach="fog" args={["#0a0f2c", 10, 30]} />

        {/* Dynamic Ambient Lighting */}
        <ambientLight intensity={0.4} />

        {/* Point Light Adjustments for Flickering Effect */}
        <pointLight
          position={[5, 20, 5]}
          intensity={Math.random() > 0.97 ? 2 : 1.2} // Flickering
          color="white"
        />

        <TornadoParticles
          mouseIntensity={mouseIntensity}
          tornadoPosition={tornadoPosition}
        />
      </Canvas>
    </main>
  );
};

/* 🌪️ Tornado Particles with Realistic Swirling Effect */
const TornadoParticles = ({
  mouseIntensity,
  tornadoPosition,
}: {
  mouseIntensity: any;
  tornadoPosition: any;
}) => {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate particles in a realistic vortex shape
  const particles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 12;
      const baseRadius = 0.5 + (height / 12) * 3;

      // More concentrated particles at the base, wider at the top
      const radius = baseRadius * (0.7 + Math.random() * 0.3);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  // Animate tornado movement & swirling effect
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const time = clock.elapsedTime * 1.5;

      for (let i = 0; i < positions.length; i += 3) {
        const radius = Math.sqrt(positions[i] ** 2 + positions[i + 2] ** 2);

        // Swirling effect with vertical lift
        const angle =
          Math.atan2(positions[i + 2], positions[i]) +
          0.02 * mouseIntensity.current;
        positions[i] = Math.cos(angle) * radius;
        positions[i + 2] = Math.sin(angle) * radius;
        positions[i + 1] += Math.sin(time + radius * 5) * 0.02;

        // Reset particles when they reach the top
        if (positions[i + 1] > 12) positions[i + 1] = 0;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;

      // Move the entire tornado smoothly
      particlesRef.current.position.x +=
        (tornadoPosition.current.x - particlesRef.current.position.x) * 0.02;
      particlesRef.current.position.z +=
        (tornadoPosition.current.z - particlesRef.current.position.z) * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="cyan" transparent opacity={0.8} />
    </points>
  );
};

export default Tornado;
