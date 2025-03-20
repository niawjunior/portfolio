"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";

export default function Home() {
  const [forcePower, setForcePower] = useState(12);
  const [objectWeight, setObjectWeight] = useState(2);
  const ballRef = useRef<any>(null);

  const applyForce = () => {
    if (ballRef.current) {
      // Reset position and velocity before applying force
      ballRef.current.setTranslation({ x: 0, y: 2, z: 0 }, true);
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      // Apply realistic golf curve impulse (curves up, then falls)
      ballRef.current.applyImpulse(
        {
          x: 0,
          y: forcePower / objectWeight, // Push Up
          z: -(forcePower / objectWeight) * 1.5, // Forward Motion
        },
        true
      );

      // Apply small angular spin (so ball rolls realistically)
      ballRef.current.applyTorqueImpulse({ x: 2, y: 0, z: 0 }, true);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 mt-6">
        Golf Physics Simulator ⛳
      </h1>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm">Force Power</label>
          <input
            type="number"
            value={forcePower}
            onChange={(e) => setForcePower(parseFloat(e.target.value))}
            className="px-4 py-2 text-white border-2 border-gray-300 rounded-lg w-24 bg-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Object Weight</label>
          <input
            type="number"
            value={objectWeight}
            onChange={(e) => setObjectWeight(parseFloat(e.target.value))}
            className="px-4 py-2 text-white border-2 border-gray-300 rounded-lg w-24 bg-transparent"
          />
        </div>

        <button
          onClick={applyForce}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition self-end"
        >
          Swing Golf Ball
        </button>
      </div>

      {/* 🎥 3D Scene */}
      <Canvas className="w-full h-[70vh] bg-black rounded-lg">
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 10, 5]} intensity={1} />
        <Environment preset="forest" />

        <Physics>
          {/* 🏌️‍♂️ Extended Golf-Like Ground */}
          <RigidBody type="fixed">
            <mesh position={[0, -2, 0]}>
              <boxGeometry args={[200, 0.2, 500]} /> {/* VERY LONG GROUND */}
              <meshStandardMaterial color="green" />
            </mesh>
          </RigidBody>

          {/* Ball Component */}
          <Ball ballRef={ballRef} />

          {/* 🎥 Smart Camera (Only Follows When Needed) */}
          <FixedStartCamera targetRef={ballRef} />
        </Physics>

        <OrbitControls />
      </Canvas>
    </main>
  );
}

/* 🎾 Ball Component with Realistic Rolling & Golf Physics */
const Ball = ({ ballRef }: any) => {
  return (
    <RigidBody
      ref={ballRef}
      mass={2}
      restitution={0.3} // Lower bounce for golf-like effect
      friction={0.6} // Increased friction to slow down on grass
    >
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
};

/* 🎥 Smart Camera (Starts Fixed, Then Moves) */
const FixedStartCamera = ({ targetRef }: any) => {
  const { camera } = useThree();
  const isFollowing = useRef(false);

  useFrame(() => {
    if (targetRef.current) {
      const pos = targetRef.current.translation();

      // Start following when the ball moves far enough
      if (Math.abs(pos.z) > 15 || Math.abs(pos.x) > 5) {
        isFollowing.current = true;
      }

      // Only move the camera when needed
      if (isFollowing.current) {
        camera.position.x += (pos.x + 8 - camera.position.x) * 0.02;
        camera.position.y += (pos.y + 5 - camera.position.y) * 0.02;
        camera.position.z += (pos.z + 12 - camera.position.z) * 0.02;
        camera.lookAt(pos.x, pos.y, pos.z);
      }
    }
  });

  return null;
};
