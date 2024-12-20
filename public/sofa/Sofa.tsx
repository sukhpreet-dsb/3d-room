/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 sofa.gltf 
Author: katjagricishina (https://sketchfab.com/katjagricishina)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/sofa-03550a3529c24611a12aa158747374e0
Title: Sofa
*/

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  ExtendedColors,
  Overwrite,
  NodeProps,
  NonFunctionKeys,
  Vector3,
  Euler,
  Matrix4,
  Quaternion,
  Layers,
} from "@react-three/fiber";
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events";
import { JSX } from "react/jsx-runtime";
export default function Model(
  props: JSX.IntrinsicAttributes &
    Omit<
      ExtendedColors<
        Overwrite<
          Partial<THREE.Group<THREE.Object3DEventMap>>,
          NodeProps<THREE.Group<THREE.Object3DEventMap>, typeof THREE.Group>
        >
      >,
      NonFunctionKeys<{
        position?: Vector3;
        up?: Vector3;
        scale?: Vector3;
        rotation?: Euler;
        matrix?: Matrix4;
        quaternion?: Quaternion;
        layers?: Layers;
        dispose?: (() => void) | null;
      }>
    > & {
      position?: Vector3;
      up?: Vector3;
      scale?: Vector3;
      rotation?: Euler;
      matrix?: Matrix4;
      quaternion?: Quaternion;
      layers?: Layers;
      dispose?: (() => void) | null;
    } & EventHandlers
) {
  const { nodes, materials } = useGLTF("/sofa/sofa.gltf");
  const meshNodes = nodes.Object_2 as THREE.Mesh;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={meshNodes.geometry}
        material={materials["Scene_-_Root"]}
        rotation={[-Math.PI / 2, 0, 4.7]}
        scale={0.06}
        position={[2, -0.5, 3.6]}
      />
    </group>
  );
}

useGLTF.preload("/sofa.gltf");
