"use client";

import { Float } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function Leaves3D() {

  const leaves = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 6,
        Math.random() * 3,
        (Math.random() - 0.5) * 3
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.15
    }));
  }, []);


  return (
    <>

      {leaves.map((leaf) => (

        <Float
          key={leaf.id}
          speed={2}
          rotationIntensity={2}
          floatIntensity={1}
        >

          <mesh
            position={leaf.position}
            scale={leaf.scale}
            rotation={[
              Math.random(),
              Math.random(),
              Math.random()
            ]}
          >

            <planeGeometry args={[1,1]} />

            <meshStandardMaterial
              color="#4d8f5a"
              side={THREE.DoubleSide}
              transparent
            />

          </mesh>

        </Float>

      ))}

    </>
  );
}