
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermite Curve.  Same as Smoothstep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 corners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main() {
    vec2 uv = vUv;
    float time = uTime * 0.1;

    // Create a flowing effect by adding time to the uv coordinates
    uv.y += time;

    // Use sine functions to create wavy patterns
    float wave1 = sin(uv.y * 10.0 + time * 2.0);
    float wave2 = sin(uv.x * 10.0 + time * 3.0);
    
    // Combine waves and add noise for organic look
    float combined = wave1 * wave2;
    combined += noise(uv * 5.0) * 0.5;

    // Create distinct color bands
    float bands = sin(combined * 10.0);

    // Remap bands from [-1, 1] to [0, 1] to make it easier to work with
    float t = (bands + 1.0) * 0.5;

    // Transition from purple (uColor1) to blue (uColor2) with a wide fade
    vec3 color = mix(uColor1, uColor2, smoothstep(0.2, 0.6, t));

    // Add the white glow (uColor3) on top of that for the highlights
    color = mix(color, uColor3, smoothstep(0.8, 0.95, t));

    gl_FragColor = vec4(color, 1.0);
} 