"use client";

import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type CameraControlsImpl from "camera-controls";
import { sceneConfig } from "./SceneConfig";

export default function CinematicCamera() {
  const ref = useRef<CameraControlsImpl | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const camera = ref.current;

    camera.setLookAt(
      0,
      1.6,
      6,
      sceneConfig.camera.focus[0],
      sceneConfig.camera.focus[1],
      sceneConfig.camera.focus[2],
      true
    );

    const move = (e: Event & { detail?: number }) => {
      camera.setPosition(0, 1, e.detail ?? 6, true);
    };

    window.addEventListener("cameraMove", move as EventListener);

    return () => {
      window.removeEventListener("cameraMove", move as EventListener);
    };
  }, []);

  return <CameraControls ref={ref} smoothTime={1.5} />;
}