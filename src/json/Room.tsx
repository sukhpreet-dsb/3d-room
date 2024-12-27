import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import fabricData from "../../src/assets/room.json"

// 2D Polygon -> Floor Mesh (or 2D shape)
function createFloorMesh(points2D: { x: number; y: number }[]) {
  console.log(points2D)
  // Create a Shape from the 2D points
  const shape = new THREE.Shape();
  shape.moveTo(points2D[0].x, points2D[0].y);
  for (let i = 1; i < points2D.length; i++) {
    shape.lineTo(points2D[i].x, points2D[i].y);
  }
  shape.closePath();

  // Create geometry & material
  const geometry = new THREE.ShapeGeometry(shape);
  // You may want to use a texture or different color
  const material = new THREE.MeshStandardMaterial({ color: "white" ,side: THREE.DoubleSide});
  const mesh = new THREE.Mesh(geometry, material);

  // Rotate so it lays on the XZ-plane (since shape is in XY-plane by default)
  mesh.rotation.x = -Math.PI / 2;

  mesh.position.x = 0;
  mesh.position.y = 0.1;
  mesh.position.z = 1115;

  return mesh;
}

// 2D Line Segment -> "Wall" (extruded as a Box)
function createWallMesh(
  a: { x: number; y: number },
  b: { x: number; y: number },
  wallHeight = 50
) {
  // Distance between points (length of the wall)
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const thickness = 10; // Example thickness

  // BoxGeometry: (width, height, depth)
  const geometry = new THREE.BoxGeometry(length, wallHeight, thickness);
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const wallMesh = new THREE.Mesh(geometry, material);

  // Position it halfway between the two points (to center the box)
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;

  // In Three.js, we'll treat Y as "up," so move geometry into XZ-plane:
  wallMesh.position.set(midX, wallHeight / 2, midY);

  // Rotate around Y-axis so the wall lines up with the two points
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  wallMesh.rotation.y = -angle;

  return wallMesh;
}

/**
 * STEP 3: React component to parse Fabric JSON and produce 3D meshes.
 */
function Scene({ data }: { 
  data: {
    objects?: Array<{
      type: string;
      objects: Array<{
        type: string;
        points?: Array<{x: number; y: number}>;
      }>;
    }>;
  }
}) {
  const meshes = useMemo(() => {
    const groupMeshes: THREE.Mesh[] = [];

    // Top-level objects array
    const topLevelObjects = data.objects || [];

    topLevelObjects.forEach((obj) => {
      // We only handle type="group" in this example
      if (obj.type === "group") {
        // Inside each group, check for polygons, text, etc.
        const subObjs = obj.objects || [];
        subObjs.forEach(
          (subObj: { type: string; points?: { x: number; y: number }[] }) => {
            if (subObj.type === "polygon") {
              const { points } = subObj;
              if (!points || points.length < 2) return;

              // For polygons with 3+ points, assume a "floor" or shape
              if (points.length >= 3) {
                const floorMesh = createFloorMesh(points);
                groupMeshes.push(floorMesh);
              }
              // For polygons with exactly 2 points, interpret as a wall line
              else if (points.length === 2) {
                const wallMesh = createWallMesh(points[0], points[1], 100);
                groupMeshes.push(wallMesh);
              }
            }
            // If you want to handle i-text, do it here
          }
        );
      }
    });

    return groupMeshes;
  }, [data]);

  return (
    <>
      {meshes.map((mesh, i) => (
        <primitive object={mesh} key={i} />
      ))}
    </>
  );
}

export default function Root() {
  return (
    <Canvas
      camera={{ position: [0, 100, 300], fov: 50, near: 0.1, far: 10000 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.8} position={[5, 5, 5]} />
      <Scene data={fabricData} />
      <OrbitControls target={[750, 0, 500]} />
    </Canvas>
  );
}
