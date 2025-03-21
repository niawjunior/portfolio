"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";

export default function Home() {
  const [forcePower, setForcePower] = useState(20);
  const [objectWeight, setObjectWeight] = useState(2);
  const ballRef = useRef<any>(null);
  const clubRef = useRef<any>(null);

  const applyForce = () => {
    if (ballRef.current && clubRef.current) {
      // Reset physics before hitting
      ballRef.current.setTranslation({ x: 0, y: 0.5, z: -3 }, true);
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      // Animate club swing (rotating forward to hit)
      clubRef.current.rotation.x = -Math.PI / 4; // Start position
      setTimeout(() => {
        clubRef.current.rotation.x = 0; // Swing forward
      }, 200);

      // Apply force on impact (small delay for realism)
      setTimeout(() => {
        ballRef.current.applyImpulse(
          {
            x: 0,
            y: forcePower / objectWeight, // Launch upwards
            z: -(forcePower / objectWeight) * 1.5, // Forward movement
          },
          true
        );

        // Apply small angular spin for rolling
        ballRef.current.applyTorqueImpulse({ x: 2, y: 0, z: 0 }, true);
      }, 300);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 mt-6">
        Realistic Golf Physics Simulator ⛳
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
          Swing Golf Club 🏌️‍♂️
        </button>
      </div>

      {/* 🎥 3D Scene */}
      <Canvas className="w-full h-[70vh] bg-black rounded-lg">
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 10, 5]} intensity={1} />
        <Environment preset="forest" />

        <Physics>
          {/* 🏌️‍♂️ Extended Golf Course */}
          <RigidBody type="fixed">
            <mesh position={[0, -2, 0]}>
              <boxGeometry args={[200, 0.2, 500]} /> {/* Very long ground */}
              <meshStandardMaterial color="green" />
            </mesh>
          </RigidBody>

          {/* Ball Component */}
          <Ball ballRef={ballRef} />

          {/* Golf Club Swing */}
          <GolfClub clubRef={clubRef} />

          {/* 🎥 Smart Camera (Only Follows When Needed) */}
          <FixedStartCamera targetRef={ballRef} />
        </Physics>

        <OrbitControls />
      </Canvas>
    </main>
  );
}

/* 🎾 Ball Component */
const Ball = ({ ballRef }: any) => {
  return (
    <RigidBody ref={ballRef} mass={2} restitution={0.3} friction={0.6}>
      <mesh position={[0, 0.5, -3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
};

/* 🏌️‍♂️ Golf Club (Swings Forward on Click) */
const GolfClub = ({ clubRef }: any) => {
  return (
    <group ref={clubRef} position={[0, 1, -3.5]} rotation={[0, 0, 0]}>
      {/* Shaft */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 16]} />
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Grip (Top of the shaft) */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
        <meshStandardMaterial color="black" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Club Head Connector (Neck of the club) */}
      <mesh position={[0, 0.2, 0]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial
          color="darkgray"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Club Head (Properly Connected & Oriented) */}
      <mesh position={[0, 0.0, 0.2]} rotation={[Math.PI / 2.5, 0, 0]}>
        <boxGeometry args={[0.25, 0.6, 0.15]} />
        <meshStandardMaterial color="darkgray" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
};

/* 🎥 Smart Camera (Starts Fixed, Then Moves) */
const FixedStartCamera = ({ targetRef }: any) => {
  const { camera } = useThree();
  const isFollowing = useRef(false);

  useFrame(() => {
    if (targetRef.current) {
      const pos = targetRef.current.translation();

      // Start following when ball moves far enough
      if (Math.abs(pos.z) > 15 || Math.abs(pos.x) > 5) {
        isFollowing.current = true;
      }

      // Smooth follow camera effect
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
