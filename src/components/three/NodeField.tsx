import * as React from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { BufferGeometry, Float32BufferAttribute, Points, LineSegments, Group } from "three"
import { useThemeColors } from "./useThemeColors"

type NodeFieldProps = {
  theme: "dark" | "light"
  count: number
}

type NodeData = {
  positions: Float32Array
  phases: Float32Array
  speeds: Float32Array
  colorId: Uint8Array
  edges: [number, number][]
}

function buildNodeData(count: number): NodeData {
  const positions = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const speeds = new Float32Array(count)
  const colorId = new Uint8Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 9
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    phases[i] = Math.random() * Math.PI * 2
    speeds[i] = 0.3 + Math.random() * 0.5
    colorId[i] = Math.random() < 0.72 ? 0 : 1
  }

  const edges: [number, number][] = []
  const maxDist = 2.6
  const maxPerNode = 3

  for (let i = 0; i < count; i++) {
    const dists: { j: number; d: number }[] = []
    for (let j = 0; j < count; j++) {
      if (i === j) continue
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < maxDist) dists.push({ j, d })
    }
    dists.sort((a, b) => a.d - b.d)
    for (const { j } of dists.slice(0, maxPerNode)) {
      const key: [number, number] = i < j ? [i, j] : [j, i]
      if (!edges.some(([a, b]) => a === key[0] && b === key[1])) {
        edges.push(key)
      }
    }
  }

  return { positions, phases, speeds, colorId, edges }
}

export function NodeField({ theme, count }: NodeFieldProps) {
  const colors = useThemeColors(theme)
  const { gl } = useThree()
  const pointsRef = React.useRef<Points>(null)
  const linesRef = React.useRef<LineSegments>(null)
  const driftRef = React.useRef<Group>(null)
  const parallaxRef = React.useRef<Group>(null)
  const pointer = React.useRef({ x: 0, y: 0 })
  const canParallax = React.useRef(false)

  const data = React.useMemo(() => buildNodeData(count), [count])

  const pointsGeometry = React.useMemo(() => {
    const geo = new BufferGeometry()
    geo.setAttribute("position", new Float32BufferAttribute(data.positions.slice(), 3))
    return geo
  }, [data])

  const linesGeometry = React.useMemo(() => {
    const geo = new BufferGeometry()
    const linePositions = new Float32Array(data.edges.length * 2 * 3)
    geo.setAttribute("position", new Float32BufferAttribute(linePositions, 3))
    return geo
  }, [data])

  React.useEffect(() => {
    const nodeColor = (id: number) => (id === 0 ? colors.signal : colors.pulse)

    const pointColors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const c = nodeColor(data.colorId[i])
      pointColors[i * 3] = c.r
      pointColors[i * 3 + 1] = c.g
      pointColors[i * 3 + 2] = c.b
    }
    pointsGeometry.setAttribute("color", new Float32BufferAttribute(pointColors, 3))
    pointsGeometry.attributes.color.needsUpdate = true

    const lineColors = new Float32Array(data.edges.length * 2 * 3)
    data.edges.forEach(([a, b], idx) => {
      const ca = nodeColor(data.colorId[a])
      const cb = nodeColor(data.colorId[b])
      lineColors[idx * 6] = ca.r
      lineColors[idx * 6 + 1] = ca.g
      lineColors[idx * 6 + 2] = ca.b
      lineColors[idx * 6 + 3] = cb.r
      lineColors[idx * 6 + 4] = cb.g
      lineColors[idx * 6 + 5] = cb.b
    })
    linesGeometry.setAttribute("color", new Float32BufferAttribute(lineColors, 3))
    linesGeometry.attributes.color.needsUpdate = true
  }, [colors, count, data, pointsGeometry, linesGeometry])

  React.useEffect(() => {
    canParallax.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!canParallax.current) return

    const canvas = gl.domElement
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [gl])

  React.useEffect(() => {
    return () => {
      pointsGeometry.dispose()
      linesGeometry.dispose()
    }
  }, [pointsGeometry, linesGeometry])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const posAttr = pointsGeometry.attributes.position as Float32BufferAttribute
    const linePosAttr = linesGeometry.attributes.position as Float32BufferAttribute

    for (let i = 0; i < count; i++) {
      const bx = data.positions[i * 3]
      const by = data.positions[i * 3 + 1]
      const bz = data.positions[i * 3 + 2]
      const phase = data.phases[i]
      const speed = data.speeds[i]
      posAttr.array[i * 3] = bx + Math.sin(t * speed + phase) * 0.18
      posAttr.array[i * 3 + 1] = by + Math.cos(t * speed * 0.8 + phase) * 0.18
      posAttr.array[i * 3 + 2] = bz
    }
    posAttr.needsUpdate = true

    data.edges.forEach(([a, b], idx) => {
      linePosAttr.array[idx * 6] = posAttr.array[a * 3]
      linePosAttr.array[idx * 6 + 1] = posAttr.array[a * 3 + 1]
      linePosAttr.array[idx * 6 + 2] = posAttr.array[a * 3 + 2]
      linePosAttr.array[idx * 6 + 3] = posAttr.array[b * 3]
      linePosAttr.array[idx * 6 + 4] = posAttr.array[b * 3 + 1]
      linePosAttr.array[idx * 6 + 5] = posAttr.array[b * 3 + 2]
    })
    linePosAttr.needsUpdate = true

    if (driftRef.current) {
      driftRef.current.rotation.y += 0.0006
    }
    if (parallaxRef.current) {
      const targetX = canParallax.current ? pointer.current.y * 0.12 : 0
      const targetY = canParallax.current ? pointer.current.x * 0.18 : 0
      parallaxRef.current.rotation.x += (targetX - parallaxRef.current.rotation.x) * 0.04
      parallaxRef.current.rotation.y += (targetY - parallaxRef.current.rotation.y) * 0.04
    }
  })

  return (
    <group ref={driftRef}>
      <group ref={parallaxRef}>
        <points ref={pointsRef} geometry={pointsGeometry}>
          <pointsMaterial
            size={0.075}
            vertexColors
            transparent
            opacity={0.95}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        <lineSegments ref={linesRef} geometry={linesGeometry}>
          <lineBasicMaterial vertexColors transparent opacity={0.28} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  )
}

export function nodeCountForWidth(width: number): number {
  if (width < 640) return 26
  if (width < 1024) return 48
  return 90
}
