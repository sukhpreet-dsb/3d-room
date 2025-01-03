import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import data from "../../src/assets/data.json";

type ShapeObject = {
  type: string;
  points?: { x: number; y: number }[];
  fill: string;
  opacity: number;
  visible: boolean;
  scaleX: number;
  scaleY: number;
  shadow: boolean | null;
  stroke: string | null;
  strokeWidth: number;
  angle: number;
  skewX: number;
  skewY: number;
  flipX: boolean;
  flipY: boolean;
  id: string;
};

type GroupObject = {
  type: string;
  objects: ShapeObject[];
};

type CanvasObject = {
  version: string;
  objects: GroupObject[];
};

function createWindowMesh({
  width,
  height,
  position,
  rotation,
}: {
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const geometry = new THREE.BoxGeometry(width, height, 10);
  const material = new THREE.MeshStandardMaterial({
    color: "white",
    opacity: 1,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const windowMesh = new THREE.Mesh(geometry, material);

  windowMesh.position.set(...position);
  windowMesh.rotation.set(...rotation);

  return windowMesh;
}

function createDoorMesh({
  width,
  height,
  position,
  rotation,
}: {
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  // Door geometry: BoxGeometry (width, height, thickness)
  const geometry = new THREE.BoxGeometry(width, height, 10); // Thin door with depth of 10
  const material = new THREE.MeshStandardMaterial({
    color: "brown", // Default brown color for the door
    opacity: 1,
    transparent: true,
    side: THREE.DoubleSide, // Ensure both sides of the door are visible
  });

  const doorMesh = new THREE.Mesh(geometry, material);

  // Set the position and rotation of the door mesh
  doorMesh.position.set(...position);
  doorMesh.rotation.set(...rotation);

  return doorMesh;
}

// 2D Polygon -> Floor Mesh (or 2D shape)
function createFloorMesh(
  points2D: { x: number; y: number }[],
  fill: string,
  opacity: number,
  visible: boolean,
  scaleX: number,
  scaleY: number,
  shadow: boolean | null,
  stroke: string | null,
  strokeWidth: number,
  angle: number,
  skewX: number,
  skewY: number,
  flipX: boolean,
  flipY: boolean
) {
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
  const material = new THREE.MeshStandardMaterial({
    color: fill,
    side: THREE.DoubleSide,
    opacity,
  });

  const mesh = new THREE.Mesh(geometry, material);

  if (stroke && strokeWidth > 0) {
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const strokeMaterial = new THREE.LineBasicMaterial({
      color: stroke,
      linewidth: strokeWidth, // Stroke width is dependent on the renderer
    });
    const strokeMesh = new THREE.LineSegments(edgesGeometry, strokeMaterial);
    mesh.add(strokeMesh); // Attach stroke as a child of the floor
  }

  mesh.visible = visible;
  mesh.receiveShadow = shadow ?? false;
  const flipScaleX = flipX ? -scaleX : scaleX;
  const flipScaleY = flipY ? -scaleY : scaleY;
  mesh.scale.set(flipScaleX, flipScaleY, 1);

  // Rotate so it lays on the XZ-plane (since shape is in XY-plane by default)
  mesh.rotation.set(-Math.PI / 2, 0, THREE.MathUtils.degToRad(angle));

  const skewMatrix = new THREE.Matrix4();
  skewMatrix.set(
    1,
    Math.tan(THREE.MathUtils.degToRad(skewX)),
    0,
    0,
    Math.tan(THREE.MathUtils.degToRad(skewY)),
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );
  mesh.geometry.applyMatrix4(skewMatrix);

  mesh.position.x = 0;
  mesh.position.y = 0.1;
  mesh.position.z = 970;

  return mesh;
}

// 2D Line Segment -> "Wall" (extruded as a Box)
function createWallMesh({
  a,
  b,
  wallHeight = 10,
  fill,
  opacity,
  visible,
  scaleX,
  scaleY,
  shadow,
  stroke,
  strokeWidth,
  angle,
  skewX,
  skewY,
  flipX,
  flipY,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  wallHeight?: number;
  fill: string;
  opacity: number;
  visible: boolean;
  scaleX: number;
  scaleY: number;
  shadow: boolean | null;
  stroke: string | null;
  strokeWidth: number;
  angle: number;
  skewX: number;
  skewY: number;
  flipX: boolean;
  flipY: boolean;
}) {
  // Distance between points (length of the wall)
  const length = Math.hypot(b.x - a.x, b.y - a.y);

  // BoxGeometry: (width, height, depth)
  const geometry = new THREE.BoxGeometry(length, wallHeight, strokeWidth);
  const material = new THREE.MeshStandardMaterial({ color: "grey", opacity });
  const wallMesh = new THREE.Mesh(geometry, material);

  if (stroke && strokeWidth > 0) {
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const strokeMaterial = new THREE.LineBasicMaterial({
      color: stroke,
      linewidth: strokeWidth, // Note: Line width is dependent on the renderer
    });
    const strokeMesh = new THREE.LineSegments(edgesGeometry, strokeMaterial);
    wallMesh.add(strokeMesh); // Attach stroke as a child of the wall
  }

  // Position it halfway between the two points (to center the box)
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;

  // In Three.js, we'll treat Y as "up," so move geometry into XZ-plane:
  wallMesh.position.set(midX, wallHeight / 2, midY);

  // Rotate around Y-axis so the wall lines up with the two points
  const baseangle = Math.atan2(b.y - a.y, b.x - a.x);
  wallMesh.rotation.y = -baseangle + THREE.MathUtils.degToRad(angle);

  wallMesh.visible = visible;
  wallMesh.castShadow = shadow ?? false;
  wallMesh.receiveShadow = shadow ?? false;
  const flipScaleX = flipX ? -scaleX : scaleX;
  const flipScaleY = flipY ? -scaleY : scaleY;
  wallMesh.scale.set(flipScaleX, flipScaleY, 1);

  const skewMatrix = new THREE.Matrix4();

  skewMatrix.set(
    1,
    Math.tan(THREE.MathUtils.degToRad(skewX)),
    0,
    0,
    Math.tan(THREE.MathUtils.degToRad(skewY)),
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );

  wallMesh.geometry.applyMatrix4(skewMatrix);

  return wallMesh;
}

/**
 * STEP 3: React component to parse Fabric JSON and produce 3D meshes.
 */
function Scene({
  data,
}: {
  data: {
    objects?: Array<{
      type: string;
      objects: Array<{
        type: string;
        points?: Array<{ x: number; y: number }>;
        fill: string;
        opacity: number;
        visible: boolean;
        scaleX: number;
        scaleY: number;
        shadow: boolean | null;
        stroke: string | null;
        strokeWidth: number;
        angle: number;
        skewX: number;
        skewY: number;
        flipX: boolean;
        flipY: boolean;
        isWindow: boolean;
        id: string;
      }>;
    }>;
  };
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
        subObjs.forEach((subObj) => {
          if (subObj.type === "polygon") {
            const {
              points,
              fill,
              opacity,
              visible,
              scaleX,
              scaleY,
              shadow,
              stroke,
              strokeWidth,
              angle,
              skewX,
              skewY,
              flipX,
              flipY,
              isWindow,
              id,
            } = subObj;
            if (!points || points.length < 2) return;

            // For polygons with 3+ points, assume a "floor" or shape
            if (points.length >= 3) {
              const floorMesh = createFloorMesh(
                points,
                fill,
                opacity,
                visible,
                scaleX,
                scaleY,
                shadow,
                stroke,
                strokeWidth,
                angle,
                skewX,
                skewY,
                flipX,
                flipY
              );
              groupMeshes.push(floorMesh);
            }
            // For polygons with exactly 2 points, interpret as a wall line
            else if (points.length === 2) {
              const wallMesh = createWallMesh({
                a: points[0],
                b: points[1],
                wallHeight: 100,
                fill,
                opacity,
                visible,
                scaleX,
                scaleY,
                shadow,
                stroke,
                strokeWidth,
                angle,
                skewX,
                skewY,
                flipX,
                flipY,
              });
              groupMeshes.push(wallMesh);
            }
            if (true && id === "0727c87d-1b0f-4159-a18a-7f4d8d187292") {
              console.log(points, "working");
              const midX = (points[0].x + points[1].x) / 2;
              const midY = (points[0].y + points[1].y) / 2;

              console.log(midX, midY);

              const windowMesh = createWindowMesh({
                width: 50,
                height: 50,
                position: [midX, 50, midY], // Adjust height as needed
                rotation: [
                  0,
                  -Math.atan2(
                    points[1].y - points[0].y,
                    points[1].x - points[0].x
                  ),
                  0,
                ],
              });

              groupMeshes.push(windowMesh);
            }
            if (true && id === "c9c56b44-5247-4ac8-9d6e-fd46994c9ec2") {
              const midX = (points[0].x + points[1].x) / 2;
              const midY = (points[0].y + points[1].y) / 2;
              const door = createDoorMesh({
                width: 30,
                height: 80,
                position: [midX, 40, midY], // Position of the door in the world space
                rotation: [0, Math.PI, 0], // Rotation (in radians)
              });

              // Add the door to the scene
              groupMeshes.push(door);
            }
          }
        });
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

const Window = () => {
  return (
    <mesh position={[0, 1, 0]}>
      {/* Geometry for the window */}
      <planeGeometry args={[100, 100]} /> {/* width = 2, height = 3 */}
      {/* Transparent glass-like material */}
      <meshStandardMaterial
        color="lightblue"
        opacity={0.5}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default function RoomWithDoorWindow() {
  return (
    <>
      <div style={{ flex: 1 }}>
        <Canvas
          camera={{ position: [350, 990, 990], fov: 50, near: 0.1, far: 10000 }}
          style={{ width: "100vw", height: "100vh" }}
        >
          <ambientLight intensity={1} />
          <directionalLight
            intensity={1}
            position={[5, 0, 2]}
            castShadow={true}
          />
          <Scene data={data} />
          {/* <Window /> */}
          <OrbitControls
            target={[360, 100, 400]}
            maxDistance={1000}
            enableRotate={true}
            // autoRotate={true}
          />
        </Canvas>
      </div>
    </>
  );
}
