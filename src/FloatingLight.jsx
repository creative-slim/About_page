import { useRef } from 'react';
// import { useHelper } from '@react-three/drei';
// import { PointLightHelper } from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * FloatingLight
 * Renders a PointLight with a Drei PointLightHelper for visualization.
 * 
 * @param {object} props - Props to pass to the PointLight (e.g., position, intensity, color)
 */
export default function FloatingLight(props) {
    const lightRef = useRef();
    const lightRef2 = useRef();

    // useHelper(lightRef, PointLightHelper, 0.2, 'red');
    // useHelper(lightRef2, PointLightHelper, 0.2, 'blue');
    useFrame((state) => {
        const t = state.clock.getElapsedTime() / 1;
        lightRef.current.position.x = Math.sin(t) * 5;
        lightRef.current.position.z = -Math.cos(t) * 16;
        lightRef.current.position.y = (Math.cos(t) * 2) - 2;



        lightRef2.current.position.x = -Math.sin(t - 1.5) * 5;
        lightRef2.current.position.z = -Math.cos(t - 1.5) * 16;
        lightRef2.current.position.y = (Math.cos(t - 1.5) * 2) - 2;
    });
    return (
        <>
            <pointLight ref={lightRef} {...props} intensity={30}
                //  distance={10}
                color="hotpink" />

            <pointLight ref={lightRef2} {...props} intensity={30}
                //  distance={10}
                color="yellow" />
        </>
    );
}
