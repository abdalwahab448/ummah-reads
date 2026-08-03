"use client";

import { useGLTF } from "@react-three/drei";

export default function PreloadAssets(){

  useGLTF.preload(
    "/assets/models/book.glb"
  );

  useGLTF.preload(
    "/assets/models/boy.glb"
  );

  return null;
}