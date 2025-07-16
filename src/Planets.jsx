
import { useMemo, useRef } from "react";
import { Line, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Path, Vector3 } from "three";


const OrbitLine = ({ radius, yPosition }) => {
  const points = useMemo(() => {
    const path = new Path();
    path.absarc(0, 0, radius, 0, Math.PI * 2, false);
    const points2D = path.getPoints(128);
    return points2D.map((p) => new Vector3(p.x, 0, p.y));
  }, [radius]);

  return (
    <Line
      points={points}
      color="white"
      lineWidth={0.5}
      position={[0, yPosition, 0]}
    />
  );
};

export function Planets(props) {
  const group = useRef();
  const sphere1Ref = useRef();
  const sphere2Ref = useRef();
  const sunRef = useRef();
  const sphere4Ref = useRef();
  const sphere0Ref = useRef();

  const material1Ref = useRef();
  const material2Ref = useRef();
  const material3Ref = useRef();
  const material4Ref = useRef();
  const material5Ref = useRef();

  const { camera } = useThree(); // Get camera instance
  // const { nodes, materials } = useGLTF(modelUrl);

  // Keep the billboard effect for spheres
  useFrame((state, delta) => {
    [sphere0Ref, sphere1Ref, sphere2Ref, sunRef, sphere4Ref].forEach(
      (sphereRef) => {
        if (sphereRef.current) {
          // Make spheres look at the camera position
          sphereRef.current.quaternion.copy(camera.quaternion);
        }
      }
    );

    [
      material1Ref,
      material2Ref,
      material3Ref,
      material4Ref,
      material5Ref,
    ].forEach((materialRef) => {
      if (materialRef.current) {
        materialRef.current.uTime += delta;
      }
    });
  });

  //"https://files.creative-directors.com/creative-website/creative25/textures/about_page/planets/planet_1.webp"
  //"https://files.creative-directors.com/creative-website/creative25/textures/about_page/planets/planet_2.webp"

  const host_url = "https://files.creative-directors.com/creative-website/creative25/about_page"
  const planetMaterial = useTexture(host_url + "/textures/planets/planet_1.webp");
  const planetMaterial2 = useTexture(host_url + "/textures/planets/planet_2.webp");
  const planetMaterial3 = useTexture(host_url + "/textures/planets/planet_3.webp");
  const planetMaterial4 = useTexture(host_url + "/textures/planets/planet_4.webp");
  const sunMaterial = useTexture(host_url + "/textures/sun_1.webp");


  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          {/* Empties are just markers, no need to render */}
          {/* <group name="start" position={[-32.842, 4.485, 24.756]} />
          <group name="Empty" position={[-19.471, 1, -4.594]} />
          ... other empties ... */}

          {/* Keep Meshes */}
          <mesh
            name="Sun"
            ref={sunRef}
            position={[0, 0, 0]}
            scale={3.121}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial map={sunMaterial}
              emissive="orange"
              emissiveMap={sunMaterial}
              emissiveIntensity={4}
            />
          </mesh>

          <mesh name="blue_planet" ref={sphere0Ref} position={[10, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial
              map={planetMaterial}

            />

          </mesh>

          <mesh
            name="Earth"
            ref={sphere1Ref}
            position={[0, 0, 15]}
            scale={1.717}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial map={planetMaterial2} />
          </mesh>

          <mesh
            name="green_planet"
            ref={sphere2Ref}
            position={[-20, 0, 0]}
            scale={1.717}
            rotation={[0, Math.PI / 2, 0]}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial map={planetMaterial4} />
            {/* <planet3Material ref={material3Ref} /> */}
          </mesh>

          <mesh
            name="white_planet"
            ref={sphere4Ref}
            position={[0, 0, -25]}
            scale={1.557}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial map={planetMaterial3} />
            {/* <planet5Material ref={material5Ref} /> */}
          </mesh>
          <OrbitLine radius={10} yPosition={0} />
          <OrbitLine radius={15} yPosition={0} />
          <OrbitLine radius={20} yPosition={0} />
          <OrbitLine radius={25} yPosition={0} />
        </group>
      </group >
    </>
  );
}

// useGLTF.preload(modelUrl); // Preload the model to improve loading performance
// Preload the model to improve loading performance
