"use client";

import { Text } from "@react-three/drei";

export default function BookTitle(){

  return(

    <Text
      position={[0,1.5,0]}
      fontSize={0.35}
      color="#14532d"
      anchorX="center"
      anchorY="middle"
    >

      أمتي تقرأ

    </Text>

  );

}