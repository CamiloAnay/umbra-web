import { useMemo, useRef, useState } from 'react'
import { AsyncBoundary } from '@/shared/ui/organisms/AsyncBoundary.tsx'
import { Skeleton } from '@/shared/ui/atoms/Skeleton.tsx'
import { useReveal } from '@/shared/motion/useReveal.ts'
import { useFlipList } from '@/shared/motion/useFlipList.ts'
import { useTypologies } from '../hooks/useTypologies.ts'
import { bedroomOptions, filterByBedrooms, formatBedrooms } from '../model/typology.ts'
import { TypologyFilters, type FilterOption } from './TypologyFilters.tsx'
import { TypologyGrid } from './TypologyGrid.tsx'

/**
 * Container. It owns the remote read and the selected filter, and hands both
 * children plain data. Filtering happens here, in memory: there are four
 * typologies, so a round trip per click would be latency bought for nothing.
 */
export function TypologiesSection() {
  const { state, retry } = useTypologies()
  const [bedrooms, setBedrooms] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  useReveal(gridRef, { children: 'article', stagger: 0.07 })

  // The grid re-orders when the filter changes, and layout is not something
  // the browser animates. FLIP measures before the re-render and plays the
  // difference, so cards travel to their new positions instead of jumping.
  const { capture } = useFlipList(gridRef, { items: 'article', dependency: bedrooms })

  const selectBedrooms = (value: number | null) => {
    capture()
    setBedrooms(value)
  }

  const typologies = state.status === 'ready' ? state.data : []

  const options = useMemo<FilterOption[]>(
    () => [
      { value: null, label: 'Todas', count: typologies.length },
      ...bedroomOptions(typologies).map((value) => ({
        value,
        label: formatBedrooms(value),
        count: typologies.filter((typology) => typology.bedrooms === value).length,
      })),
    ],
    [typologies],
  )

  const visible = useMemo(() => filterByBedrooms(typologies, bedrooms), [typologies, bedrooms])

  return (
    <section id="tipologias" aria-labelledby="tipologias-titulo" className="bg-model py-section">
      <div className="frame">
        <div className="mb-6 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 id="tipologias-titulo" className="text-section">
            Cuatro tipologías
          </h2>

          {state.status === 'ready' && (
            <TypologyFilters options={options} selected={bedrooms} onSelect={selectBedrooms} />
          )}
        </div>

        <AsyncBoundary
          state={state}
          onRetry={retry}
          emptyMessage="Todavía no hay tipologías publicadas para este proyecto."
          skeleton={
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-[22rem] w-full" />
              ))}
            </div>
          }
        >
          {() => (
            <div ref={gridRef}>
              <TypologyGrid typologies={visible} />
            </div>
          )}
        </AsyncBoundary>
      </div>
    </section>
  )
}
