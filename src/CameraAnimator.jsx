

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Quaternion, Euler } from 'three';

gsap.registerPlugin(Observer, ScrollToPlugin);

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
            // position: { x: 3.339858610473614, y: -101.5029744155989, z: 20.313716645488213 },
            position: { x: 1.6047119490087454, y: -98.72115127801608, z: 18.893683903531006 },
            // rotation: { _x: 0.20930891897987944, _y: 0.21779383309013106, _z: -0.0458667101949098, _order: 'XYZ' },
            rotation: { _x: -0.3490453370804087, _y: 0.6984889955629797, _z: 0.22990221915186831, _order: 'XYZ' },
            isStop: true,
        },
        {
            // planet view 2
            // position: { x: 13.632149687985237, y: -99.07015278669614, z: -0.7440035712238711 },
            position: { x: 12.726952855073389, y: -99.5900095865595, z: 0.5205852512564094 },
            // rotation: { _x: -2.792255418208378, _y: 1.1344650560472118, _z: 2.8227118254898356, _order: 'XYZ' },
            rotation: { _x: -0.31662725064338043, _y: 0.873561372846698, _z: 0.24609228475690675, _order: 'XYZ' },
            isStop: true,
        },
        {
            // planet view 3
            // position: { x: -0.9634800738151164, y: -98.00651173840237, z: -31.456137061613965 },
            position: { x: -1.16235422608072, y: -99.15080726204036, z: -29.917418335104134 },
            // rotation: { _x: -2.879125186234779, _y: 0.20035618386383716, _z: 3.08817417025816, _order: 'XYZ' },
            rotation: { _x: -2.9613758698661896, _y: 0.2032296270184101, _z: 3.1048364564829893, _order: 'XYZ' },
            isStop: true,
        },
        {
            // planet view 4
            // position: { x: -25.582261606114098, y: -97.46407831086755, z: -4.869789462729691 },
            position: { x: -25.044965280668052, y: -98.8588626510133, z: -1.0348725218432429 },
            // rotation: { _x: -2.3153424995520178, _y: -1.0378854059748601, _z: -2.3899091072511887, _order: 'XYZ' },
            rotation: { _x: -0.7986867154143862, _y: -1.2835984592813763, _z: -0.7777780515115938, _order: 'XYZ' },
            isStop: true,
        },
        {
            // planet view 5
            // position: { x: 0.15880480756551013, y: -36.920574465531026, z: -0.6025197693219155 },
            position: { x: -0.46575590358808955, y: -42.61766865647644, z: 0.1981074209468065 },
            // rotation: { _x: -1.5707970756557132, _y: 6.627273023696519e-7, _z: 2.4171377999078785, _order: 'XYZ' },
            rotation: { _x: -1.570796372792578, _y: -9.98941546315357e-7, _z: -1.6168102433756835, _order: 'XYZ' },
            isStop: true,
        },
    ], []);

    const isAnimating = useRef(false);
    const currentIndex = useRef(0);
    const currentSectionIndex = useRef(0);

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

            const quaternionKeyframes = animationPath.map(frame => {
                const euler = new Euler(frame.rotation._x, frame.rotation._y, frame.rotation._z, frame.rotation._order);
                return new Quaternion().setFromEuler(euler);
            });

            // Ensure shortest path for quaternion interpolation
            let prevQuat = camera.quaternion.clone();
            quaternionKeyframes.forEach(q => {
                if (prevQuat.dot(q) < 0) {
                    q.x *= -1;
                    q.y *= -1;
                    q.z *= -1;
                    q.w *= -1;
                }
                prevQuat.copy(q);
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimating.current = false;
                    currentIndex.current = targetIndex;
                }
            });

            const segmentDuration = 1;

            animationPath.forEach((frame, index) => {
                const isFirst = index === 0;
                const isLast = index === animationPath.length - 1;

                let ease;
                if (animationPath.length === 1) {
                    ease = "power1.inOut";
                } else if (isFirst) {
                    ease = "power1.in";
                } else if (isLast) {
                    ease = "power1.out";
                } else {
                    ease = "none";
                }

                tl.to(camera.position, {
                    ...frame.position,
                    duration: segmentDuration,
                    ease: ease,
                }, ">");

                const targetQuat = quaternionKeyframes[index];
                tl.to(camera.quaternion, {
                    x: targetQuat.x,
                    y: targetQuat.y,
                    z: targetQuat.z,
                    w: targetQuat.w,
                    duration: segmentDuration,
                    ease: ease,
                }, "<");
            });
        }

        const sections = gsap.utils.toArray('#sections-wrapper section');

        const observer = Observer.create({
            type: "wheel,touch,pointer",
            wheelSpeed: -1,
            onUp: () => { // Scroll down
                if (isAnimating.current) return;
                const newSectionIndex = currentSectionIndex.current + 1;
                if (newSectionIndex < sections.length) {
                    currentSectionIndex.current = newSectionIndex;
                    const targetKeyframeIndex = stopIndexes[currentSectionIndex.current];
                    if (targetKeyframeIndex !== undefined) {
                        goToSection(targetKeyframeIndex);
                        gsap.to(window, {
                            scrollTo: { y: sections[currentSectionIndex.current], autoKill: false },
                            duration: 1,
                            ease: 'power1.inOut'
                        });
                    }
                }
            },
            onDown: () => { // Scroll up
                if (isAnimating.current) return;
                const newSectionIndex = currentSectionIndex.current - 1;
                if (newSectionIndex >= 0) {
                    currentSectionIndex.current = newSectionIndex;
                    const targetKeyframeIndex = stopIndexes[currentSectionIndex.current];
                    if (targetKeyframeIndex !== undefined) {
                        goToSection(targetKeyframeIndex);
                        gsap.to(window, {
                            scrollTo: { y: sections[currentSectionIndex.current], autoKill: false },
                            duration: 1,
                            ease: 'power1.inOut'
                        });
                    }
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