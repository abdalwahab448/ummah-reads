"use client";

import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type CameraControlsImpl from "camera-controls";
import { sceneConfig } from "./SceneConfig";

export default function CinematicCamera() {

const ref =
useRef<CameraControlsImpl|null>(null);

  useEffect(() => {

    if (!ref.current) return;

    const camera = ref.current;

    function move(e:any){

      camera.setPosition(
        0,
        1,
        e.detail,
        true
      );

    }


    window.addEventListener(
      "cameraMove",
      move
    );

    return () => {
      window.removeEventListener(
        "cameraMove",
        move
      );
    };
  }, []);

  return (
    <CameraControls
      ref={ref}
      target={sceneConfig.camera.focus}
      smoothTime={1.5}
    />
  );
}