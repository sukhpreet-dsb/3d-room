/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 tv.gltf 
Author: CN Entertainment (https://sketchfab.com/cn-entertainment)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/tv-1b7eff20a86b4cc692bc4222ac1ac252
Title: TV
*/

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ExtendedColors, Overwrite, NodeProps, NonFunctionKeys, Vector3, Euler, Matrix4, Quaternion, Layers } from "@react-three/fiber";
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events";
import { JSX } from "react/jsx-runtime";

export default function Model(props: JSX.IntrinsicAttributes & Omit<ExtendedColors<Overwrite<Partial<THREE.Group<THREE.Object3DEventMap>>, NodeProps<THREE.Group<THREE.Object3DEventMap>, typeof THREE.Group>>>, NonFunctionKeys<{ position?: Vector3; up?: Vector3; scale?: Vector3; rotation?: Euler; matrix?: Matrix4; quaternion?: Quaternion; layers?: Layers; dispose?: (() => void) | null; }>> & { position?: Vector3; up?: Vector3; scale?: Vector3; rotation?: Euler; matrix?: Matrix4; quaternion?: Quaternion; layers?: Layers; dispose?: (() => void) | null; } & EventHandlers) {
  const { nodes, materials } = useGLTF("/tv/tv.gltf");
  const meshNodeBlack = nodes.TV_49Zoll_Black_0 as THREE.Mesh
  const meshNodeRedLight = nodes.TV_49Zoll_RedLight_0 as THREE.Mesh
  const meshNodeScreen = nodes.TV_49Zoll_Screen1_0 as THREE.Mesh
  return (
    <group {...props} dispose={null}>
      <group scale={0.03} position={[2.5, 3, -5]}>
        <group scale={100}>
          <mesh
            geometry={meshNodeBlack.geometry}
            material={materials.Black}
          />
          <mesh
            geometry={meshNodeRedLight.geometry}
            material={materials.RedLight}
          />
          <mesh
            geometry={meshNodeScreen.geometry}
            material={materials.Screen1}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/tv.gltf");
