import { describe, expect, it } from 'vitest'
import { emptyLeadDraft, hasErrors, validateLead } from '@/features/lead/model/lead.ts'

const valid = {
  name: 'Elena Restrepo',
  email: 'elena@example.com',
  phone: '+57 300 123 4567',
  message: 'Quisiera agendar una visita a la Cornisa.',
}

describe('validateLead', () => {
  it('accepts a complete submission', () => {
    expect(hasErrors(validateLead(valid))).toBe(false)
  })

  it('reports every empty field at once', () => {
    expect(Object.keys(validateLead(emptyLeadDraft)).sort()).toEqual([
      'email',
      'message',
      'name',
      'phone',
    ])
  })

  it('rejects an address without a domain', () => {
    expect(validateLead({ ...valid, email: 'elena@example' }).email).toBeDefined()
  })

  it('accepts a local number and rejects letters in the phone', () => {
    expect(validateLead({ ...valid, phone: '3001234567' }).phone).toBeUndefined()
    expect(validateLead({ ...valid, phone: 'llámame' }).phone).toBeDefined()
  })

  it('ignores surrounding whitespace when measuring length', () => {
    expect(validateLead({ ...valid, message: '   corto   ' }).message).toBeDefined()
  })
})
