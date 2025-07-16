import { useRef } from "react";
import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function AnimatedStars(props) {
    const starsRef = useRef();

    useFrame((state, delta) => {
        if (starsRef.current) {
            starsRef.current.rotation.y += delta * 0.01; // Slow rotation
            starsRef.current.rotation.x += delta * 0.002; // Subtle drift
        }
    }); // Reduced from 60fps to 30fps

    return (
        <group ref={starsRef}>
            <Stars {...props} />
        </group>
    );
} 