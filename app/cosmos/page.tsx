"use client";

import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { useRef, useState } from "react";
import EnergyRipples from "./EnergyRipples";

export default function Home() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 3;
    const y = (e.clientY / innerHeight - 0.5) * 3;
    setMouseX(x);
    setMouseY(y);
  };

  return (
    <main
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black/10"
      onMouseMove={handleMouseMove}
    >
      {/* 🚀 Three.js Animated Scene */}
      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars
          radius={50}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
        />

        <CameraRig mouseX={mouseX} mouseY={mouseY} />
        <FloatingSphere position={[0, 0, -5]} />
        <EnergyRipples />
      </Canvas>
      {/* 🌟 Hero Section with Text Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 top-[10vh] z-10 text-center "
      >
        <motion.h1 className="text-6xl md:text-8xl font-bold text-cyan-400 drop-shadow-lg">
          Welcome to the Cosmos
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 mt-[400px] tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            background: "linear-gradient(180deg, cyan, transparent)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          A Next-Level 3D Experience from the Edge of the Universe.
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px cyan" }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 mb-20 px-8 py-3 bg-cyan-400 text-black rounded-full font-semibold shadow-md hover:bg-cyan-500 transition text-lg"
        >
          Explore More
        </motion.button>
      </motion.div>

      {/* 🌀 Moving Light Effect */}
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"
        animate={{
          x: mouseX * 4,
          y: mouseY * 4,
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />
    </main>
  );
}

/* 🎥 Dynamic Camera Rig (Moves with Mouse) */
const CameraRig = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
  const { camera } = useThree();

  useFrame(() => {
    // Smoothly move the camera based on the mouse movement
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

/* 🔮 Floating 3D Sphere with Animation */
const FloatingSphere = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const sphereRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.01;
      sphereRef.current.rotation.x += 0.005;
      sphereRef.current.position.y = Math.sin(clock.elapsedTime) * 0.5;
      sphereRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 2) * 0.05;
      sphereRef.current.scale.y = 1 + Math.cos(clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1.5, 64, 64]} position={position}>
      <MeshDistortMaterial
        color="cyan"
        emissive="cyan"
        emissiveIntensity={1}
        roughness={0.1}
        metalness={1}
        clearcoat={1}
        clearcoatRoughness={0.05}
        distort={0.6} // Increased wave-like effect
        speed={3} // Faster distortion movement
      />
    </Sphere>
  );
};
