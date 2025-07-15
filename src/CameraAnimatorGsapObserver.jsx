import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { Quaternion, Euler } from 'three';

gsap.registerPlugin(Observer);

const ROTATION_DELAY_PERCENTAGE = 0; // 20% delay

const CameraAnimator = ({ camera }) => {
    const keyframes = useMemo(() => [
        {
            // outside init view
            position: { x: -7.378988159538815, y: 44.83969206467613, z: 27.10907438530527 },
            rotation: { _x: 0.1662698476176108, _y: -0.3028610863534707, _z: 0.050010724975943686, _order: 'XYZ' },
        },
        {
            // outside upper hole
            position: { x: -0.000019115641921253005, y: 45.697250784397504, z: 0.00004565927539634772 },
            rotation: { _x: -1.5707953276259181, _y: -4.183105458202553e-8, _z: -0.04184141158188779, _order: 'XYZ' },
        },
        {
            // upper core view
            position: { x: -3.1747911574214854e-7, y: 7.589554049203062, z: 0.000007583248543251447 },
            rotation: { _x: -1.5707953276257103, _y: -4.1831063283398486e-8, _z: -0.041841411590519406, _order: 'XYZ' },
        },
        {
            // side core view
            position: { x: -0.054029837319530975, y: 2.4135471665325824, z: 3.8736504251344983 },
            rotation: { _x: -0.10635618743793769, _y: -0.013868339171690202, _z: -0.0014805219129232648, _order: 'XYZ' },
        },
        {
            // lower hole view
            position: { x: -0.000019115641921253005, y: -45.697250784397504, z: 0.00004565927539634772 },
            rotation: { _x: -1.5707953276259181, _y: -4.183105458202553e-8, _z: -0.04184141158188779, _order: 'XYZ' },
        },
        {
            // planet view 1
            position: { x: 1.6970444098817885, y: -65.46955005464174, z: 17.776427428447597 },
            rotation: { _x: -0.38592030984445913, _y: 0.07630814195884743, _z: 0.030963550071904402, _order: 'XYZ' },
        },
        {
            // planet view 2
            position: { x: -16.25836736329672, y: -68.84536753577574, z: -2.9969371624785106 },
            rotation: { _x: -2.2754359193376157, _y: -1.2269465346167219, _z: -2.3053301107825277, _order: 'XYZ' },
        },
        {
            // planet view 3
            position: { x: 17.097723144575077, y: -79.60039050768052, z: 1.6491652946483992 },
            rotation: { _x: 1.241694137535137, _y: 0.94122065545386, _z: -1.17101903921409, _order: 'XYZ' },
        },
        {
            // planet view 4
            position: { x: 8.425163974290601, y: -70.34490876083078, z: -16.652574774350892 },
            rotation: { _x: -3.059242408854568, _y: 0.3086930555387755, _z: 3.1165220624199064, _order: 'XYZ' },
        },
    ], []);

    const isAnimating = useRef(false);
    const currentIndex = useRef(0);

    useEffect(() => {
        if (!camera) return;

        const { position: initialPos, rotation: initialRot } = keyframes[0];
        camera.position.set(initialPos.x, initialPos.y, initialPos.z);
        camera.rotation.set(initialRot._x, initialRot._y, initialRot._z, initialRot._order);

        function goToSection(index) {
            if (isAnimating.current) return;
            isAnimating.current = true;

            currentIndex.current = index;
            const targetFrame = keyframes[index];

            const targetEuler = new Euler(
                targetFrame.rotation._x,
                targetFrame.rotation._y,
                targetFrame.rotation._z,
                targetFrame.rotation._order
            );
            const targetQuaternion = new Quaternion().setFromEuler(targetEuler);

            gsap.to(camera.position, {
                x: targetFrame.position.x,
                y: targetFrame.position.y,
                z: targetFrame.position.z,
                duration: 1,
                ease: "power1.inOut",
            });

            gsap.to(camera.quaternion, {
                x: targetQuaternion.x,
                y: targetQuaternion.y,
                z: targetQuaternion.z,
                w: targetQuaternion.w,
                duration: 1,
                ease: "power1.inOut",
                onComplete: () => {
                    isAnimating.current = false;
                }
            });
        }

        const observer = Observer.create({
            type: "wheel,touch,pointer",
            wheelSpeed: -1,
            onUp: () => {
                if (currentIndex.current < keyframes.length - 1) {
                    goToSection(currentIndex.current + 1);
                }
            },
            onDown: () => {
                if (currentIndex.current > 0) {
                    goToSection(currentIndex.current - 1);
                }
            },
            tolerance: 10,
            preventDefault: true,
        });

        return () => {
            observer.kill();
        };
    }, [camera, keyframes]);

    return null;
};

export default CameraAnimator; 