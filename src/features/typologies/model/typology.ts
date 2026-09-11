export type TypologyCategory = 'studio' | 'familiar' | 'penthouse'

export type Typology = {
  id: string
  name: string
  tagline: string
  description: string
  area: number
  balconyArea?: number
  gardenArea?: number
  frontage: string
  bedrooms: number
  bathrooms: number
  orientation: string
  level: string
  units: number
  priceFrom: number
  category: TypologyCategory
  features: string[]
  /** Floor plan as SVG path data over a 260x178 viewBox. */
  plan: { walls: string; balcony: string }
  image: string
}

/**
 * Presentation helpers. They live beside the model because they encode the
 * same kind of knowledge — how a typology describes itself — and because pure
 * functions are much easier to test than the components that render them.
 */

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatPrice(typology: Typology): string {
  return priceFormatter.format(typology.priceFrom)
}

export function formatArea(typology: Typology): string {
  return `${typology.area} m²`
}

/** The outdoor area, whichever kind this typology has. */
export function formatOutdoorArea(typology: Typology): string {
  if (typology.balconyArea) return `${typology.balconyArea} m²`
  if (typology.gardenArea) return `${typology.gardenArea} m² de jardín`
  return 'Sin balcón'
}

export function formatBedrooms(bedrooms: number): string {
  return bedrooms === 1 ? '1 alcoba' : `${bedrooms} alcobas`
}

/** Distinct bedroom counts present in the data, ascending. Drives the filters. */
export function bedroomOptions(typologies: readonly Typology[]): number[] {
  return [...new Set(typologies.map((t) => t.bedrooms))].sort((a, b) => a - b)
}

export function filterByBedrooms(
  typologies: readonly Typology[],
  bedrooms: number | null,
): Typology[] {
  if (bedrooms === null) return [...typologies]
  return typologies.filter((typology) => typology.bedrooms === bedrooms)
}
