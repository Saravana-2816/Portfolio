export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uBurst;
uniform float uFade;
uniform float uPixelRatio;
uniform float uDistance;
uniform vec3 uPointer;
uniform float uRadius;
uniform vec3 uSignal;
uniform vec3 uGlow;
uniform vec3 uEmber;
uniform vec3 uDust;
uniform float uDark;
uniform float uNameParticleScale;

attribute vec3 aScatter;
attribute vec4 aRand;
attribute float aName;
attribute float aSpan;

varying vec3 vColor;
varying float vAlpha;

float easeInOut(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  // Assembly sweeps left to right across the name, with a little scatter.
  float introDelay = aSpan * 0.42 + aRand.x * 0.18;
  float ti = easeInOut(clamp(uIntro * 1.6 - introDelay, 0.0, 1.0));

  // Scroll burst releases particles in a random order.
  float tb = easeInOut(clamp(uBurst * 1.45 - aRand.y * 0.45, 0.0, 1.0));

  float assembled = aName * ti * (1.0 - tb);

  // The latent cloud orbits slowly, so the space never looks frozen.
  vec3 sc = aScatter;
  float ang = uTime * (0.012 + aRand.z * 0.018);
  float c = cos(ang);
  float s = sin(ang);
  sc.xz = vec2(c * sc.x - s * sc.z, s * sc.x + c * sc.z);
  sc.y += sin(uTime * 0.24 + aRand.w * 6.2831) * 18.0;

  // Resting name particles breathe instead of sitting still.
  vec3 home = position;
  home.x += sin(uTime * 1.25 + aRand.z * 6.2831) * 0.6;
  home.y += cos(uTime * 1.05 + aRand.w * 6.2831) * 0.6;

  vec3 pos = mix(sc, home, assembled);

  // Mid-flight particles arc through depth rather than sliding flat.
  float flight = assembled * (1.0 - assembled) * 4.0;
  pos.z += flight * (aRand.x - 0.35) * 280.0;

  // The pointer parts the name like a hand through smoke.
  vec2 d = pos.xy - uPointer.xy;
  float dist = length(d);
  float f = (1.0 - smoothstep(0.0, uRadius, dist)) * uPointer.z * assembled;
  f = f * f;
  pos.xy += (d / max(dist, 0.001)) * f * (30.0 + aRand.x * 50.0);
  pos.z += f * (aRand.y * 140.0 - 40.0);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float depth = -mv.z;
  float ambientBase = 2.2 + aRand.z * 2.4;
  float nameBase = (3.5 + aRand.z * 1.6) * uNameParticleScale;
  float baseSize = mix(ambientBase, nameBase, aName);
  gl_PointSize = clamp(baseSize * uDistance / max(depth, 1.0), 1.5, 52.0) * uPixelRatio;

  // Blue and cyan gradient across name letters with sparkling bright particles
  vec3 nameColor = mix(uSignal, uGlow, smoothstep(0.05, 1.0, aSpan));
  nameColor = mix(nameColor, vec3(1.0), step(0.92, aRand.w) * uDark * 0.6);

  // Vibrant blue and cyan palette for ambient background particles
  vec3 dustColor = mix(uSignal, uGlow, aRand.w);
  // Add crisp luminous highlights
  dustColor = mix(dustColor, vec3(0.92, 0.96, 1.0), step(0.88, aRand.x) * 0.45);
  // Subtle dust tint on a few background points
  dustColor = mix(dustColor, uDust, step(0.75, aRand.z) * 0.3);
  // Rare warm ember accent (1.5%)
  dustColor = mix(dustColor, uEmber, step(0.985, aRand.y));

  float nameMix = aName * ti * (1.0 - tb * 0.55);
  vColor = mix(dustColor, nameColor, nameMix);

  float nearFade = smoothstep(30.0, 240.0, depth);
  float farFade = 1.0 - smoothstep(uDistance * 2.5, uDistance * 3.8, depth);
  float dustAlpha = (0.44 + aRand.z * 0.48) * mix(0.95, 1.35, uDark);
  float a = mix(dustAlpha, 1.0, nameMix);
  a *= 0.82 + 0.18 * sin(uTime * (0.6 + aRand.x * 1.2) + aRand.y * 6.2831);

  vAlpha = a * nearFade * farFade * mix(uFade, 1.0, assembled);
}
`

export const fragmentShader = /* glsl */ `
uniform float uDark;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  // Crisp disc so particles stay clearly defined, plus radiant halo in dark theme
  float core = 1.0 - smoothstep(0.36, 0.5, d);
  float halo = (1.0 - smoothstep(0.0, 0.5, d)) * 0.55 * uDark;
  float a = max(core, halo) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}
`
