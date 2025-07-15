

import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { Quaternion, Euler } from 'three';

gsap.registerPlugin(Observer);

const ROTATION_DELAY_PERCENTAGE = 20; // 20% delay

const CameraAnimator = ({ camera }) => {
    const keyframes = useMemo(() => [
        {
            // outside init view
            position: { x: 17.3628835502475, y: 36.758520371048945, z: 17.037901901535783 },
            rotation: { _x: 0.40718060017778546, _y: 0.7348013261511338, _z: -0.2814726972616696, _order: 'XYZ' },
            isStop: true,
        },
        {
            // outside upper hole
            position: { x: -0.06938488325086498, y: 42.68094603885234, z: -0.049369656348180094 },
            rotation: { _x: -1.5707955998925296, _y: 6.8674081354919e-7, _z: 0.7569958381339843, _order: 'XYZ' },
            isStop: false,
        },
        {
            // upper core view
            position: { x: -3.1747911574214854e-7, y: 7.589554049203062, z: 0.000007583248543251447 },
            rotation: { _x: -1.5707953276257103, _y: -4.1831063283398486e-8, _z: -0.041841411590519406, _order: 'XYZ' },
            isStop: false,
        },
        {
            // side core view
            position: { x: -0.054029837319530975, y: 0, z: 4.8736504251344983 },
            rotation: { _x: 0, _y: -0.013868339171690202, _z: -0.0014805219129232648, _order: 'XYZ' },
            isStop: true,
        },
        {
            // under core view
            position: { x: -3.1747911574214854e-7, y: -7.589554049203062, z: 0.000007583248543251447 },
            rotation: { _x: -1.5707953276257103, _y: -4.1831063283398486e-8, _z: -0.041841411590519406, _order: 'XYZ' },
            isStop: false,
        },
        {
            // lower hole view
            position: { x: -0.000019115641921253005, y: -45.697250784397504, z: 0.00004565927539634772 },
            rotation: { _x: -1.5707953276259181, _y: -4.183105458202553e-8, _z: -0.04184141158188779, _order: 'XYZ' },
            isStop: false,
        },
        {
            // planet view 1
            position: { x: 1.6970444098817885, y: -65.46955005464174, z: 17.776427428447597 },
            rotation: { _x: -0.38592030984445913, _y: 0.07630814195884743, _z: 0.030963550071904402, _order: 'XYZ' },
            isStop: true,
        },
        {
            // planet view 2
            position: { x: -16.25836736329672, y: -68.84536753577574, z: -2.9969371624785106 },
            rotation: { _x: -2.2754359193376157, _y: -1.2269465346167219, _z: -2.3053301107825277, _order: 'XYZ' },
            isStop: true,
        },
        {
            // planet view 3
            position: { x: 17.097723144575077, y: -79.60039050768052, z: 1.6491652946483992 },
            rotation: { _x: 1.241694137535137, _y: 0.94122065545386, _z: -1.17101903921409, _order: 'XYZ' },
            isStop: true,
        },
        {
            // planet view 4
            position: { x: 8.425163974290601, y: -70.34490876083078, z: -16.652574774350892 },
            rotation: { _x: -3.059242408854568, _y: 0.3086930555387755, _z: 3.1165220624199064, _order: 'XYZ' },
            isStop: true,
        },
    ], []);

    const isAnimating = useRef(false);
    const currentIndex = useRef(0);

    const stopIndexes = useMemo(() => {
        return keyframes.reduce((acc, frame, index) => {
            if (frame.isStop !== false) {
                acc.push(index);
            }
            return acc;
        }, []);
    }, [keyframes]);

    useEffect(() => {
        if (!camera) return;

        const { position: initialPos, rotation: initialRot } = keyframes[0];
        camera.position.set(initialPos.x, initialPos.y, initialPos.z);
        camera.rotation.set(initialRot._x, initialRot._y, initialRot._z, initialRot._order);

        function goToSection(targetIndex) {
            if (isAnimating.current || currentIndex.current === targetIndex) return;
            isAnimating.current = true;

            const direction = targetIndex > currentIndex.current ? 1 : -1;
            const animationPath = [];
            let currentPathIndex = currentIndex.current;

            while (currentPathIndex !== targetIndex) {
                currentPathIndex += direction;
                animationPath.push(keyframes[currentPathIndex]);
            }

            if (animationPath.length === 0) {
                isAnimating.current = false;
                return;
            }

            const positionKeyframes = animationPath.map(frame => frame.position);
            const quaternionKeyframes = animationPath.map(frame => {
                const euler = new Euler(frame.rotation._x, frame.rotation._y, frame.rotation._z, frame.rotation._order);
                const q = new Quaternion().setFromEuler(euler);
                return { x: q.x, y: q.y, z: q.z, w: q.w };
            });

            const duration = animationPath.length * 1;

            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimating.current = false;
                    currentIndex.current = targetIndex;
                }
            });

            tl.to(camera.position, {
                keyframes: positionKeyframes,
                duration: duration,
                ease: "power1.inOut"
            });

            tl.to(camera.quaternion, {
                keyframes: quaternionKeyframes,
                duration: duration,
                ease: "power1.inOut"
            }, "<");
        }

        const observer = Observer.create({
            type: "wheel,touch,pointer",
            wheelSpeed: -1,
            onUp: () => {
                const currentStopIndexInArray = stopIndexes.indexOf(currentIndex.current);
                if (currentStopIndexInArray < stopIndexes.length - 1) {
                    goToSection(stopIndexes[currentStopIndexInArray + 1]);
                }
            },
            onDown: () => {
                const currentStopIndexInArray = stopIndexes.indexOf(currentIndex.current);
                if (currentStopIndexInArray > 0) {
                    goToSection(stopIndexes[currentStopIndexInArray - 1]);
                }
            },
            tolerance: 10,
            preventDefault: true,
        });

        return () => {
            observer.kill();
        };
    }, [camera, keyframes, stopIndexes]);

    return null;
};

export default CameraAnimator; 