"use client";

import { Html, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

export default function SceneLoader() {

  const { progress } = useProgress();

  return (
    <Html
      center
    >

      <motion.div
        initial={{
          opacity:0,
          scale:.8
        }}
        animate={{
          opacity:1,
          scale:1
        }}
        className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        bg-white/80
        px-10
        py-8
        shadow-2xl
        backdrop-blur-xl
        "
      >

        <div className="text-4xl font-black text-emerald-800">
          {Math.round(progress)}%
        </div>

        <div className="mt-3 text-sm text-gray-600">
          جاري تجهيز التجربة...
        </div>

      </motion.div>

    </Html>
  );
}