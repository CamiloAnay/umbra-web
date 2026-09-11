import { describe, expect, it } from 'vitest'
import {
  bedroomOptions,
  filterByBedrooms,
  formatBedrooms,
  formatOutdoorArea,
  type Typology,
} from '@/features/typologies/model/typology.ts'

const make = (overrides: Partial<Typology>): Typology => ({
  id: 'x',
  name: 'X',
  tagline: '',
  description: '',
  area: 60,
  frontage: '6 m',
  bedrooms: 1,
  bathrooms: 1,
  orientation: 'Norte',
  level: 'Nivel 1',
  units: 1,
  priceFrom: 1,
  category: 'studio',
  features: [],
  plan: { walls: '', balcony: '' },
  image: '',
  ...overrides,
})

describe('typology model', () => {
  it('lists each distinct bedroom count once, ascending', () => {
    const typologies = [make({ bedrooms: 3 }), make({ bedrooms: 1 }), make({ bedrooms: 3 })]

    expect(bedroomOptions(typologies)).toEqual([1, 3])
  })

  it('returns everything when no filter is applied', () => {
    const typologies = [make({ bedrooms: 1 }), make({ bedrooms: 2 })]

    expect(filterByBedrooms(typologies, null)).toHaveLength(2)
  })

  it('keeps only the matching bedroom count', () => {
    const typologies = [make({ bedrooms: 1 }), make({ bedrooms: 2 }), make({ bedrooms: 2 })]

    expect(filterByBedrooms(typologies, 2)).toHaveLength(2)
  })

  it('singularises one bedroom', () => {
    expect(formatBedrooms(1)).toBe('1 alcoba')
    expect(formatBedrooms(3)).toBe('3 alcobas')
  })

  it('describes the outdoor area by the kind the typology has', () => {
    expect(formatOutdoorArea(make({ balconyArea: 11 }))).toBe('11 m²')
    expect(formatOutdoorArea(make({ gardenArea: 34 }))).toBe('34 m² de jardín')
    expect(formatOutdoorArea(make({}))).toBe('Sin balcón')
  })
})
