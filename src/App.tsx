import { useRef, useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import Chair from "../public/chair/Chair";
import Table from "../public/table/Table";
import Sofa from "../public/sofa/Sofa";
import Tv from "../public/tv/Tv.tsx";
import Floor from "../public/floor/Floor";
import Walllight from "../public/wallight/Walllight";
import * as THREE from "three";
import "./App.css";

type WallProps = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const Ceiling = () => (
  <mesh position={[0, 4.5, 0]} rotation-x={Math.PI / 2}>
    <planeGeometry args={[10, 10]} />
    <meshStandardMaterial color="lightblue" />
  </mesh>
);

const Wall = ({ position, rotation }: WallProps) => (
  <mesh position={position} rotation={rotation}>
    <planeGeometry args={[10, 5]} />
    <meshStandardMaterial color="Beige" />
  </mesh>
);

function App() {
  const roomBounds = {
    minX: -5,
    maxX: 5,
    minY: -0.5, // Minimum height (ground level)
    maxY: -0.5, // Keep object at floor level
    minZ: -5,
    maxZ: 5,
  };
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>();

  const transformControlsRef = useRef(null);
  const orbitControlsRef = useRef(null);

  const handleObjectClick = (e: ThreeEvent<MouseEvent>) => {
    setSelectedObject(e.object);
  };
  const handleDeselect = () => {
    setSelectedObject(null);
  };

  const clampPosition = (object: any) => {
    if (object) {
      const boundingBox = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      console.log(boundingBox, "boundingBox");

      const halfWidth = size.x / 2;
      const halfDepth = size.z / 2;

      const position = object.position;
      position.x = Math.max(
        roomBounds.minX + halfWidth,
        Math.min(roomBounds.maxX - halfWidth, position.x)
      );
      position.y = Math.max(
        roomBounds.minY,
        Math.min(roomBounds.maxY, position.y)
      );
      position.z = Math.max(
        roomBounds.minZ + halfDepth,
        Math.min(roomBounds.maxZ - halfDepth, position.z)
      );
    }
  };

  return (
    <>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        flat
        style={{ width: "100%", height: "100vh" }}
        onPointerMissed={handleDeselect}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Floor />
        <Wall position={[0, 2, -5]} rotation={[0, 0, 0]} />
        <Wall position={[0, 2, 5]} rotation={[0, Math.PI, 0]} />
        <Wall position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Wall position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            handleObjectClick(e);
          }}
        >
          <Walllight />
        </mesh>
        <Ceiling />
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            handleObjectClick(e);
          }}
        >
          <Chair />
        </mesh>

        {selectedObject ? (
          <TransformControls
            ref={transformControlsRef}
            object={selectedObject}
            mode="translate"
            onObjectChange={() => clampPosition(selectedObject)}
            // showX={true}
          />
        ) : null}

        <mesh
          onClick={(e) => {
            e.stopPropagation();
            handleObjectClick(e);
          }}
        >
          <Table />
        </mesh>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            handleObjectClick(e);
          }}
        >
          <Sofa />
        </mesh>
        <Tv />
        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={true}
          enableRotate={!selectedObject}
          enablePan={!selectedObject}
        />
      </Canvas>
    </>
  );
}

export default App;
