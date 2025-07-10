import React, { useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function Tunnel(props) {
  // Commenting out the unused GLTF load
  // const { nodes } = useGLTF('/Core_values_smaller-transformed.glb')

  // Load both the color and displacement textures
  const [colorMap, displacementMap] = useTexture([
    '/microbialTenements_COLOR.jpg',
    '/microbialTenements_DISP.jpg',
  ])

  // Ensure the textures repeat correctly
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping
  colorMap.repeat.set(1, 1)
  displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping
  displacementMap.repeat.set(1, 1)

  const { nodes, materials } = useGLTF(
    '/Core_values_smaller_uv-transformed.glb'
  )
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cylinder006.geometry}
        position={[0, 5.599, 0]}
        scale={10}
      >
        <meshStandardMaterial
          map={colorMap}
          displacementMap={displacementMap}
          displacementScale={0.2} // Adjust this value to control the intensity
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/Core_values_smaller_uv-transformed.glb')
