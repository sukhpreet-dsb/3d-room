import { useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import Chair from "../public/chair/Chair";
import Table1 from "../public/table1/Table1";
import Sofa from "../public/sofa/Sofa";
// import Tv from "../public/tv/Tv.tsx";
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
    minY: -0.5,
    maxY: -0.5,
    minZ: -5,
    maxZ: 5,
  };

  const wallBounds = {
    minX: -5,
    maxX: 5,
    minZ: -5,
    maxZ: 5,
    minY: 1,
    maxY: 3,
  };

  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>();
  const [mode, setMode] = useState<"translate" | "rotate">("translate");

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

  const clampWallPosition = (object: any) => {
    if (object) {
      const boundingBox = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      const position = object.position;

      position.x = Math.max(
        wallBounds.minX,
        Math.min(wallBounds.maxX, position.x)
      );
      position.y = Math.max(
        wallBounds.minY,
        Math.min(wallBounds.maxY, position.y)
      );
      position.z = Math.max(
        wallBounds.minZ,
        Math.min(wallBounds.maxZ, position.z)
      );
    }
  };

  return (
    <>
      <div className="parent_div">
        {selectedObject ? (
          <button
            onClick={() =>
              setMode((prev) => (prev === "translate" ? "rotate" : "translate"))
            }
            className="button"
          >
            Switch to {mode === "translate" ? "Rotate" : "Translate"}
          </button>
        ) : null}
      </div>

      <div>
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          flat
          style={{ width: "100%", height: "100vh" }}
          onPointerMissed={handleDeselect}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Floor />
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleObjectClick(e);
            }}
          >
            <Walllight name="Wall" />
          </mesh>
          <Wall position={[0, 2, -5]} rotation={[0, 0, 0]} />
          <Wall position={[0, 2, 5]} rotation={[0, Math.PI, 0]} />
          <Wall position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Wall position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} />
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
              object={selectedObject}
              mode={mode}
              onObjectChange={() => {
                if (selectedObject && selectedObject?.parent?.name === "Wall") {
                  clampWallPosition(selectedObject);
                } else {
                  clampPosition(selectedObject);
                }
              }}
              showY={
                selectedObject?.parent?.name === "Wall"
                  ? true
                  : mode === "rotate"
                  ? true
                  : false
              }
              showX={mode === "rotate" ? false : true}
              showZ={mode === "rotate" ? false : true}
            />
          ) : null}

          <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleObjectClick(e);
            }}
            position={[0, 0.05, 0]}
          >
            <Table1 />
          </mesh>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleObjectClick(e);
            }}
          >
            <Sofa />
          </mesh>
          <OrbitControls
            enableZoom={true}
            enableRotate={!selectedObject}
            enablePan={!selectedObject}
          />
        </Canvas>
      </div>
    </>
  );
}

export default App;
