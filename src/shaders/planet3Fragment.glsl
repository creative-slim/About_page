varying vec2 vUv;
uniform float uTime;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// FBM (Fractional Brownian Motion)
float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    // float frequency = 0.0; // This is not used, commented to avoid confusion
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = vUv * 3.0;
    float n = fbm(st + uTime * 0.05);
    vec3 color = vec3(0.0, 1.0, 0.2) * n;
    gl_FragColor = vec4(color, 1.0);
} 