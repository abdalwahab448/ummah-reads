"use client";

import { motion } from "framer-motion";

export default function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <motion.div
        animate={{
          opacity: [0.25, 0.55, 0.25],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[58%] top-[18%] h-[700px] w-[240px] rotate-[25deg] rounded-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/20 to-transparent blur-[90px]"
      />

      <motion.div
        animate={{
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="absolute left-[48%] top-[12%] h-[600px] w-[120px] rotate-[18deg] rounded-full bg-yellow-100/40 blur-[80px]"
      />

    </div>
  );
}