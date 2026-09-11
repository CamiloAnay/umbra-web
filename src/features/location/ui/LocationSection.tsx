import { useRef, useState } from 'react'
import { AsyncBoundary } from '@/shared/ui/organisms/AsyncBoundary.tsx'
import { Skeleton } from '@/shared/ui/atoms/Skeleton.tsx'
import { useReveal } from '@/shared/motion/useReveal.ts'
import { usePointsOfInterest } from '../hooks/usePointsOfInterest.ts'
import { LocationMap } from './LocationMap.tsx'
import { PointList } from './PointList.tsx'

/** Container: owns the read and which reference is selected. */
export function LocationSection() {
  const { state, retry } = usePointsOfInterest()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  useReveal(sectionRef, { children: '[data-reveal]', stagger: 0.12, distance: 22 })

  return (
    <section ref={sectionRef} id="ubicacion" aria-labelledby="ubicacion-titulo" className="py-section">
      <div className="frame grid items-start gap-8 md:grid-cols-[380px_1fr] md:gap-[72px]">
        <div data-reveal>
          <h2 id="ubicacion-titulo" className="text-section">
            Dónde queda
          </h2>
          <p className="mt-4 text-prose text-ink/84 md:mt-8 md:mb-10">
            Carrera 34 con calle 10, ladera oriental. Tocá una referencia para ver la distancia.
          </p>

          <div className="mt-6 md:mt-0">
            <AsyncBoundary
              state={state}
              onRetry={retry}
              emptyMessage="Todavía no cargamos las referencias del sector."
              skeleton={
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }, (_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              }
            >
              {(points) => (
                <PointList points={points} selectedId={selectedId} onSelect={setSelectedId} />
              )}
            </AsyncBoundary>
          </div>
        </div>

        <div className="order-first md:order-none" data-reveal>
          {state.status === 'ready' ? (
            <LocationMap points={state.data} selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <Skeleton className="aspect-[700/470] w-full" />
          )}
        </div>
      </div>
    </section>
  )
}
