import { FloorPlan } from './FloorPlan.tsx'
import {
  formatArea,
  formatBedrooms,
  formatOutdoorArea,
  formatPrice,
  type Typology,
} from '../model/typology.ts'

type Props = {
  typology: Typology
}

export function TypologyCard({ typology }: Props) {
  const rows: [string, string][] = [
    ['Alcobas', formatBedrooms(typology.bedrooms)],
    ['Orientación', typology.orientation],
    [typology.gardenArea ? 'Jardín' : 'Balcón', formatOutdoorArea(typology)],
  ]

  return (
    <article className="bg-lime p-5 md:p-6 md:pb-7">
      <header className="mb-3.5 flex items-baseline justify-between gap-3 md:mb-[18px]">
        <h3 className="font-display text-[26px] font-bold w-wide tracking-[-0.02em] md:text-[30px]">
          {typology.name}
        </h3>
        <p className="text-[1.03125rem] text-ink/60">{formatArea(typology)}</p>
      </header>

      <div className="flex items-start gap-[18px] md:block">
        <FloorPlan
          typology={typology}
          withDimension={false}
          className="w-[150px] flex-none md:hidden"
        />
        <FloorPlan typology={typology} className="mb-5 hidden w-full md:block" />

        <dl className="flex flex-1 flex-col gap-2 text-[1rem] text-ink/82 md:gap-[9px] md:text-[1.03125rem]">
          {rows.map(([label, value], index) => (
            <div
              key={label}
              className={`flex justify-between gap-4 ${
                index < rows.length - 1 ? 'border-b border-ink/12 pb-1.5' : ''
              }`}
            >
              <dt className="text-ink/55">{label}</dt>
              <dd className="text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="cota mt-4 md:mt-5">Desde {formatPrice(typology)}</p>
    </article>
  )
}
