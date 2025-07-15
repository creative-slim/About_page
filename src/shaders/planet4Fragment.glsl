varying vec2 vUv;
uniform float uTime;

// Simplex 2D noise
// ... (omitting the full noise function for brevity, as it's the same as in previous shaders)
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
        value += amplitude * snoise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = vUv * 3.0;
    
    // Create a turbulent surface with multiple layers of noise
    float noise1 = fbm(st + uTime * 0.1);
    float noise2 = fbm(st * 2.0 + uTime * 0.2);
    
    // Combine the noise layers to create a fiery pattern
    float pattern = noise1 * 0.7 + noise2 * 0.3;
    
    // Define colors for the star
    vec3 hotColor = vec3(1.0, 0.9, 0.5);   // Bright yellow
    vec3 coolColor = vec3(1.0, 0.5, 0.0);  // Orange
    
    // Mix the colors based on the noise pattern
    vec3 finalColor = mix(coolColor, hotColor, pattern);
    
    // Add a glowing edge
    float edge = 1.0 - length(vUv - 0.5) * 2.0;
    finalColor += vec3(1.0, 0.8, 0.2) * pow(edge, 3.0);

    gl_FragColor = vec4(finalColor, 1.0);
} 