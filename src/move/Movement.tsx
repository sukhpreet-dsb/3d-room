import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import Floor from "../../public/floor/Floor";
import Chair from "../../public/chair/Chair";
import { useRef, useState } from "react";

const Movement = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const orbitControlsRef = useRef();
  const transformControlsRef = useRef();

  // Room boundaries
  const roomBounds = {
    minX: -5,
    maxX: 5,
    minY: 0, // Minimum height (ground level)
    maxY: 0, // Keep object at floor level
    minZ: -5,
    maxZ: 5,
  };

  // Function to constrain position (especially along the Y axis)
  const clampPosition = (object) => {
    if (object) {
      const position = object.position;
      position.x = Math.max(roomBounds.minX, Math.min(roomBounds.maxX, position.x));
      position.y = roomBounds.maxY; // Ensure Y stays at the floor level
      position.z = Math.max(roomBounds.minZ, Math.min(roomBounds.maxZ, position.z));
    }
  };

  const handleObjectClick = (object) => {
    setSelectedObject(object); // Set the clicked object as the selected one
  };

  const handleDeselect = () => {
    setSelectedObject(null); // Deselect object when clicking on empty space
  };

  return (
    <>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        flat
        style={{ width: "100%", height: "100vh" }}
        onPointerMissed={handleDeselect} // Deselect object if clicking on empty space
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Floor />

        {/* Chair */}
        <mesh
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the Canvas
            handleObjectClick(e.object);
          }}
        >
          <Chair />
        </mesh>

        {/* TransformControls applied only when an object is selected */}
        {selectedObject ? (
          <TransformControls
            ref={transformControlsRef}
            object={selectedObject}
            mode="translate"
            onDrag={() => clampPosition(selectedObject)} // Clamp position during movement
          />
        ) : null}

        {/* OrbitControls with dynamic props */}
        <OrbitControls
          ref={orbitControlsRef}
          enableRotate={!selectedObject} // Disable rotation when an object is selected
          enableZoom={true} // Zoom remains enabled
          enablePan={!selectedObject} // Optionally disable panning
        />
      </Canvas>
    </>
  );
};

export default Movement;
