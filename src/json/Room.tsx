import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import fabricData from "../../src/assets/room.json";
import shape from "../../src/assets/shape.json";
import rectangle from "../../src/assets/rectangle.json"

// 2D Polygon -> Floor Mesh (or 2D shape)
function createFloorMesh(
  points2D: { x: number; y: number }[],
  fill: string,
  opacity: number,
  visible: boolean,
  scaleX: number,
  scaleY: number,
  shadow: boolean,
  stroke: string,
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
  mesh.receiveShadow = shadow;
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
  mesh.position.z = 1115;

  return mesh;
}

// 2D Line Segment -> "Wall" (extruded as a Box)
function createWallMesh(
  a: { x: number; y: number },
  b: { x: number; y: number },
  wallHeight = 10,
  fill: string,
  opacity: number,
  visible: boolean,
  scaleX: number,
  scaleY: number,
  shadow: boolean,
  stroke: string,
  strokeWidth: number,
  angle: number,
  skewX: number,
  skewY: number,
  flipX: boolean,
  flipY: boolean
) {
  // Distance between points (length of the wall)
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  console.log(length,"lenght")

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
  wallMesh.castShadow = shadow;
  wallMesh.receiveShadow = shadow;
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
        shadow: boolean;
        stroke: string;
        strokeWidth: number;
        angle: number;
        skewX: number;
        skewY: number;
        flipX: boolean;
        flipY: boolean;
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
              const wallMesh = createWallMesh(
                points[0],
                points[1],
                100,
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
              groupMeshes.push(wallMesh);
            }
          }
          // If you want to handle i-text, do it here
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

export default function Room() {
  const [selectedData, setSelectedData] = useState(fabricData);
  return (
    <>
      <div>
        {/* Sidebar */}
        <div
          style={{
            width: "200px",
            backgroundColor: "#f0f0f0",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            position: "absolute",
            bottom: "0px",
            height: "100vh",
            zIndex: "1 ",
          }}
        >
          <button
            onClick={() => setSelectedData(fabricData)}
            style={{
              padding: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              border: "1px solid black",
            }}
          >
            Cubic Model
          </button>
          <button
            onClick={() => setSelectedData(shape)}
            style={{
              padding: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              border: "1px solid black",
            }}
          >
            L Shape Model
          </button>
          <button
            onClick={() => setSelectedData(rectangle)}
            style={{
              padding: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              border: "1px solid black",
            }}
          >
            Rectangle Model
          </button>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Canvas
          camera={{ position: [770, 600, 500], fov: 50, near: 0.1, far: 10000 }}
          style={{ width: "100vw", height: "100vh" }}
        >
          <ambientLight intensity={1} />
          <directionalLight
            intensity={1}
            position={[5, 0, 2]}
            castShadow={true}
          />
          <Scene data={selectedData} />
          <OrbitControls
            target={[760, 100, 500]}
            maxDistance={1000}
            enableRotate={true}
            autoRotate={true}
          />
        </Canvas>
      </div>
    </>
  );
}
