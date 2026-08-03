"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function SceneTransition(){

  const { scrollYProgress } = useScroll();

  const opacity = useTransform(
    scrollYProgress,
    [0,0.4,0.8,1],
    [0,1,1,0]
  );

  const scale = useTransform(
    scrollYProgress,
    [0,0.5,1],
    [1,1.08,1.2]
  );


  return (

    <motion.div

      style={{
        opacity,
        scale
      }}

      className="
      pointer-events-none
      absolute
      inset-0
      z-10
      bg-gradient-to-b
      from-transparent
      via-emerald-100/20
      to-transparent
      "

    />

  );

}