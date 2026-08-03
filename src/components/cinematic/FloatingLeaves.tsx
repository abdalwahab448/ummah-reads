"use client";

import { motion } from "framer-motion";

const leaves = Array.from({ length: 12 });

export default function FloatingLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-emerald-500/70"
          style={{
            left: `${8 + Math.random() * 84}%`,
            top: `${10 + Math.random() * 70}%`,
            fontSize: `${18 + Math.random() * 18}px`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, 25, -15, 0],
            rotate: [0, 20, -20, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        >
          🍃
        </motion.div>
      ))}
    </div>
  );
}
