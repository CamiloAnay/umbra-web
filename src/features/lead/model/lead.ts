export type LeadDraft = {
  name: string
  email: string
  phone: string
  message: string
}

export type LeadErrors = Partial<Record<keyof LeadDraft, string>>

export const emptyLeadDraft: LeadDraft = { name: '', email: '', phone: '', message: '' }

/**
 * Client-side validation. It deliberately mirrors the rules the API enforces:
 * the server validates because it must — it cannot trust the client — and this
 * runs so the person gets an answer without a round trip. The messages are
 * kept identical on both sides so the same field never says two things.
 */
export function validateLead(draft: LeadDraft): LeadErrors {
  const errors: LeadErrors = {}

  if (draft.name.trim().length < 2) {
    errors.name = 'Escribe tu nombre completo'
  }
  if (!isEmail(draft.email.trim())) {
    errors.email = 'Revisa el correo, parece incompleto'
  }
  if (!/^[+]?[\d\s()-]{7,20}$/.test(draft.phone.trim())) {
    errors.phone = 'Incluye un teléfono de contacto válido'
  }
  if (draft.message.trim().length < 10) {
    errors.message = 'Cuéntanos un poco más, al menos 10 caracteres'
  }

  return errors
}

export function hasErrors(errors: LeadErrors): boolean {
  return Object.keys(errors).length > 0
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}
