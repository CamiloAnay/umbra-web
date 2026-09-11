export type Amenity = {
  id: string
  name: string
  summary: string
  description: string
  specs: string[]
  /** Short figure shown on the dimension line beside the description. */
  measure: string
  image: string
  order: number
}

/** "01", "02", … — the index shown next to each name in the list. */
export function formatIndex(position: number): string {
  return String(position + 1).padStart(2, '0')
}

/** What the administration form edits. The id and order are decided by the API. */
export type AmenityDraft = {
  name: string
  summary: string
  description: string
  specs: string[]
  measure: string
  image: string
}

export type AmenityErrors = Partial<Record<keyof AmenityDraft, string>>

export const emptyAmenityDraft: AmenityDraft = {
  name: '',
  summary: '',
  description: '',
  specs: [],
  measure: '',
  image: '',
}

export function toDraft(amenity: Amenity): AmenityDraft {
  return {
    name: amenity.name,
    summary: amenity.summary,
    description: amenity.description,
    specs: [...amenity.specs],
    measure: amenity.measure,
    image: amenity.image,
  }
}

/**
 * Mirrors the rules the API enforces, so the person gets an answer without a
 * round trip. The server still validates — it cannot trust this — and the
 * messages are the same text on both sides.
 */
export function validateAmenity(draft: AmenityDraft): AmenityErrors {
  const errors: AmenityErrors = {}

  if (draft.name.trim().length < 2) errors.name = 'Escribe el nombre de la amenidad'
  if (draft.summary.trim().length < 10)
    errors.summary = 'La descripción corta necesita al menos 10 caracteres'
  if (draft.description.trim().length < 20)
    errors.description = 'La descripción necesita al menos 20 caracteres'
  if (draft.specs.filter((spec) => spec.trim()).length === 0)
    errors.specs = 'Incluye al menos una ficha técnica'
  if (draft.measure.trim().length < 1)
    errors.measure = 'Incluye la medida que se muestra en la cota'
  if (draft.image.trim().length < 1) errors.image = 'Subí una fotografía para la amenidad'

  return errors
}

export function hasAmenityErrors(errors: AmenityErrors): boolean {
  return Object.keys(errors).length > 0
}

/** The form edits the technical specs as one line each. */
export function specsFromText(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function specsToText(specs: readonly string[]): string {
  return specs.join('\n')
}
