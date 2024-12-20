import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  SpotLight,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Chair from "../public/Chair.jsx";

const Drei = () => {
  return (
    <>
      {/* <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2}/>
      </Canvas> */}

      {/* <Canvas shadows>
      <ambientLight intensity={0.5} />
        <SpotLight position={[5, 10, 5]} intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <mesh castShadow>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2}/>
      </Canvas> */}

      {/* <Canvas>
        <Environment preset="sunset" />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas> */}

      <Canvas style={{width:"100%",height:"100vh"}}>
        <Chair />
        <SpotLight position={[5, 10, 5]} intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </>
  );
};
export default Drei;
