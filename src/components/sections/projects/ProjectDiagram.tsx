import type { ProjectDiagram as DiagramKind } from "@/data/projects"

/*
 * Hand-drawn system sketches, one per project. Conventions:
 *   [data-draw]  structure strokes, drawn in on scroll
 *   [data-pop]   nodes and labels, faded in after the strokes
 *   .wire-flow   dashed overlays that flow while the card is hovered
 * Colors come from tokens, so both themes re-color for free.
 */

const line = "var(--line-strong)"
const accent = "var(--card-accent)"
const label = "var(--muted-text)"

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text data-pop x={x} y={y} textAnchor={anchor} fill={label} className="font-mono" fontSize="10.5" letterSpacing="0.02em">
      {children}
    </text>
  )
}

function Wire({ d }: { d: string }) {
  return (
    <>
      <path data-draw d={d} stroke={line} strokeWidth="1.2" fill="none" />
      <path data-pop d={d} stroke={accent} strokeWidth="1.6" fill="none" className="wire-flow" strokeLinecap="round" />
    </>
  )
}

function Attendance() {
  return (
    <svg viewBox="0 0 480 260" className="h-auto w-full" aria-hidden>
      {/* Site camera with a detected face */}
      <rect data-draw x="10" y="72" width="100" height="112" rx="16" stroke={line} strokeWidth="1.2" fill="none" />
      <circle data-draw cx="60" cy="114" r="15" stroke={line} strokeWidth="1.2" fill="none" />
      <path data-draw d="M34 162c8-14 17-20 26-20s18 6 26 20" stroke={line} strokeWidth="1.2" fill="none" />
      <path
        data-pop
        d="M40 94h-7v7M80 94h7v7M40 134h-7v-7M80 134h7v-7"
        stroke={accent}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <Label x={60} y={206}>site camera</Label>

      <Wire d="M110 128H198" />
      <Label x={154} y={116}>WebSocket</Label>

      {/* ArcFace encoder producing an embedding */}
      <rect data-draw x="198" y="92" width="100" height="72" rx="12" stroke={line} strokeWidth="1.2" fill="none" />
      <text data-pop x="248" y="120" textAnchor="middle" fill="var(--text)" className="font-mono" fontSize="12">
        ArcFace
      </text>
      <g data-pop fill={accent}>
        {[10, 16, 7, 13, 18, 9, 14, 11, 6, 15].map((h, i) => (
          <rect key={i} x={212 + i * 7.4} y={150 - h} width="3.6" height={h} rx="1.2" opacity={0.55 + (i % 3) * 0.15} />
        ))}
      </g>

      <Wire d="M298 128c24 0 22-58 50-58" />
      <Wire d="M298 128c24 0 22 62 46 62" />

      {/* Milvus vector store */}
      <ellipse data-draw cx="396" cy="46" rx="48" ry="11" stroke={line} strokeWidth="1.2" fill="none" />
      <path data-draw d="M348 46v48c0 6 21 11 48 11s48-5 48-11V46" stroke={line} strokeWidth="1.2" fill="none" />
      <path data-draw d="M348 70c0 6 21 11 48 11s48-5 48-11" stroke={line} strokeWidth="1.2" fill="none" />
      <Label x={396} y={126}>Milvus</Label>

      {/* Attendance ledger */}
      <rect data-draw x="344" y="150" width="112" height="84" rx="12" stroke={line} strokeWidth="1.2" fill="none" />
      {[172, 192, 212].map((y, i) => (
        <g key={y} data-pop>
          <path d={`M358 ${y}h${48 - i * 8}`} stroke={label} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d={`M430 ${y}l4 4 8-8`} stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <Label x={400} y={252}>hours &amp; wages</Label>
    </svg>
  )
}

function Rag() {
  const dots = [
    [40, 150], [52, 138], [48, 164], [62, 152], [110, 196], [122, 186], [98, 204], [132, 132], [144, 146], [120, 122],
    [70, 206], [150, 190], [86, 124],
  ]
  const query: [number, number] = [118, 148]
  const nearest = [[132, 132], [144, 146], [120, 122]]
  return (
    <svg viewBox="0 0 400 240" className="h-auto w-full" aria-hidden>
      {/* The founder's question */}
      <rect data-draw x="16" y="20" width="164" height="40" rx="20" stroke={line} strokeWidth="1.2" fill="none" />
      <Label x={98} y={44}>pitch: my idea</Label>
      <Wire d="M98 60V98" />

      {/* Vector space with top-k retrieval */}
      <rect data-draw x="16" y="98" width="164" height="124" rx="14" stroke={line} strokeWidth="1.2" fill="none" />
      <g data-pop fill={label} opacity="0.7">
        {dots.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />
        ))}
      </g>
      {nearest.map(([x, y]) => (
        <path key={`${x}${y}`} data-pop d={`M${query[0]} ${query[1]}L${x} ${y}`} stroke={accent} strokeWidth="1.2" />
      ))}
      <circle data-pop cx={query[0]} cy={query[1]} r="4.5" fill={accent} />
      <Label x={36} y={116} anchor="start">top-k</Label>

      <Wire d="M180 150c24 0 22-86 44-86" />

      {/* Ranked VC matches */}
      {[0.92, 0.88, 0.81].map((score, i) => (
        <g key={score}>
          <rect data-draw x="224" y={20 + i * 42} width="160" height="32" rx="10" stroke={line} strokeWidth="1.2" fill="none" />
          <circle data-pop cx="242" cy={36 + i * 42} r="6" stroke={accent} strokeWidth="1.2" fill="none" />
          <path data-pop d={`M256 ${36 + i * 42}h${56 - i * 12}`} stroke={label} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <text data-pop x="372" y={40 + i * 42} textAnchor="end" fill={accent} className="font-mono" fontSize="10.5">
            {score.toFixed(2)}
          </text>
        </g>
      ))}

      <Wire d="M304 146V168" />

      {/* Founder and VC talking directly */}
      <rect data-draw x="224" y="168" width="112" height="26" rx="13" stroke={line} strokeWidth="1.2" fill="none" />
      <rect data-draw x="272" y="200" width="112" height="26" rx="13" stroke={accent} strokeWidth="1.2" fill="none" />
      <Label x={280} y={185}>founder</Label>
      <Label x={328} y={217}>VC</Label>
    </svg>
  )
}

function TryOn() {
  return (
    <svg viewBox="0 0 400 240" className="h-auto w-full" aria-hidden>
      {/* Uploaded photo */}
      <rect data-draw x="16" y="16" width="120" height="184" rx="14" stroke={line} strokeWidth="1.2" fill="none" />
      <circle data-draw cx="76" cy="62" r="17" stroke={line} strokeWidth="1.2" fill="none" />
      <path data-draw d="M40 176c0-44 14-78 36-78s36 34 36 78" stroke={line} strokeWidth="1.2" fill="none" />
      {/* Garment fitted over the torso */}
      <path
        data-pop
        d="M52 104l14-8h20l14 8 10 22-12 6-6-10v48H56v-48l-6 10-12-6z"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="color-mix(in srgb, var(--card-accent) 14%, transparent)"
      />
      <Label x={76} y={220}>your fit</Label>

      <Wire d="M136 108H186" />

      {/* Outfit input */}
      <rect data-draw x="186" y="68" width="80" height="80" rx="14" stroke={line} strokeWidth="1.2" fill="none" />
      <path
        data-draw
        d="M210 88l10-6h12l10 6 7 15-9 4-4-7v31h-20v-31l-4 7-9-4z"
        stroke={line}
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      <Label x={226} y={170}>outfit</Label>

      <Wire d="M266 108H290" />

      {/* Recommendations ranked to taste */}
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => {
          const hit = row === 0 && col === 0
          return (
            <rect
              key={`${row}${col}`}
              data-draw={hit ? undefined : true}
              data-pop={hit ? true : undefined}
              x={290 + col * 50}
              y={30 + row * 54}
              width="42"
              height="46"
              rx="9"
              stroke={hit ? accent : line}
              strokeWidth={hit ? 1.6 : 1.2}
              fill={hit ? "color-mix(in srgb, var(--card-accent) 14%, transparent)" : "none"}
            />
          )
        })
      )}
      <Label x={336} y={214}>for you</Label>
    </svg>
  )
}

function Drive() {
  return (
    <svg viewBox="0 0 480 260" className="h-auto w-full" aria-hidden>
      {/* Folder tree */}
      <path data-draw d="M24 36h22l6 7h36v24H24z" stroke={line} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      <Label x={100} y={58} anchor="start">/workspace</Label>
      <path data-draw d="M40 67v44h20M40 111v52h20" stroke={line} strokeWidth="1.2" fill="none" />
      <path data-draw d="M60 100h18l5 6h27v18H60z" stroke={line} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      <Label x={120} y={118} anchor="start">/specs</Label>
      <path data-draw d="M76 124v38h16" stroke={line} strokeWidth="1.2" fill="none" />
      <path data-pop d="M92 150h24l8 8v20H92z" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <Label x={134} y={170} anchor="start">design.pdf</Label>

      {/* Version chain */}
      {["v1", "v2", "v3"].map((v, i) => (
        <g key={v}>
          <rect
            data-draw={i < 2 ? true : undefined}
            data-pop={i === 2 ? true : undefined}
            x={92 + i * 52}
            y="204"
            width="38"
            height="24"
            rx="12"
            stroke={i === 2 ? accent : line}
            strokeWidth={i === 2 ? 1.6 : 1.2}
            fill="none"
          />
          <text data-pop x={111 + i * 52} y="220" textAnchor="middle" fill={i === 2 ? accent : label} className="font-mono" fontSize="10.5">
            {v}
          </text>
          {i < 2 && <path data-draw d={`M${130 + i * 52} 216h14`} stroke={line} strokeWidth="1.2" />}
        </g>
      ))}
      <path data-draw d="M108 178v26" stroke={line} strokeWidth="1.2" strokeDasharray="2 3" />

      <Wire d="M240 216c50 0 56-146 110-146" />
      <Wire d="M206 166c60 0 84 28 144 28" />

      {/* S3 bucket for file blobs */}
      <path data-draw d="M350 44h100l-10 56h-80z" stroke={line} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
      <ellipse data-draw cx="400" cy="44" rx="50" ry="8" stroke={line} strokeWidth="1.2" fill="none" />
      <Label x={400} y={82}>S3</Label>
      <Label x={400} y={122}>files</Label>

      {/* PostgreSQL for metadata */}
      <rect data-draw x="350" y="160" width="100" height="72" rx="10" stroke={line} strokeWidth="1.2" fill="none" />
      <path data-draw d="M350 184h100M350 208h100M384 160v72" stroke={line} strokeWidth="1.2" fill="none" />
      <Label x={400} y={252}>PostgreSQL metadata</Label>
    </svg>
  )
}

export function ProjectDiagram({ kind }: { kind: DiagramKind }) {
  switch (kind) {
    case "attendance":
      return <Attendance />
    case "rag":
      return <Rag />
    case "tryon":
      return <TryOn />
    case "drive":
      return <Drive />
  }
}
