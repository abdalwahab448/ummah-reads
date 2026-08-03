"use client";

import { Sparkles } from "@react-three/drei";

export default function SceneEffects() {
  return (
    <>
      <Sparkles
        count={120}
        scale={[6, 4, 4]}
        size={2}
        speed={0.25}
        color="#b7e4c7"
      />

      <pointLight
        position={[0,2,1]}
        intensity={2}
        color="#86efac"
        distance={5}
      />

      <pointLight
        position={[-2,1,2]}
        intensity={1}
        color="#fde68a"
        distance={4}
      />
    </>
  );
}