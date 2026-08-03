"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 35 });

export default function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const size = 4 + Math.random() * 10;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400/30 blur-sm"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -120],
              opacity: [0, 1, 0],
              x: [0, Math.random() * 40 - 20],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
