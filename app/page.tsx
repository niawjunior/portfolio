"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const projects = [
  {
    name: "Cosmos",
    path: "/cosmos",
    description: "Explore the vast universe.",
  },
  {
    name: "Golf Physics Simulator",
    path: "/golf-physics-simulator",
    description: "Realistic golf physics with motion tracking.",
  },
  {
    name: "Tornado",
    path: "/tornado",
    description: "A website with a tornado effect.",
  },
];

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* 🌌 Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-3xl" />

      {/* 🌟 Title */}
      <motion.h1
        className="text-5xl md:text-7xl font-bold text-cyan-400 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome to My Projects 🚀
      </motion.h1>

      {/* 📌 Project Cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Link key={project.path} href={project.path}>
            <motion.div
              className="relative p-6 w-80 md:w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-white">{project.name}</h2>
              <p className="text-gray-300 mt-2">{project.description}</p>
              <motion.div
                className="absolute -top-5 -left-5 w-10 h-10 bg-cyan-400/40 blur-3xl rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </Link>
        ))}
      </div>
    </main>
  );
}
