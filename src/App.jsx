import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import { CameraControls, OrbitControls, Sparkles, Stars } from "@react-three/drei";
// import { NodeToyMaterial, NodeToyTick } from "@nodetoy/react-nodetoy";
import { data } from "./shaderData.ts";
import Env from "./Env.jsx";
import GlowCore from "./GlowCore.jsx";
import { Perf } from "r3f-perf";
import PostProcessingEffects from "./PostProcessingEffects.jsx";
import { Tunnel } from "./Core_values.jsx";
import CameraDebug from "./CameraDebug.jsx";
import { useThree } from "@react-three/fiber";
import CameraAnimator from "./CameraAnimator.jsx";
import { AnimatedMoon } from "./AnimatedMoon.jsx";
import SolarFlares from "./SolarFlares.jsx";
import { Planets } from "./Planets.jsx";
import { HeaderText } from "./ABOUT.jsx";
import { Terrain } from "./About_terrain_1.jsx";
import FloatingLight from "./FloatingLight.jsx";
import TunnelSpotlight from "./TunnelSpotlight.jsx";

const PLANE_HEIGHT = 41;

const Scene = ({ setCamera }) => {
  const { camera } = useThree();
  useState(() => {
    setCamera(camera);
  }, [camera]);
  return null;
};

export default function App() {
  const [camera, setCamera] = useState(null);
  const initialPosition = [17.3628835502475, 36.758520371048945, 17.037901901535783];
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <CameraDebug camera={camera} />
      <Canvas
        gl={{ alpha: true }}
        camera={{ fov: 45, near: 0.1, far: 1000, position: initialPosition }}
      >
        <Perf />
        <Scene setCamera={setCamera} />
        {/* <color attach="background" args={["#000000"]} /> */}
        {/* <ambientLight intensity={0.5} /> */}
        <directionalLight position={[10, 70, -5]} intensity={1} />
        <Env />
        <GlowCore position={[0, 0, 0]} />
        {/* <SolarFlares position={[0, 2, 0]} /> */}

        <HeaderText position={[0, PLANE_HEIGHT + 8, 0]} />

        <Sparkles
          position={[0, 0, 0]}
          count={100}
          size={1}
          speed={1}
          scale={5}


          // color="white"
          noise={5}
        />
        <Stars />
        <TunnelSpotlight position={[0, 37, 0]} />

        /**START terrain */
        <Terrain
          position={[0, 41.8, 0]}
          scale={25}
        />
        /**END terrain */

        /**START planets */
        <Planets position={[0, -70, 0]} />
        /**END planets */

        {/* <NodeToyTick /> */}
        <group position={[0, 45, 0]} rotation={[0, Math.PI / 4, 0]}>
          {/* <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="red" />
          </mesh> */}
          <FloatingLight rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]} />
        </group>





        /**START cameras */

        {/* <OrbitControls /> */}
        {/* <CameraControls /> */}

        /**END cameras */

        /**START tunnel */
        <Tunnel />
        /**END tunnel */

        /**START animated moon */
        {/* <AnimatedMoon
          position={[0, 41, -0.2]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 3]}
          scale={2}
        // img={img}
        /> */}

        <ambientLight intensity={1} />


        <CameraAnimator camera={camera} />


        {/* <CameraDebug /> */}

        {/* Add post-processing effects */}
        <PostProcessingEffects />
      </Canvas>
    </div>
  );
}
