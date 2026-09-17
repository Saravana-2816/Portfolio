import * as React from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ScrollTrigger } from "@/lib/gsap"
import { field, markFieldReady, onNameSample } from "@/components/three/fieldState"
import { fragmentShader, vertexShader } from "@/components/three/shaders"

const FOV = 35

const PALETTES = {
  dark: { signal: "#7c9cff", glow: "#7fe3ff", ember: "#ff8a4c", dust: "#9aa3c7" },
  light: { signal: "#2f4bd8", glow: "#0a7fa8", ember: "#cf4a14", dust: "#5d6688" },
} as const

type Theme = keyof typeof PALETTES

function rng(seed: number) {
  let s = seed >>> 0
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}

function gaussian(random: () => number) {
  const u = Math.max(random(), 1e-6)
  const v = random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/**
 * The cloud reads as an embedding space: most points gather in a handful of
 * soft clusters, the rest drift loose between them.
 */
function buildGeometry(ambientCount: number, width: number, height: number) {
  const name = field.name
  const nameCount = name?.count ?? 0
  const total = nameCount + ambientCount
  const random = rng(1664525 + nameCount)
  const R = Math.max(width, height)

  const position = new Float32Array(total * 3)
  const scatter = new Float32Array(total * 3)
  const rand = new Float32Array(total * 4)
  const isName = new Float32Array(total)
  const span = new Float32Array(total)

  const clusters = Array.from({ length: 9 }, () => [
    (random() - 0.5) * R * 1.5,
    (random() - 0.5) * R * 0.8,
    -R * 1.1 + random() * R * 1.35,
    R * (0.07 + random() * 0.1),
  ])

  for (let i = 0; i < total; i++) {
    let x: number
    let y: number
    let z: number
    if (random() < 0.62) {
      const [cx, cy, cz, spread] = clusters[Math.floor(random() * clusters.length)]
      x = cx + gaussian(random) * spread
      y = cy + gaussian(random) * spread * 0.8
      z = cz + gaussian(random) * spread
    } else {
      x = (random() - 0.5) * R * 2.2
      y = (random() - 0.5) * R * 1.3
      z = -R * 1.4 + random() * R * 1.9
    }
    scatter[i * 3] = x
    scatter[i * 3 + 1] = y
    scatter[i * 3 + 2] = z

    rand[i * 4] = random()
    rand[i * 4 + 1] = random()
    rand[i * 4 + 2] = random()
    rand[i * 4 + 3] = random()

    if (name && i < nameCount) {
      position[i * 3] = name.positions[i * 3]
      position[i * 3 + 1] = name.positions[i * 3 + 1]
      position[i * 3 + 2] = 0
      isName[i] = 1
      span[i] = name.spans[i]
    } else {
      position[i * 3] = x
      position[i * 3 + 1] = y
      position[i * 3 + 2] = z
      span[i] = random()
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3))
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3))
  geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4))
  geometry.setAttribute("aName", new THREE.BufferAttribute(isName, 1))
  geometry.setAttribute("aSpan", new THREE.BufferAttribute(span, 1))
  // Points travel far outside their rest positions; never frustum-cull them.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), R * 10)
  return geometry
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Field({ theme }: { theme: Theme }) {
  const { size, camera, gl } = useThree()
  const [nameVersion, setNameVersion] = React.useState(field.nameVersion)
  const groupRef = React.useRef<THREE.Group>(null)
  const smooth = React.useRef({ burst: field.burst, px: 0, py: 0, pz: 0, scroll: 0 })
  const framesRef = React.useRef(0)
  const maxScrollRef = React.useRef(1)

  // Reading scrollHeight every frame would force a layout whenever the DOM changed.
  React.useEffect(() => {
    const measure = () => {
      maxScrollRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }
    measure()
    ScrollTrigger.addEventListener("refresh", measure)
    return () => ScrollTrigger.removeEventListener("refresh", measure)
  }, [])

  React.useEffect(() => onNameSample(() => setNameVersion(field.nameVersion)), [])

  const ambientCount = size.width < 768 ? 1400 : size.width < 1280 ? 2600 : 3400

  // Rebuild only when the sampled name changes or the viewport class changes.
  const geometry = React.useMemo(
    () => buildGeometry(ambientCount, size.width, size.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nameVersion, ambientCount]
  )
  React.useEffect(() => () => geometry.dispose(), [geometry])

  const material = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uIntro: { value: 0 },
          uBurst: { value: 0 },
          uFade: { value: 1 },
          uPixelRatio: { value: 1 },
          uDistance: { value: 1000 },
          uPointer: { value: new THREE.Vector3(0, 0, 0) },
          uRadius: { value: 150 },
          uSignal: { value: new THREE.Color(PALETTES[theme].signal) },
          uGlow: { value: new THREE.Color(PALETTES[theme].glow) },
          uEmber: { value: new THREE.Color(PALETTES[theme].ember) },
          uDust: { value: new THREE.Color(PALETTES[theme].dust) },
          uDark: { value: theme === "dark" ? 1 : 0 },
        },
      }),
    // Theme changes are eased in the frame loop, not by rebuilding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  React.useEffect(() => () => material.dispose(), [material])

  React.useEffect(() => {
    material.blending = theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending
    material.needsUpdate = true
  }, [theme, material])

  const targets = React.useMemo(() => {
    const p = PALETTES[theme]
    return {
      signal: new THREE.Color(p.signal),
      glow: new THREE.Color(p.glow),
      ember: new THREE.Color(p.ember),
      dust: new THREE.Color(p.dust),
      dark: theme === "dark" ? 1 : 0,
    }
  }, [theme])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const k = (base: number) => 1 - Math.pow(1 - base, dt * 60)
    const u = material.uniforms
    const s = smooth.current

    s.burst += (field.burst - s.burst) * k(0.14)
    s.px += (field.pointer.x - s.px) * k(0.12)
    s.py += (field.pointer.y - s.py) * k(0.12)
    s.pz += (field.pointer.active - s.pz) * k(0.06)

    s.scroll += (window.scrollY / maxScrollRef.current - s.scroll) * k(0.08)

    const distance = size.height / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)))
    const eased = easeInOut(Math.min(1, s.burst))

    u.uTime.value = state.clock.elapsedTime
    u.uIntro.value = field.intro
    u.uBurst.value = s.burst
    u.uFade.value = 1 - 0.55 * THREE.MathUtils.smoothstep(s.burst, 0.55, 1)
    u.uPixelRatio.value = gl.getPixelRatio()
    u.uDistance.value = distance
    u.uPointer.value.set(s.px, s.py, s.pz)

    const tk = k(0.05)
    ;(u.uSignal.value as THREE.Color).lerp(targets.signal, tk)
    ;(u.uGlow.value as THREE.Color).lerp(targets.glow, tk)
    ;(u.uEmber.value as THREE.Color).lerp(targets.ember, tk)
    ;(u.uDust.value as THREE.Color).lerp(targets.dust, tk)
    u.uDark.value += (targets.dark - u.uDark.value) * tk

    // Fly the camera into the cloud as the hero scrolls away.
    const parallax = 1 - eased
    camera.position.set(s.px * 0.018 * parallax, s.py * 0.018 * parallax, distance * (1 - 0.74 * eased))
    camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, -distance)
    ;(camera as THREE.PerspectiveCamera).far = distance * 4
    camera.updateProjectionMatrix()

    const group = groupRef.current
    if (group) {
      group.rotation.y = eased * 0.32 + s.scroll * eased * 0.9
      group.rotation.x = s.scroll * eased * 0.18
    }

    // Two painted frames guarantees the canvas has content before the hero reveals.
    if (!field.ready && ++framesRef.current > 1) markFieldReady()
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}

export default function LatentField({ theme }: { theme: Theme }) {
  const [active, setActive] = React.useState(() => !document.hidden)
  const coarse = React.useMemo(() => window.matchMedia("(pointer: coarse)").matches, [])

  React.useEffect(() => {
    const onVisibility = () => setActive(!document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      field.pointer.x = e.clientX - window.innerWidth / 2
      field.pointer.y = window.innerHeight / 2 - e.clientY
      field.pointer.active = e.pointerType === "mouse" ? 1 : 0
    }
    const onLeave = () => {
      field.pointer.active = 0
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <Canvas
      aria-hidden
      linear
      flat
      dpr={[1, coarse ? 1.5 : 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: FOV, near: 1, far: 6000, position: [0, 0, 1000] }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", animation: "field-in 1.4s ease-out both" }}
    >
      <Field theme={theme} />
    </Canvas>
  )
}
