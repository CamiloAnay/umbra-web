import { TypologyCard } from './TypologyCard.tsx'
import type { Typology } from '../model/typology.ts'

type Props = {
  typologies: readonly Typology[]
}

/** Presentational: receives a list and lays it out. No state, no data access. */
export function TypologyGrid({ typologies }: Props) {
  if (typologies.length === 0) {
    return (
      <p className="border-l-2 border-blueprint py-1 pl-5 text-lead text-ink/70">
        No hay tipologías con esa cantidad de alcobas. Probá con otra opción.
      </p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {typologies.map((typology) => (
        <TypologyCard key={typology.id} typology={typology} />
      ))}
    </div>
  )
}
