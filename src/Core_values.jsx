import React, { useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function Tunnel(props) {
  const { nodes } = useGLTF('/Core_values_smaller-transformed.glb')

  // Load the new texture
  const colorMap = useTexture('sci-fi-nebula-space-planet_4K.jpg')

  // Ensure the texture repeats correctly
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping
  colorMap.repeat.set(1, 1)

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cylinder004.geometry}
        position={[0, 5.599, 0]}
        scale={10}
      >
        <meshStandardMaterial map={colorMap} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/Core_values_smaller-transformed.glb')
