import { formatIndex, type Amenity } from '../model/amenity.ts'

type Props = {
  amenities: readonly Amenity[]
  selectedId: string
  onSelect: (id: string) => void
}

/**
 * Presentational: the desktop selector. It is told which amenity is on and
 * reports back when another is chosen; it does not know where the list came
 * from, nor what the panel beside it does with the choice.
 */
export function AmenityList({ amenities, selectedId, onSelect }: Props) {
  return (
    <div role="tablist" aria-label="Zonas comunes" aria-orientation="vertical" className="flex flex-col">
      {amenities.map((amenity, index) => {
        const active = amenity.id === selectedId
        return (
          <button
            key={amenity.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`amenidad-${amenity.id}`}
            id={`tab-${amenity.id}`}
            onClick={() => onSelect(amenity.id)}
            className={`flex cursor-pointer items-baseline gap-[18px] border-l-2 py-[19px] pl-5
              text-left font-display transition-colors duration-200
              ${
                active
                  ? 'border-blueprint text-ink'
                  : 'border-ink/14 text-ink/45 hover:border-ink/40 hover:text-ink/75'
              }`}
          >
            <span className="pt-1 text-[12px] tabular-nums opacity-80">{formatIndex(index)}</span>
            <span className="text-[22px] font-semibold w-mid tracking-[-0.01em] md:text-[26px]">
              {amenity.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
