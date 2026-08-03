"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { sceneConfig } from "./SceneConfig";

export default function WriterModel() {

  const { scene } = useGLTF(
    "/assets/models/boy.glb"
  );

  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {

    if (!ref.current) return;

    const t = clock.getElapsedTime();

    // حركة تنفس بسيطة
    ref.current.position.y =
      Math.sin(t) * 0.03;

    // حركة خفيفة أثناء الكتابة
    ref.current.rotation.z =
      Math.sin(t * 2) * 0.015;

  });


  return (

    <group
      ref={ref}
      position={sceneConfig.character.position}
      scale={sceneConfig.character.scale}
    >

      <primitive
        object={scene}
      />

    </group>

  );

}