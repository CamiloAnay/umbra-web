import type { Typology } from '../model/typology.ts'

type Props = {
  typology: Typology
  /** The dimension line under the plan is dropped in the compact layout. */
  withDimension?: boolean
  className?: string
}

/**
 * The floor plan, drawn from path data that travels with the typology record.
 * Solid strokes are walls; the dashed blueprint line is the balcony or garden,
 * which is the drafting convention for something outside the enclosure.
 */
export function FloorPlan({ typology, withDimension = true, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 260 178"
      className={className}
      role="img"
      aria-label={`Planta de ${typology.name}: ${typology.area} metros cuadrados, ${typology.frontage}`}
    >
      <rect x="8" y="8" width="244" height="162" fill="#F4F3EF" stroke="#1C1F1B" strokeWidth="1.4" />
      <path d={typology.plan.walls} fill="none" stroke="#1C1F1B" strokeWidth="1.4" />
      <path
        d={typology.plan.balcony}
        fill="none"
        stroke="#24506B"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {withDimension && (
        <>
          <path d="M8 178 H252" stroke="#24506B" strokeWidth="1" />
          <path d="M8 174 V178 M252 174 V178" stroke="#24506B" strokeWidth="1" />
          <text
            x="130"
            y="170"
            textAnchor="middle"
            fill="#24506B"
            fontFamily="Archivo, sans-serif"
            fontSize="9"
          >
            {typology.frontage}
          </text>
        </>
      )}
    </svg>
  )
}
