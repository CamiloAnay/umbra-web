export type FilterOption = {
  /** `null` is the "all" option. */
  value: number | null
  label: string
  count: number
}

type Props = {
  options: readonly FilterOption[]
  selected: number | null
  onSelect: (bedrooms: number | null) => void
}

/**
 * Presentational: it is handed the options with their counts and reports back
 * when one is pressed. It does not know where typologies come from, which is
 * why this filter can be changed without touching any data code.
 */
export function TypologyFilters({ options, selected, onSelect }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar tipologías por número de alcobas"
      className="snap-row gap-2.5 pb-1 md:flex-wrap md:overflow-visible"
    >
      {options.map((option) => {
        const active = selected === option.value
        return (
          <button
            key={option.label}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(option.value)}
            className={`flex-none cursor-pointer border px-[15px] py-2.5 font-display text-[12.5px]
              font-semibold transition-colors duration-200 md:px-[17px] md:text-[13px]
              ${
                active
                  ? 'border-blueprint bg-blueprint text-model'
                  : 'border-ink/25 bg-transparent text-ink hover:border-ink'
              }`}
          >
            {option.label}
            <span className={`ml-2 tabular-nums ${active ? 'text-model/65' : 'text-ink/45'}`}>
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
