"use client";

import { Environment } from "@react-three/drei";

export default function CinematicLighting() {

  return (
    <>

      {/* ضوء أساسي ناعم */}
      <ambientLight intensity={1.2} />

      {/* ضوء رئيسي */}
      <directionalLight
        position={[3,5,2]}
        intensity={2.5}
        castShadow
      />

      {/* ضوء أخضر خفيف */}
      <pointLight
        position={[-2,1,1]}
        intensity={1.5}
        color="#86efac"
        distance={5}
      />

      {/* ضوء دافئ مثل المصباح */}
      <pointLight
        position={[2,2,-1]}
        intensity={1}
        color="#fde68a"
        distance={4}
      />

      <Environment preset="studio" />

    </>
  );
}
