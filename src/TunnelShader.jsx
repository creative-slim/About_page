
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import vertexShader from './tunnelVertex.glsl'
import fragmentShader from './tunnelFragment.glsl'

const TunnelShader = shaderMaterial(
    {
        uTime: 0,
        uColor1: new THREE.Color(0x3a0ca3), // dark purple
        uColor2: new THREE.Color(0x4cc9f0), // bright blue
        uColor3: new THREE.Color(0xade8f4), // light cyan/white for glow
    },
    vertexShader,
    fragmentShader
)

export default TunnelShader 