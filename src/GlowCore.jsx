/**
 * GlowCore Component - Central Glowing Sphere with Saturn Ring
 * 
 * A React Three Fiber component that renders a glowing sphere at the center
 * with an animated Saturn ring orbiting around it. The sphere uses a custom
 * shader material for the glow effect, and the ring uses the existing
 * SaturnRing component for rainbow animation.
 * 
 * @example Basic Usage
 * ```jsx
 * import GlowCore from './GlowCore';
 * 
 * // Basic usage with default config
 * <GlowCore />
 * 
 * // Custom configuration
 * <GlowCore 
 *   sphereRadius={0.3}
 *   sphereColor="#4a90e2"
 *   ringConfigs={[
 *     { type: 'torus', radius: 0.8, tube: 0.02, opacity: 0.6, speed: 0.3 }
 *   ]}
 *   position={[0, 0, 0]}
 * />
 * ```
 * 
 * @dependencies
 * - @react-three/fiber: ^8.9.1 (for useFrame hook)
 * - @react-three/drei: ^9.43.3 (for Three.js utilities)
 * - three: ^0.149.0 (Three.js core)
 * - react: ^18.0.0 (React core)
 * - SaturnRing component (local)
 * 
 * @props {Object} props - Component props
 * @props {number} [props.sphereRadius=0.25] - Radius of the central sphere
 * @props {string} [props.sphereColor="#4a90e2"] - Color of the sphere glow
 * @props {number} [props.sphereIntensity=1.5] - Glow intensity multiplier
 * @props {Array} [props.ringConfigs] - Custom ring configurations
 * @props {Array} [props.position=[0,0,0]] - Position of the entire component
 * @props {Array} [props.scale=[1,1,1]] - Scale of the entire component
 * @props {Array} [props.rotation=[0,0,0]] - Rotation of the entire component
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, Quaternion, Vector3 } from 'three';
import SaturnRing from './SaturnRing';
import InnerCore from './InnerCore';

/**
 * Creates a custom GLSL shader for the glowing sphere effect
 * @param {string} color - Hex color string for the glow
 * @param {number} intensity - Glow intensity multiplier
 * @returns {Object} Shader configuration with uniforms, vertex and fragment shaders
 */

const ROTATION_SPEED = 0.5;


const getGlowShader = (color = "#4a90e2", intensity = 1.5) => {
  // Convert hex color to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  return {
    uniforms: {
      time: { value: 0 },
      color: { value: new Color(r, g, b) },
      intensity: { value: intensity }
    },
    vertexShader: `
            varying vec3 vNormal;
            varying vec3 vLocalPosition;
            varying vec3 vViewPosition;
            
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vLocalPosition = position;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
    fragmentShader: `
            uniform float time;
            uniform vec3 color;
            uniform float intensity;
            varying vec3 vNormal;
            varying vec3 vLocalPosition;
            varying vec3 vViewPosition;
            
            void main() {
                // Calculate fresnel effect for edge glow
                vec3 viewDirection = normalize(-vViewPosition);
                float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.0);
                
                // Add pulsing animation
                float pulse = sin(time * 2.0) * 0.1 + 0.9;
                
                // Combine effects
                float glow = fresnel * pulse * intensity;
                
                // Create gradient from center to edge
                float distance = length(vLocalPosition);
                float centerGlow = 1.0 - smoothstep(0.0, 0.5, distance);
                
                // Final color with alpha
                vec3 finalColor = color * (glow + centerGlow * 0.3);
                float alpha = (glow + centerGlow * 0.5) * 0.8;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `
  };
};

/**
 * GlowCore component renders a glowing sphere with animated Saturn ring
 * @param {Object} props
 * @param {number} [props.sphereRadius=0.25] - Radius of the central sphere
 * @param {string} [props.sphereColor="#4a90e2"] - Color of the sphere glow
 * @param {number} [props.sphereIntensity=1.5] - Glow intensity multiplier
 * @param {Array} [props.ringConfigs] - Custom ring configurations
 * @param {Array} [props.position=[0,0,0]] - Position of the entire component
 * @param {Array} [props.scale=[1,1,1]] - Scale of the entire component
 * @param {Array} [props.rotation=[0,0,0]] - Rotation of the entire component
 */
export default function GlowCore({
  sphereRadius = 0.25,
  sphereColor = "#4a90e2",
  sphereIntensity = 1.5,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0]
}) {
  // Ring configuration constants
  const RING_AVG_RADIUS = 0.3;
  const RING_POSITION = [0, 0, 0];
  const RING_SCALE = [1, 1, 1];

  const RING_CONFIGS = [
    { type: 'ring', radius: RING_AVG_RADIUS + 0.3, tube: 0.09, opacity: 0.4, speed: 0.5, phase: 0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 0.5, tube: 0.07, opacity: 0.25, speed: 0.7, phase: 1.0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 0.6, tube: 0.05, opacity: 0.15, speed: 0.3, phase: 2.0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 0.7, tube: 0.035, opacity: 0.15, speed: 0.3, phase: 2.0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 0.8, tube: 0.025, opacity: 0.15, speed: 0.3, phase: 2.0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 0.9, tube: 0.018, opacity: 0.15, speed: 0.3, phase: 2.0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 1.0, tube: 0.012, opacity: 0.15, speed: 0.3, phase: 2.0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 1.1, tube: 0.008, opacity: 0.15, speed: 0.3, phase: 2.0 },
    { type: 'ring', radius: RING_AVG_RADIUS + 1.2, tube: 0.005, opacity: 0.15, speed: 0.3, phase: 2.0 },
  ];

  // Create 6 ring systems at different angles (360° / 6 = 60° apart)
  const RING_ANGLES = [0, 60, 120, 180, 240, 300]; // Degrees
  const RING_ROTATIONS = RING_ANGLES.map(angle => [
    Math.PI / 2, // Base horizontal rotation
    (angle * Math.PI) / 180, // Convert degrees to radians for Y rotation
    0
  ]);
  const sphereRef = useRef();
  const ringGroupRefs = useRef([]);

  // Animation loop - updates time uniform for the sphere glow and rotates rings
  useFrame((state, delta) => {
    // Update sphere glow
    if (sphereRef.current && sphereRef.current.material.uniforms) {
      sphereRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }

    // Rotate each ring system on different axes and directions
    ringGroupRefs.current.forEach((ref, index) => {
      if (ref) {
        const rotationSpeed = (ROTATION_SPEED + (index * 0.1)) * delta;
        const direction = index % 2 === 0 ? 1 : -1;

        // Create a small incremental rotation for this frame
        const q = new Quaternion();
        const axis = new Vector3();
        let angle = rotationSpeed * direction;

        // Determine axis based on index
        switch (index) {
          case 0: axis.set(1, 0, 0); break; // X-axis
          case 1: axis.set(0, 1, 0); break; // Y-axis
          case 2: axis.set(0, 0, 1); break; // Z-axis
          case 3: axis.set(1, 0.5, 0).normalize(); break; // X and Y
          case 4: axis.set(0, 1, 0.7).normalize(); break; // Y and Z
          case 5: axis.set(0.6, 0, 1).normalize(); break; // X and Z
        }

        q.setFromAxisAngle(axis, angle);

        // Apply the incremental rotation to the existing quaternion
        ref.quaternion.premultiply(q);
      }
    });
  });

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Central Glowing Sphere */}
      <mesh
        ref={sphereRef}
        raycast={() => null}  // Disable raycasting for performance
        renderOrder={1}  // Render after rings for proper layering
      >
        <sphereGeometry args={[sphereRadius, 64, 64]} />
        <shaderMaterial
          attach="material"
          args={[getGlowShader(sphereColor, sphereIntensity)]}
          transparent
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* New Inner Core with Wavy Shader */}
      <InnerCore radius={sphereRadius} />

      {/* Multiple Saturn Ring Systems at Different Angles */}
      {RING_ROTATIONS.map((rotation, index) => (
        <group
          key={`ring-system-${index}`}
          ref={el => ringGroupRefs.current[index] = el}
          position={RING_POSITION}
          rotation={rotation}
        >
          <SaturnRing
            configs={RING_CONFIGS}
            position={[0, 0, 0]}
            scale={RING_SCALE}
            rotation={[0, 0, 0]}
          />
        </group>
      ))}
    </group>
  );
}
