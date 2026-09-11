import { describe, expect, it } from 'vitest'
import { assetUrl } from '@/shared/lib/http/assets.ts'

/**
 * The test environment has no VITE_API_URL, so the module falls back to the
 * absolute development default. These cover the shape of the resolution rather
 * than one deployment's hostname.
 */
describe('assetUrl', () => {
  it('leaves the site\'s own photographs untouched', () => {
    expect(assetUrl('/img/interior.webp')).toBe('/img/interior.webp')
    expect(assetUrl('/img/pool-sm.webp')).toBe('/img/pool-sm.webp')
  })

  it('sends uploaded photographs to the API that serves them', () => {
    expect(assetUrl('/uploads/abc.webp')).toBe('http://localhost:3001/uploads/abc.webp')
  })

  it('does not rewrite a path it does not own', () => {
    expect(assetUrl('/assets/index.js')).toBe('/assets/index.js')
    expect(assetUrl('https://example.com/x.webp')).toBe('https://example.com/x.webp')
  })
})
