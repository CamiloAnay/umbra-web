import { AsyncBoundary } from '@/shared/ui/organisms/AsyncBoundary.tsx'
import { Skeleton } from '@/shared/ui/atoms/Skeleton.tsx'
import { useStats } from '../hooks/useStats.ts'
import { StatRow } from './StatRow.tsx'

/** Container: owns the remote read. The rows below are presentational. */
export function StatsSection() {
  const { state, retry } = useStats()

  return (
    <section aria-labelledby="cifras-titulo" className="bg-model py-section">
      <div className="frame">
        <h2
          id="cifras-titulo"
          className="mb-8 font-display text-[13.5px] font-semibold w-mid tracking-normal
            text-ink/60 md:mb-[72px] md:text-[15px]"
        >
          El proyecto en cuatro medidas
        </h2>

        <AsyncBoundary
          state={state}
          onRetry={retry}
          emptyMessage="Todavía no publicamos las medidas del proyecto."
          skeleton={
            <div>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="border-b border-ink/14 py-6">
                  <Skeleton className="h-12 w-40" />
                  <Skeleton className="mt-3 h-4 w-64" />
                </div>
              ))}
            </div>
          }
        >
          {(stats) => (
            <div>
              {stats.map((stat) => (
                <StatRow key={stat.id} stat={stat} />
              ))}
            </div>
          )}
        </AsyncBoundary>
      </div>
    </section>
  )
}
