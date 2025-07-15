import React, { useRef, useMemo } from 'react'
import { useGLTF, useTexture, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// const url = '/Core_Values_final_uv2-transformed.glb'
const url = '/tunnel_2-transformed.glb'

export function Tunnel(props) {
  // Commenting out the unused GLTF load
  // const { nodes } = useGLTF('/Core_values_smaller-transformed.glb')

  // Load both the color and displacement textures
  const colorMapUrl = '/Terrain_Material_tube.png'
  // const colorMapUrl = "microbialTenements_COLOR.jpg"
  // const displacementMapUrl = '/microbialTenements_DISP.jpg'

  let colorMap = null

  colorMap = useTexture(colorMapUrl)
  // colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping
  // colorMap.repeat.set(1, 1)

  const { nodes, materials } = useGLTF(url)

  const light = useRef()
  const tetrahedronRef = useRef()
  const rotationDirection = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ));
  const lastUpdateTime = useRef(0);
  const material = materials['Material.002']

  const modifiedMaterials = useMemo(() => {

    material.side = THREE.FrontSide
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
      {/* <meshPhysicalMaterial
          metalness={0.5}
          roughness={1}
          // wireframe
          map={colorMap}
          side={THREE.FrontSide}
        />
      </mesh> */}

      {/* <ambientLight intensity={5} /> */}
    </group>
  )
}

useGLTF.preload(url)
