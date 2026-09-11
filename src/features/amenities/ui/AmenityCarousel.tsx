import { Figure } from '@/shared/ui/molecules/Figure.tsx'
import { Measure } from '@/shared/ui/atoms/Measure.tsx'
import { formatIndex, type Amenity } from '../model/amenity.ts'

type Props = {
  amenities: readonly Amenity[]
}

/**
 * Presentational: the phone version of the same content.
 *
 * On a touch screen a tab strip plus a panel wastes the gesture people
 * already have, so the six amenities become one snapping row swiped with the
 * thumb. It uses native scroll snapping rather than a carousel library:
 * momentum, accessibility and keyboard scrolling come from the platform.
 */
export function AmenityCarousel({ amenities }: Props) {
  return (
    <ul
      className="snap-row gap-4 px-[var(--spacing-gutter)] pb-2.5"
      aria-label="Zonas comunes, deslizables"
    >
      {amenities.map((amenity, index) => (
        <li key={amenity.id} className="w-[17.875rem] flex-none">
          <Figure
            src={amenity.image}
            alt={amenity.summary}
            width={800}
            height={520}
            className="mb-4 h-[14.375rem]"
            shadow={{ flatness: 0.22, opacity: 0.18 }}
          />
          <p className="mb-2 flex items-baseline gap-2.5">
            <span className="cota tabular-nums">{formatIndex(index)}</span>
            <span className="font-display text-[22px] font-semibold w-mid">{amenity.name}</span>
          </p>
          <p className="mb-2.5 text-[1.03125rem] leading-[1.62] text-ink/84">{amenity.summary}</p>
          <Measure length={44}>{amenity.measure}</Measure>
        </li>
      ))}
    </ul>
  )
}
