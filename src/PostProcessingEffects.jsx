import React, { useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
    Bloom,
    EffectComposer,
    Noise,
    ChromaticAberration,
    Glitch,
} from '@react-three/postprocessing';
import { Vector2, Vector3 } from 'three';
import { GlitchMode } from 'postprocessing';


const PostProcessingEffects = () => {
    const { camera } = useThree();
    const center = useMemo(() => new Vector3(0, 2, 0), []);

    const [noiseOpacity, setNoiseOpacity] = useState(0);
    const [chromaticOffset, setChromaticOffset] = useState(new Vector2(0, 0));
    const [glitchStrength, setGlitchStrength] = useState(new Vector2(0, 0));
    const [glitchActive, setGlitchActive] = useState(false);

    useFrame(() => {
        const distance = camera.position.distanceTo(center);
        let intensity = 0;
        if (distance < 15) {
            intensity = Math.max(0, (15 - distance) / 15);
        }

        setNoiseOpacity(intensity * 0.1);

        setChromaticOffset(new Vector2(intensity * 0.005, intensity * 0.005));

        if (intensity > 0.05) {
            setGlitchActive(true);
            setGlitchStrength(new Vector2(intensity * 0.05, intensity * 0.1));
        } else {
            setGlitchActive(false);
            setGlitchStrength(new Vector2(0, 0));
        }
    });

    return (
        <EffectComposer>
            <Bloom
                intensity={5.5}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur={true}
            />
            <Noise opacity={noiseOpacity} />
            <ChromaticAberration offset={chromaticOffset} />
            {/* <Glitch
                delay={new Vector2(1.5, 3.5)}
                duration={new Vector2(0.2, 0.5)}
                strength={glitchStrength}
                // mode={GlitchMode.SPORADIC}
                active={glitchActive}
                ratio={0.85}
            /> */}
        </EffectComposer>
    );
};

export default PostProcessingEffects; 