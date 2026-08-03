"use client";

import { motion } from "framer-motion";

export default function HeroOverlay() {
  return (
    <motion.div
      initial={{
        opacity:0,
        y:30
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        duration:1
      }}
      className="
      absolute
      left-6
      top-1/2
      z-20
      -translate-y-1/2
      max-w-xl
      lg:left-20
      "
    >

      <h1
      className="
      text-5xl
      font-black
      leading-tight
      text-emerald-900
      lg:text-7xl
      "
      >
        أمتي تقرأ
      </h1>


      <p
      className="
      mt-6
      text-lg
      leading-8
      text-gray-600
      lg:text-xl
      "
      >
        تجربة قراءة وتعليم حديثة
        تجمع بين المعرفة والتقنية
        في واجهة تفاعلية.
      </p>


      <button
      className="
      mt-8
      rounded-full
      bg-emerald-700
      px-10
      py-4
      font-bold
      text-white
      shadow-xl
      transition
      hover:scale-105
      "
      >
        ابدأ الآن
      </button>

    </motion.div>
  );
}