import { formatDistance, type PointOfInterest } from '../model/pointOfInterest.ts'

type Props = {
  points: readonly PointOfInterest[]
  selectedId: string | null
  onSelect: (id: string) => void
}

/**
 * Presentational: a diagram of distances, not a survey.
 *
 * A real map tile would add a heavy dependency and an API key to answer one
 * question — how far is it from here to there — that four dashed lines answer
 * better. Every marker is a real button, so the diagram is reachable by
 * keyboard just like the list beside it.
 */
export function LocationMap({ points, selectedId, onSelect }: Props) {
  return (
    <svg viewBox="0 0 700 470" className="w-full bg-model" role="group" aria-label="Mapa de referencias cercanas">
      <g stroke="#3A4038" strokeWidth="1" opacity="0.22" fill="none">
        <path d="M0 90 H700 M0 210 H700 M0 330 H700 M0 430 H700" />
        <path d="M120 0 V470 M260 0 V470 M400 0 V470 M540 0 V470 M650 0 V470" />
      </g>

      <g fill="#3A4038" opacity="0.07">
        <rect x="130" y="100" width="118" height="98" />
        <rect x="410" y="220" width="118" height="98" />
        <rect x="270" y="340" width="118" height="78" />
        <rect x="550" y="100" width="90" height="98" />
      </g>

      <rect x="262" y="212" width="58" height="46" fill="#1C1F1B" />
      <text x="332" y="232" fill="#1C1F1B" fontFamily="Archivo, sans-serif" fontSize="15" fontWeight="700">
        UMBRAL
      </text>
      <text x="332" y="250" fill="rgba(28,31,27,.55)" fontFamily="Newsreader, serif" fontSize="13">
        Cra. 34 # 10-22
      </text>

      {points.map((point) => {
        const active = point.id === selectedId
        return (
          <g key={point.id}>
            <path
              d={point.map.line}
              stroke="#24506B"
              strokeWidth="1"
              strokeDasharray="5 4"
              fill="none"
              opacity={active ? 1 : 0}
              className="transition-opacity duration-300"
            />
            <text
              x={point.map.labelX}
              y={point.map.labelY}
              fill="#24506B"
              fontFamily="Archivo, sans-serif"
              fontSize="11"
              opacity={active ? 1 : 0}
              className="transition-opacity duration-300"
            >
              {formatDistance(point)}
            </text>
            <text
              x={point.map.nameX}
              y={point.map.nameY}
              fill="#1C1F1B"
              fontFamily="Newsreader, serif"
              fontSize="14"
              opacity={active ? 1 : 0.5}
              className="transition-opacity duration-300"
            >
              {point.name}
            </text>

            <g
              role="button"
              tabIndex={0}
              aria-label={`${point.name}, a ${formatDistance(point)}`}
              aria-pressed={active}
              onClick={() => onSelect(point.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(point.id)
                }
              }}
              className="cursor-pointer"
            >
              {/* Generous invisible hit area: 6px is too small for a finger. */}
              <circle cx={point.map.x} cy={point.map.y} r="22" fill="transparent" />
              <circle
                cx={point.map.x}
                cy={point.map.y}
                r="6"
                fill={active ? '#24506B' : '#F4F3EF'}
                stroke="#24506B"
                strokeWidth="1.2"
                className="transition-[fill] duration-200"
              />
            </g>
          </g>
        )
      })}
    </svg>
  )
}
