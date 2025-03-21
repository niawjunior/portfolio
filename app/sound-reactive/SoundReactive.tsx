"use client";

import { useRef, useState } from "react";
import * as THREE from "three";

const SoundVisualizer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<THREE.Mesh[]>([]); // Store bar references
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const startAudio = async () => {
    try {
      const context = new AudioContext();
      setAudioContext(context);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 128; // Lower FFT size for better performance

      source.connect(analyser);

      if (!mountRef.current) return;

      // THREE Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Bars setup
      const barCount = analyser.frequencyBinCount;
      barsRef.current = [];
      const material = new THREE.MeshStandardMaterial({ color: "cyan" });

      for (let i = 0; i < barCount; i++) {
        const geometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
        const bar = new THREE.Mesh(geometry, material.clone());
        bar.position.x = (i - barCount / 2) * 0.35;
        scene.add(bar);
        barsRef.current.push(bar);
      }
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Lights
      const light = new THREE.PointLight(0xffffff, 0.1);
      light.position.set(0, 10, 10);
      scene.add(light);

      camera.position.z = 10;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        analyser.getByteFrequencyData(dataArray);

        barsRef.current.forEach((bar, i) => {
          const value = dataArray[i] / 255;
          const scale = Math.max(value * 5, 0.2);
          bar.scale.y = scale;
          (bar.material as THREE.MeshStandardMaterial).color.setHSL(
            0.6 - scale * 0.2,
            1,
            0.5
          );
        });

        renderer.render(scene, camera);
      };

      animate();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {!audioContext && (
        <button
          onClick={startAudio}
          className="absolute px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md"
        >
          Enable Microphone
        </button>
      )}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default SoundVisualizer;
