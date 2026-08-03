"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function BookPagesAnimation() {

  const pages = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {

    if (!pages.current) return;

    const t = clock.getElapsedTime();

    // حركة فتح وإغلاق خفيفة للكتاب
    pages.current.rotation.y =
      Math.sin(t * 0.8) * 0.08;

  });


  return (

    <group ref={pages}>

      {Array.from({ length: 6 }).map((_, i) => (

        <mesh
          key={i}
          position={[
            i * 0.01,
            0.01 * i,
            0
          ]}
          rotation={[
            0,
            -0.05 * i,
            0
          ]}
        >

          <planeGeometry
            args={[1.8,2.4]}
          />

          <meshStandardMaterial
            color="#fffdf7"
            side={THREE.DoubleSide}
          />

        </mesh>

      ))}

    </group>

  );

}