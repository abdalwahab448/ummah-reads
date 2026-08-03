"use client";

import { useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function ScrollScene() {

  const { scrollYProgress } = useScroll();

  const cameraMove = useTransform(
    scrollYProgress,
    [0, 1],
    [7, 3]
  );


  useEffect(() => {

    const handleScroll = () => {

      const value =
        window.scrollY /
        (document.body.scrollHeight - window.innerHeight);

      const z =
        7 - value * 4;

      window.dispatchEvent(
        new CustomEvent(
          "cameraMove",
          {
            detail: z
          }
        )
      );

    };


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);


  return null;
}