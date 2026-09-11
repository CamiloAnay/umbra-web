import { formatDistance, formatWalk, type PointOfInterest } from '../model/pointOfInterest.ts'

type Props = {
  points: readonly PointOfInterest[]
  selectedId: string | null
  onSelect: (id: string) => void
}

/** Presentational: the same selection as the map, in words. */
export function PointList({ points, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-col">
      {points.map((point) => {
        const active = point.id === selectedId
        return (
          <button
            key={point.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(point.id)}
            className={`flex w-full cursor-pointer flex-col gap-1 border-l-2 py-[15px] pl-4
              text-left transition-colors duration-200 md:py-[17px] md:pl-[18px]
              ${
                active
                  ? 'border-blueprint text-ink'
                  : 'border-ink/14 text-ink/55 hover:border-ink/40 hover:text-ink/80'
              }`}
          >
            <span className="flex items-baseline justify-between gap-4">
              <span className="font-display text-[18px] font-semibold w-mid md:text-[20px]">
                {point.name}
              </span>
              <span
                className={`whitespace-nowrap text-[1rem] ${active ? 'text-blueprint' : 'text-ink/45'}`}
              >
                {formatDistance(point)}
              </span>
            </span>
            {active && (
              <span className="text-[0.9375rem] leading-[1.55] text-ink/70">
                {point.description} · {formatWalk(point)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
