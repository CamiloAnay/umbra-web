import { useState } from 'react'
import { AsyncBoundary } from '@/shared/ui/organisms/AsyncBoundary.tsx'
import { Skeleton } from '@/shared/ui/atoms/Skeleton.tsx'
import { useAmenities } from '../hooks/useAmenities.ts'
import { AmenityList } from './AmenityList.tsx'
import { AmenityPanel } from './AmenityPanel.tsx'
import { AmenityCarousel } from './AmenityCarousel.tsx'

/**
 * Container. It owns the remote read and the current selection, and gives the
 * three presentational children plain data.
 *
 * Desktop and phone get different interactions over the same list — a
 * selector with a panel, or a swipeable row — because a tab strip is not a
 * thumb gesture. Both are fed from here, so the data path is identical.
 */
export function AmenitiesSection() {
  const { state, retry } = useAmenities()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <section id="amenidades" aria-labelledby="amenidades-titulo" className="py-section">
      <div className="frame">
        <h2 id="amenidades-titulo" className="text-section">
          Zonas comunes
        </h2>
        <p className="mt-2.5 text-[1rem] text-ink/60 md:hidden">Deslizá para recorrer las seis.</p>
      </div>

      <div className="mt-8 md:mt-14">
        <AsyncBoundary
          state={state}
          onRetry={retry}
          emptyMessage="Todavía no publicamos las zonas comunes del proyecto."
          skeleton={
            <div className="frame grid gap-12 md:grid-cols-[400px_1fr] md:gap-[72px]">
              <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
              <Skeleton className="h-[18rem] w-full md:h-[470px]" />
            </div>
          }
        >
          {(amenities) => {
            const selected = amenities.find((a) => a.id === selectedId) ?? amenities[0]
            if (!selected) return null

            return (
              <>
                <div className="frame hidden items-start gap-[72px] md:grid md:grid-cols-[400px_1fr]">
                  <AmenityList
                    amenities={amenities}
                    selectedId={selected.id}
                    onSelect={setSelectedId}
                  />
                  <AmenityPanel amenity={selected} />
                </div>

                <div className="md:hidden">
                  <AmenityCarousel amenities={amenities} />
                </div>
              </>
            )
          }}
        </AsyncBoundary>
      </div>
    </section>
  )
}
