import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { NodeToyMaterial, NodeToyTick } from "@nodetoy/react-nodetoy";
import { data } from "./shaderData.ts";
import { Planets } from "./Planets.jsx";

export default function App() {
  return (
    <Canvas
      gl={{ alpha: true }}
      camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 0, 2] }}
    >
      {/* <color attach="background" args={["#000000"]} /> */}
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <Planets />

      <Stars />

      <NodeToyTick />

      {/* <OrbitControls /> */}

      {/* Add post-processing effects */}
      {/* <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer> */}
    </Canvas>
  );
}
