"use client";

import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">

      {/* Base Background */}
      <div className="absolute inset-0 bg-[#F7F3EA]" />

      {/* Top Left Light */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.45, 0.7, 0.45],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        -top-56
        -left-52
        w-[850px]
        h-[850px]
        rounded-full
        bg-emerald-300/30
        blur-[170px]
        "
      />

      {/* Bottom Right */}
      <motion.div
        animate={{
          scale: [1.1, .9, 1.1],
          opacity: [.3,.55,.3]
        }}
        transition={{
          duration:10,
          repeat:Infinity
        }}
        className="
        absolute
        -bottom-60
        -right-44
        w-[760px]
        h-[760px]
        rounded-full
        bg-yellow-300/20
        blur-[180px]
        "
      />

      {/* Center Glow */}
      <motion.div
        animate={{
          opacity:[.2,.45,.2]
        }}
        transition={{
          duration:5,
          repeat:Infinity
        }}
        className="
        absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-[900px]
        h-[500px]
        rounded-full
        bg-white/70
        blur-[120px]
        "
      />

      {/* Noise Layer */}
      <div
        className="
        absolute
        inset-0
        opacity-[0.035]
        bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)]
        [background-size:18px_18px]
        "
      />

    </div>
  );
}
