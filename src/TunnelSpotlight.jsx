import { SpotLight } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import { Object3D } from "three";

export default function TunnelSpotlight(props) {
    const target = useMemo(() => new Object3D(), []);
    const spotLightRef = useRef();

    const brightState = useMemo(() => ({
        intensity: 0,
        angle: 0.1,
        penumbra: 0.7,
        distance: 36,
        decay: 2.0,
        anglePower: 8.7,
        radiusBottom: 34.9,
    }), []);

    const dimState = useMemo(() => ({
        intensity: 0,
        // angle: 2.71,
        // penumbra: 0.56,
        distance: 31,
        decay: 2,
        anglePower: 8.0,
        radiusBottom: 44.7,
    }), []);

    const scale = 16;
    const color = "gold";
    const targetPosition = [0, 10, 0];


    return (
        <group {...props} scale={scale} rotation={[0, 0, 0]}>
            <SpotLight
                ref={spotLightRef}
                target={target}
                position={[0, 0, 0]}
                color={color}
                {...dimState}
            />
            <primitive object={target} position={targetPosition} />
        </group>
    );
}