"use client";

import { motion } from "framer-motion";

export default function DustParticles() {

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {Array.from({ length: 45 }).map((_, i) => (

        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, -70],
            x: [-8, 8, -8],
            opacity: [0, .9, 0],
            scale: [.6, 1.3, .6],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />

      ))}

    </div>
  );

}