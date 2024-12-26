import { useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import Chair from "../public/chair/Chair";
// import Table from "../public/table/Table";
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

type RoomObject = {
  id: string;
  type: "Chair" | "Table1" | "Sofa" | "Walllight";
  position: [number, number, number];
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

  // const wallBounds = {
  //   minY: 1, // Min height for wall objects
  //   maxY: 4, // Max height for wall objects
  //   minZ: -5.5,
  //   maxZ: 4.5,
  // };

  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>();
  const [mode, setMode] = useState<"translate" | "rotate">("translate");
  const [roomObjects, setRoomObjects] = useState<RoomObject[]>([]);

  const handleObjectClick = (e: ThreeEvent<MouseEvent>) => {
    setSelectedObject(e.object);
  };
  const handleDeselect = () => {
    setSelectedObject(null);
  };

  const handleDragStart = (e: any, type: RoomObject["type"]) => {
    console.log(e);
    e.dataTransfer.setData("objectType", type);
    console.log(e, type);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const objectType = e.dataTransfer.getData(
      "objectType"
    ) as RoomObject["type"];
    const canvasRect = e.currentTarget.getBoundingClientRect();

    //Calculate drop position relative to the canvas
    const x = ((e.clientX - canvasRect.left) / canvasRect.width) * 10 - 5;
    const z = ((e.clientY - canvasRect.top) / canvasRect.height) * -10 + 5;

    const newObject: RoomObject = {
      id: `object-${Date.now()}`,
      type: objectType,
      position: [0, 0, 0], // Default position constrained to the floor level
    };

    setRoomObjects((prev) => [...prev, newObject]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
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

  // Clamp for wall objects like Walllight
  // const clampWallPosition = (object: any) => {
  //   if (object) {
  //     const boundingBox = new THREE.Box3().setFromObject(object);
  //     const size = new THREE.Vector3();
  //     boundingBox.getSize(size);

  //     const halfWidth = size.x / 2;
  //     const halfDepth = size.z / 2;

  //     const position = object.position;
  //     position.x = Math.max(
  //       roomBounds.minX + halfWidth,
  //       Math.min(roomBounds.maxX - halfWidth, position.x)
  //     );
  //     position.y = Math.max(
  //       wallBounds.minY,
  //       Math.min(wallBounds.maxY, position.y)
  //     );
  //     position.z = Math.max(
  //       wallBounds.minZ + halfDepth,
  //       Math.min(wallBounds.maxZ - halfDepth, position.z)
  //     );
  //   }
  // };
  const clampWallPosition = (object: any) => {
    console.log("entering the console");
    if (object) {
      const boundingBox = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      // const halfWidth = size.x / 2;
      // const halfDepth = size.z / 2;

      const position = object.position;

      // Free movement on the X-axis (no clamping)
      position.x = position.x;

      // Y and Z axes are already free, no changes made
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

      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Available Items</h3>
          <div
            className="sidebar-item"
            draggable
            onDragStart={(e) => handleDragStart(e, "Chair")}
          >
            Chair
          </div>
          <div
            className="sidebar-item"
            draggable
            onDragStart={(e) => handleDragStart(e, "Table1")}
          >
            Table
          </div>
          <div
            className="sidebar-item"
            draggable
            onDragStart={(e) => handleDragStart(e, "Sofa")}
          >
            Sofa
          </div>
          <div
            className="sidebar-item"
            draggable
            onDragStart={(e) => handleDragStart(e, "Walllight")}
          >
            Wall Light
          </div>
        </div>
      </div>
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          flat
          style={{ width: "100%", height: "100vh" }}
          onPointerMissed={handleDeselect}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Floor />
          {/* <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleObjectClick(e);
            }}
          >
            <Walllight name="Wall" />
          </mesh> */}
          <Wall position={[0, 2, -5]} rotation={[0, 0, 0]} />
          <Wall position={[0, 2, 5]} rotation={[0, Math.PI, 0]} />
          <Wall position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Wall position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} />
          <Ceiling />

          {roomObjects.map((obj) => (
            console.log(obj,"obj"),
            <mesh
              key={obj.id}
              position={obj.position}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedObject(e.object);
              }}
            >
              {obj.type === "Chair" && <Chair />}
              {obj.type === "Table1" && <Table1 />}
              {obj.type === "Sofa" && <Sofa />}
              {obj.type === "Walllight" && <Walllight />}
            </mesh>
          ))}
          {/* <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleObjectClick(e);
            }}
          >
            <Chair />
          </mesh> */}

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

          {/* <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleObjectClick(e);
            }}
            position={[0, 0.05, 0]}
          >
            <Table1 />
          </mesh> */}
          {/* <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleObjectClick(e);
            }}
          >
            <Sofa />
          </mesh> */}
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

// import { useState, DragEvent } from "react";
// import { Canvas, ThreeEvent } from "@react-three/fiber";
// import { OrbitControls, TransformControls } from "@react-three/drei";
// import Chair from "../public/chair/Chair";
// import Table1 from "../public/table1/Table1";
// import Sofa from "../public/sofa/Sofa";
// import Floor from "../public/floor/Floor";
// import Walllight from "../public/wallight/Walllight";
// import * as THREE from "three";
// import "./App.css";

// type RoomObject = {
//   id: string;
//   type: "Chair" | "Table1" | "Sofa" | "Walllight";
//   position: [number, number, number];
// };

// const App = () => {
//   const roomBounds = {
//     minX: -5,
//     maxX: 5,
//     minY: 0.5, // Floor level
//     maxY: 0.5, // Keep objects constrained to the floor
//     minZ: -5,
//     maxZ: 5,
//   };

//   const [roomObjects, setRoomObjects] = useState<RoomObject[]>([]);
//   const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>();
//   const [mode, setMode] = useState<"translate" | "rotate">("translate");

//   const handleDeselect = () => {
//     setSelectedObject(null);
//   };

//   const handleDragStart = (e: DragEvent<HTMLDivElement>, type: RoomObject["type"]) => {
//     e.dataTransfer.setData("objectType", type);
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const objectType = e.dataTransfer.getData("objectType") as RoomObject["type"];
//     const canvasRect = e.currentTarget.getBoundingClientRect();

//     // Calculate drop position relative to the canvas
//     const x = ((e.clientX - canvasRect.left) / canvasRect.width) * 10 - 5;
//     const z = ((e.clientY - canvasRect.top) / canvasRect.height) * -10 + 5;

//     const newObject: RoomObject = {
//       id: `object-${Date.now()}`,
//       type: objectType,
//       position: [x, 0.5, z], // Default position constrained to the floor level
//     };

//     setRoomObjects((prev) => [...prev, newObject]);
//   };

//   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault(); // Allow drop
//   };

//   const clampPosition = (object: any) => {
//     if (object) {
//       const boundingBox = new THREE.Box3().setFromObject(object);
//       const size = new THREE.Vector3();
//       boundingBox.getSize(size);

//       const halfWidth = size.x / 2;
//       const halfDepth = size.z / 2;

//       const position = object.position;
//       position.x = Math.max(
//         roomBounds.minX + halfWidth,
//         Math.min(roomBounds.maxX - halfWidth, position.x)
//       );
//       position.y = roomBounds.minY; // Constrain to floor level
//       position.z = Math.max(
//         roomBounds.minZ + halfDepth,
//         Math.min(roomBounds.maxZ - halfDepth, position.z)
//       );
//     }
//   };

//   return (
//     <div className="app-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h3>Available Items</h3>
//         <div
//           className="sidebar-item"
//           draggable
//           onDragStart={(e) => handleDragStart(e, "Chair")}
//         >
//           Chair
//         </div>
//         <div
//           className="sidebar-item"
//           draggable
//           onDragStart={(e) => handleDragStart(e, "Table1")}
//         >
//           Table
//         </div>
//         <div
//           className="sidebar-item"
//           draggable
//           onDragStart={(e) => handleDragStart(e, "Sofa")}
//         >
//           Sofa
//         </div>
//         <div
//           className="sidebar-item"
//           draggable
//           onDragStart={(e) => handleDragStart(e, "Walllight")}
//         >
//           Wall Light
//         </div>
//       </div>

//       {/* Canvas */}
//       <div
//         className="canvas-container"
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//       >
//         <Canvas
//           camera={{ position: [5, 5, 5], fov: 50 }}
//           onPointerMissed={handleDeselect}
//         >
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[5, 5, 5]} intensity={1} />
//           <Floor />
//           <OrbitControls
//             enableZoom={true}
//             enableRotate={!selectedObject}
//             enablePan={!selectedObject}
//           />
//           {roomObjects.map((obj) => (
//             <mesh
//               key={obj.id}
//               position={obj.position}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setSelectedObject(e.object);
//               }}
//             >
//               {obj.type === "Chair" && <Chair />}
//               {obj.type === "Table1" && <Table1 />}
//               {obj.type === "Sofa" && <Sofa />}
//               {obj.type === "Walllight" && <Walllight />}
//             </mesh>
//           ))}

//           {selectedObject && (
//             <TransformControls
//               object={selectedObject}
//               mode={mode}
//               onObjectChange={() => {
//                 if (selectedObject) clampPosition(selectedObject);
//               }}
//             />
//           )}
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default App;
