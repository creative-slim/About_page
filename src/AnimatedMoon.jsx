import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const remoteImages = {
    color:
        "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_color_4x_blobby.webp",
    normal:
        "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_normal_4x_blobby.webp",
    height:
        "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/terrain_height_4x_blobby.webp",
    moonTexture:
        "https://files.creative-directors.com/creative-website/creative25/scenes_imgs/moonTextur_Small.jpeg",
};

// const img = remoteImages;

// Component to handle the moon with color animation
export const AnimatedMoon = ({
    position,
    rotation,
    scale,
    img = remoteImages,
}) => {
    const meshRef = useRef();
    const materialRef = useRef();

    // Memoize texture loading so it only happens once per prop change
    const colorMap = useMemo(() => {
        const texture = new THREE.TextureLoader().load(img.color, (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(1, 1);
        });
        return texture;
    }, [img.color]);

    const normalMap = useMemo(() => {
        const texture = new THREE.TextureLoader().load(img.normal, (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(1, 1);
        });
        return texture;
    }, [img.normal]);

    const displacementMap = useMemo(() => {
        return new THREE.TextureLoader().load(img.height);
    }, [img.height]);

    const alphaMap = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext("2d");

        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "black";
        context.beginPath();
        context.arc(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 46, // Hole radius
            0,
            Math.PI * 2
        );
        context.fill();

        return new THREE.CanvasTexture(canvas);
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            // Oscillate between purple (270) and blue (240) hues
            const time = state.clock.getElapsedTime();
            // const hue = 200 + Math.sin(time * 0.2) * 1; // Oscillate between ~225 and ~255
            const hue = 150;
            materialRef.current.color = new THREE.Color(`hsl(${hue}, 70%, 80%)`);
        }
    });

    return (
        <mesh
            ref={meshRef}
            name="moon"
            position={position}
            rotation={rotation}
            scale={scale}
        >
            <planeGeometry args={[50, 50, 64, 64]} />
            <meshPhysicalMaterial
                ref={materialRef}
                roughness={0.8}
                metalness={0.2}
                map={colorMap}
                normalMap={normalMap}
                displacementMap={displacementMap}
                displacementScale={5}
                displacementBias={0}
                alphaMap={alphaMap}
                transparent={true}
            />
        </mesh>
    );
}; 