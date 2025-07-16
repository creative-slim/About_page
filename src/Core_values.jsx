import { useRef, useMemo } from 'react'
import { useGLTF, useTexture, useHelper } from '@react-three/drei'
import { Vector3, FrontSide } from 'three'
import { useFrame } from '@react-three/fiber'

const host_url = "https://files.creative-directors.com/creative-website/creative25/about_page"
const url = host_url + '/models/tunnel-transformed.glb'

export function Tunnel(props) {


  const { nodes, materials } = useGLTF(url)

  const light = useRef()
  const tetrahedronRef = useRef()
  const rotationDirection = useRef(new Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ));
  const lastUpdateTime = useRef(0);
  const material = materials['Material.002']

  const modifiedMaterials = useMemo(() => {

    material.side = FrontSide
    material.metalness = 0.8
    material.roughness = 0.2
    return material
  }, [material])

  const speed = 10
  useFrame((state) => {
    // Apply a continuously changing random rotation to the tetrahedronRef group
    if (tetrahedronRef.current) {
      const { clock } = state;
      // Update direction every 2 seconds
      if (clock.elapsedTime - lastUpdateTime.current > 2) {
        rotationDirection.current.set(
          (Math.random() - 0.5) * 0.03, // Range: -0.01 to 0.01 radians
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03
        );
        lastUpdateTime.current = clock.elapsedTime;
      }

      // Update the rotation
      tetrahedronRef.current.rotation.x += rotationDirection.current.x * speed;
      tetrahedronRef.current.rotation.y += rotationDirection.current.y * speed;
      tetrahedronRef.current.rotation.z += rotationDirection.current.z * speed;
    }
  })


  // useHelper(light, THREE.PointLightHelper, 1)

  return (
    <group {...props} dispose={null}>

      <group ref={tetrahedronRef} rotation={[Math.PI / 6, 0, 0]} scale={0.45}>
        <mesh>
          <tetrahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial opacity={0.1} color="purple" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial opacity={0.1} color="blue" />
        </mesh>
      </group>

      <pointLight ref={light} position={[0, 0, 0]} intensity={1} />
      <mesh
        geometry={nodes.CubeStyle.geometry}
        position={[0, 0, 0]}
        scale={9.58}
        material={modifiedMaterials}
      />

    </group>
  )
}

useGLTF.preload(url)
