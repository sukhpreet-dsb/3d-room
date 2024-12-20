import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";

type WallProps = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const Floor = () => (
  <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]}>
    <planeGeometry args={[10, 10]} />
    <meshStandardMaterial color="lightgrey" />
  </mesh>
);

const Ceiling = () => (
  <mesh position={[0, 4.5, 0]} rotation-x={Math.PI / 2}>
    <planeGeometry args={[10, 10]} />
    <meshStandardMaterial color="lightblue" />
  </mesh>
);

const Wall = ({ position, rotation }: WallProps) => (
  <mesh position={position} rotation={rotation}>
    <planeGeometry args={[10, 5]} />
    <meshStandardMaterial color="skyblue" />
  </mesh>
);

const Chair = () => {
  return (
    <group position={[-2, 0.5, -3.5]}>
      {/* Seat */}
      <mesh position={[0, 0, 0]} scale={[2, 0.2, 2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.6, -0.9]} scale={[2, 1, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Front-left leg */}
      <mesh position={[-0.9, -0.5, 0.9]} scale={[0.2, 1, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Front-right leg */}
      <mesh position={[0.9, -0.5, 0.9]} scale={[0.2, 1, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Back-left leg */}
      <mesh position={[-0.9, -0.5, -0.9]} scale={[0.2, 1, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Back-right leg */}
      <mesh position={[0.9, -0.5, -0.9]} scale={[0.2, 1, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
    </group>
  );
};

const Table = () => {
  return (
    <group position={[-2, 0.5, -1]}>
      {/* Tabletop */}
      <mesh position={[0, 0.3, 0]} scale={[5, 0.2, 2]}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      {/* Front-left leg */}
      <mesh position={[-2, -0.4, 0.9]} scale={[0.2, 1.2, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Front-right leg */}
      <mesh position={[2, -0.4, 0.9]} scale={[0.2, 1.2, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Back-left leg */}
      <mesh position={[-2, -0.4, -0.9]} scale={[0.2, 1.2, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Back-right leg */}
      <mesh position={[2, -0.4, -0.9]} scale={[0.2, 1.2, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
    </group>
  );
};

const Sofa = () => {
  return (
    <group position={[2, 0.5, 3.5]}>
      {/* Seat */}
      <mesh position={[0, 0, 0]} scale={[4, 0.5, 2]}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />{" "}
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 1, 1]} scale={[4, 1.5, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />{" "}
      </mesh>
      {/* Left armrest */}
      <mesh position={[-2, 0.75, 0]} scale={[0.5, 1, 2]}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />{" "}
      </mesh>
      {/* Right armrest */}
      <mesh position={[2, 0.75, 0]} scale={[0.5, 1, 2]}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />{" "}
      </mesh>
      {/* Front-left leg */}
      <mesh position={[-1.5, -0.5, 0.9]} scale={[0.3, 1, 0.3]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Front-right leg */}
      <mesh position={[1.5, -0.5, 0.9]} scale={[0.3, 1, 0.3]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Back-left leg */}
      <mesh position={[-1.5, -0.5, -0.9]} scale={[0.3, 1, 0.3]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
      {/* Back-right leg */}
      <mesh position={[1.5, -0.5, -0.9]} scale={[0.3, 1, 0.3]}>
        <boxGeometry />
        <meshStandardMaterial color="brown" />
      </mesh>
    </group>
  );
};

const Television = () => {
  return (
    <group position={[1.5, 3, -4.5]}>
      {/* Screen */}
      <mesh position={[0, 0, 0]} scale={[3, 1.5, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Frame */}
      <mesh position={[0, 0, 0]} scale={[3.2, 1.6, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="darkgray" />
      </mesh>

      {/* Stand/Base */}
      <mesh position={[0, -0.75, 0]} scale={[1.2, 0.1, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Stand legs */}
      <mesh position={[-0.6, -0.8, 0]} scale={[0.1, 0.3, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="gray" />
      </mesh>

      <mesh position={[0.6, -0.8, 0]} scale={[0.1, 0.3, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="gray" />
      </mesh>
    </group>
  );
};

function App() {
  const [controlsEnabled, setControlsEnabled] = useState(true);

  const handleEnterRoom = () => {
    setControlsEnabled(false);
  };
  return (
    <>
      <button
        onClick={handleEnterRoom}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Enter Room
      </button>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        flat
        style={{ width: "100%", height: "100vh" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Floor />
        <Wall position={[0, 2, -5]} rotation={[0, 0, 0]} />
        <Wall position={[0, 2, 5]} rotation={[0, Math.PI, 0]} />
        <Wall position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Wall position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <Ceiling />
        <Chair />
        <Table />
        <Sofa />
        <Television />
        <OrbitControls  enabled={controlsEnabled}/>
      </Canvas>
    </>
  );
}

export default App;
