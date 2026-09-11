export type ProjectStat = {
  id: string
  value: number
  unit: string
  note: string
  order: number
}

const numberFormatter = new Intl.NumberFormat('es-CO')

export function formatStatValue(value: number): string {
  return numberFormatter.format(value)
}
