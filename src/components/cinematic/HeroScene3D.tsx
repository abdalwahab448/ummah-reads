"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import BookPagesAnimation from "./BookPagesAnimation";
import BookTitle from "./BookTitle";
import CinematicCamera from "./CinematicCamera";
import CinematicLighting from "./CinematicLighting";
import Leaves3D from "./Leaves3D";
import PreloadAssets from "./PreloadAssets";
import SceneLoader from "./SceneLoader";
import SceneEffects from "./SceneEffects";
import { sceneConfig } from "./SceneConfig";
import WriterModel from "./WriterModel";

function Model() {
  const { scene } = useGLTF("/assets/models/book.glb");

  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.position.y = Math.sin(t) * 0.12;

    ref.current.rotation.y =
      Math.sin(t * 0.4) * 0.12;

    ref.current.rotation.x =
      Math.sin(t * 0.3) * 0.03;
  });

  return (
    <group ref={ref}>
      <primitive
        object={scene}
        scale={sceneConfig.book.scale}
      />
    </group>
  );
}


export default function HeroScene3D() {

  return (

    <div className="absolute inset-0 h-full w-full animate-fadeIn">

      <Canvas
        shadows
        dpr={[1,2]}
        camera={{
          position: sceneConfig.camera.start,
          fov: 34
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping
        }}
      >

        <Suspense fallback={<SceneLoader />}>

          <PreloadAssets />

          <SceneEffects />

          <CinematicLighting />

          <Model />

          <BookPagesAnimation />

          <WriterModel />

          <Leaves3D />

          <BookTitle />

          <CinematicCamera />

        </Suspense>

      </Canvas>

    </div>

  );
}

useGLTF.preload("/assets/models/book.glb");