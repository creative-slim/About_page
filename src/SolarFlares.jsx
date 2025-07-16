
import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Vector3, Quaternion } from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

/**
 * Configuration for generating individual flares.
 * Base values are the minimum, and range is added randomly.
 * e.g., archHeight = ARCH_HEIGHT_BASE + Math.random() * ARCH_HEIGHT_RANGE
 */
const FLARE_CONFIG = {
    // The minimum height of the flare's arch.
    ARCH_HEIGHT_BASE: 2,
    // The random range added to the base height.
    ARCH_HEIGHT_RANGE: 0,
    // The minimum thickness of the flare's tube.
    TUBE_RADIUS_BASE: 0.05,
    // The random range added to the base thickness.
    TUBE_RADIUS_RANGE: 0,
    // The base scale for the shader's noise pattern.
    NOISE_SCALE_BASE: 1.0,
    // The random range added to the noise scale.
    NOISE_SCALE_RANGE: 3,
    // The base strength of the noise displacement.
    NOISE_STRENGTH_BASE: 1,
    // The random range added to the noise strength.
    NOISE_STRENGTH_RANGE: 0,
    // The base speed for the shader's animation.
    ANIMATION_SPEED_BASE: 4,
    // The random range added to the animation speed.
    ANIMATION_SPEED_RANGE: 0,
    // The minimum lifetime of a flare in seconds.
    LIFETIME_BASE: 3,
    // The random range added to the lifetime.
    LIFETIME_RANGE: 5,
    // The maximum angular distance a flare can span around the eruption point.
    ANGLE_SPAN: Math.PI * 1.5,
};


const getPlasmaShader = ({
    opacity = 1.0,
    speed = 0.5,
    noiseScale = 1.0,
    color1 = new Color('#ff3c00'),
    color2 = new Color('#ffdc00'),
}) => ({
    uniforms: {
        time: { value: 0 },
        speed: { value: speed },
        noiseScale: { value: noiseScale },
        color1: { value: color1 },
        color2: { value: color2 },
        opacity: { value: opacity },
    },
    vertexShader: `
        uniform float time;
        uniform float speed;
        uniform float noiseScale;
        varying float vNoise;
        
        // Classic Perlin 3D Noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
            float t = time * speed;
            vec3 pos = position;
            
            float displacementNoise = snoise(pos * noiseScale + t);
            vec3 displacedPosition = pos + normal * displacementNoise * 0.5;

            vNoise = snoise(pos * noiseScale * 2.0 + t * 0.5);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float opacity;
        varying float vNoise;

        void main() {
            float intensity = smoothstep(-0.5, 1.0, vNoise);
            vec3 finalColor = mix(color1, color2, intensity);
            gl_FragColor = vec4(finalColor, opacity * intensity);
        }
    `
});


const generateFlareCurve = (startPoint, endPoint, archHeight, segments, noiseScale, noiseStrength) => {
    const line = new Vector3().subVectors(endPoint, startPoint);
    const length = line.length();

    // Create intermediate points
    const point1 = new Vector3().copy(startPoint).add(line.clone().multiplyScalar(0.33));
    const point2 = new Vector3().copy(startPoint).add(line.clone().multiplyScalar(0.66));

    // Get radial direction for displacement
    const radial1 = point1.clone().normalize();
    const radial2 = point2.clone().normalize();

    // Get a sideways direction
    const tangent = line.clone().normalize();
    const normal = new Vector3().crossVectors(tangent, radial1).normalize();
    if (normal.lengthSq() === 0) {
        // Handle cases where tangent and radial are parallel by creating a random normal
        const randomVec = new Vector3(Math.random(), Math.random(), Math.random()).normalize();
        normal.crossVectors(tangent, randomVec).normalize();
    }

    // Randomize displacement amounts
    const displacement1 = archHeight * (0.4 + Math.random() * 0.6);
    const displacement2 = archHeight * (0.4 + Math.random() * 0.6);
    const sideways = length * (Math.random() - 0.5) * 0.5;

    // Apply radial and sideways displacement
    point1.add(radial1.multiplyScalar(displacement1));
    point1.add(normal.clone().multiplyScalar(sideways));

    point2.add(radial2.multiplyScalar(displacement2));
    point2.add(normal.clone().multiplyScalar(-sideways)); // opposite direction for an S-curve

    const curve = new CatmullRomCurve3([
        startPoint,
        point1,
        point2,
        endPoint,
    ]);

    const points = curve.getPoints(segments);

    for (let i = 0; i < points.length; i++) {
        const noiseVal = noise3D(points[i].x * noiseScale, points[i].y * noiseScale, points[i].z * noiseScale);
        points[i].add(new Vector3(
            noiseVal * noiseStrength,
            noiseVal * noiseStrength,
            noiseVal * noiseStrength
        ));
    }

    return new CatmullRomCurve3(points);
};

const generateFlareConfig = (eruptionRadius) => {
    const archHeight = FLARE_CONFIG.ARCH_HEIGHT_BASE + Math.random() * FLARE_CONFIG.ARCH_HEIGHT_RANGE;
    const tubeRadius = FLARE_CONFIG.TUBE_RADIUS_BASE + Math.random() * FLARE_CONFIG.TUBE_RADIUS_RANGE;
    const noiseScale = FLARE_CONFIG.NOISE_SCALE_BASE + Math.random() * FLARE_CONFIG.NOISE_SCALE_RANGE;
    const noiseStrength = FLARE_CONFIG.NOISE_STRENGTH_BASE + Math.random() * FLARE_CONFIG.NOISE_STRENGTH_RANGE;
    const speed = FLARE_CONFIG.ANIMATION_SPEED_BASE + Math.random() * FLARE_CONFIG.ANIMATION_SPEED_RANGE;
    const lifetime = FLARE_CONFIG.LIFETIME_BASE + Math.random() * FLARE_CONFIG.LIFETIME_RANGE;

    const startAngle = Math.random() * Math.PI * 2;
    const endAngle = startAngle + (Math.random() - 0.5) * FLARE_CONFIG.ANGLE_SPAN;

    const startPoint = new Vector3(
        Math.cos(startAngle) * eruptionRadius,
        (Math.random() - 0.5) * eruptionRadius * 0.5,
        Math.sin(startAngle) * eruptionRadius
    );

    const endPoint = new Vector3(
        Math.cos(endAngle) * eruptionRadius,
        (Math.random() - 0.5) * eruptionRadius * 0.5,
        Math.sin(endAngle) * eruptionRadius
    );

    return { archHeight, tubeRadius, noiseScale, noiseStrength, speed, lifetime, startPoint, endPoint };
}

function Flare({ eruptionRadius, rotationSpeedMax }) {
    const meshRef = useRef();
    const state = useRef({
        config: generateFlareConfig(eruptionRadius),
        age: 0,
        rotationAxis: new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize(),
        rotationSpeed: Math.random() * rotationSpeedMax,
    });

    const [geometry, setGeometry] = useState(() => {
        const { startPoint, endPoint, archHeight, tubeRadius, noiseScale, noiseStrength } = state.current.config;
        const curve = generateFlareCurve(startPoint, endPoint, archHeight, 64, noiseScale, noiseStrength);
        return new TubeGeometry(curve, 64, tubeRadius, 8, false);
    });

    const material = useMemo(() => {
        return new ShaderMaterial({
            ...getPlasmaShader({
                speed: state.current.config.speed,
                noiseScale: state.current.config.noiseScale,
            }),
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
        });
    }, [state.current.config.speed, state.current.config.noiseScale]);

    const respawn = () => {
        state.current.config = generateFlareConfig(eruptionRadius);
        state.current.age = 0;
        state.current.rotationAxis.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        state.current.rotationSpeed = Math.random() * rotationSpeedMax;

        const newCurve = generateFlareCurve(
            state.current.config.startPoint, state.current.config.endPoint, state.current.config.archHeight, 64,
            state.current.config.noiseScale, state.current.config.noiseStrength
        );

        const newGeometry = new TubeGeometry(newCurve, 64, state.current.config.tubeRadius, 8, false);
        setGeometry(oldGeometry => {
            oldGeometry.dispose();
            return newGeometry;
        });

        material.uniforms.speed.value = state.current.config.speed;
        material.uniforms.noiseScale.value = state.current.config.noiseScale;
    };

    useFrame((_, delta) => {
        state.current.age += delta;

        if (state.current.age > state.current.config.lifetime) {
            respawn();
            return;
        }

        const lifeProgress = state.current.age / state.current.config.lifetime;
        material.uniforms.opacity.value = Math.sin(lifeProgress * Math.PI);

        if (meshRef.current) {
            const q = new Quaternion().setFromAxisAngle(state.current.rotationAxis, delta * state.current.rotationSpeed);
            meshRef.current.quaternion.premultiply(q);
        }
    });

    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function SolarFlares({
    count = 5,
    position = [0, 0, 0],
    scale = [0.1, 0.1, 0.1],
    eruptionRadius = 0.1,
    rotationSpeed = 20,
}) {
    return (
        <group position={position} scale={scale}>
            {Array.from({ length: count }, (_, i) => (
                <Flare key={i} eruptionRadius={eruptionRadius} rotationSpeedMax={rotationSpeed} />
            ))}
        </group>
    );
} 