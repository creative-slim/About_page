import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

import planetVertexShader from "./shaders/planetVertex.glsl";
import planet1FragmentShader from "./shaders/planet1Fragment.glsl";
import planet2FragmentShader from "./shaders/planet2Fragment.glsl";
import planet3FragmentShader from "./shaders/planet3Fragment.glsl";
import planet4FragmentShader from "./shaders/planet4Fragment.glsl";
import planet5FragmentShader from "./shaders/planet5Fragment.glsl";

const Planet1Material = shaderMaterial(
    { uTime: 0 },
    planetVertexShader,
    planet1FragmentShader
);

const Planet2Material = shaderMaterial(
    { uTime: 0 },
    planetVertexShader,
    planet2FragmentShader
);

const Planet3Material = shaderMaterial(
    { uTime: 0 },
    planetVertexShader,
    planet3FragmentShader
);

const Planet4Material = shaderMaterial(
    { uTime: 0 },
    planetVertexShader,
    planet4FragmentShader
);

const Planet5Material = shaderMaterial(
    { uTime: 0 },
    planetVertexShader,
    planet5FragmentShader
);

extend({
    Planet1Material,
    Planet2Material,
    Planet3Material,
    Planet4Material,
    Planet5Material,
});

export {
    Planet1Material,
    Planet2Material,
    Planet3Material,
    Planet4Material,
    Planet5Material,
}; 