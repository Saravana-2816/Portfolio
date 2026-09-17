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
  sc.y += sin(uTime * 0.22 + aRand.w * 6.2831) * 16.0;

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
  float baseSize = mix(1.4 + aRand.z * 2.0, 2.6 + aRand.z * 1.1, aName);
  gl_PointSize = clamp(baseSize * uDistance / max(depth, 1.0), 0.0, 42.0) * uPixelRatio;

  vec3 nameColor = mix(uSignal, uGlow, smoothstep(0.05, 1.0, aSpan));
  nameColor = mix(nameColor, vec3(1.0), step(0.94, aRand.w) * uDark * 0.55);

  vec3 dustColor = mix(uDust, uSignal, step(0.62, aRand.w));
  dustColor = mix(dustColor, uGlow, step(0.88, aRand.w));
  dustColor = mix(dustColor, uEmber, step(0.978, aRand.w));

  float nameMix = aName * ti * (1.0 - tb * 0.55);
  vColor = mix(dustColor, nameColor, nameMix);

  float nearFade = smoothstep(30.0, 240.0, depth);
  float farFade = 1.0 - smoothstep(uDistance * 2.3, uDistance * 3.4, depth);
  float dustAlpha = (0.22 + aRand.z * 0.45) * mix(0.9, 1.25, uDark);
  float a = mix(dustAlpha, 1.0, nameMix);
  a *= 0.78 + 0.22 * sin(uTime * (0.7 + aRand.x * 1.5) + aRand.y * 6.2831);

  vAlpha = a * nearFade * farFade * mix(uFade, 1.0, assembled);
}
`

export const fragmentShader = /* glsl */ `
uniform float uDark;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  // A crisp disc so small points stay bright, plus a faint halo in the dark theme.
  float core = 1.0 - smoothstep(0.3, 0.5, d);
  float halo = (1.0 - smoothstep(0.0, 0.5, d)) * 0.35 * uDark;
  float a = max(core, halo) * vAlpha;
  if (a < 0.012) discard;
  gl_FragColor = vec4(vColor, a);
}
`
