import { describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTypologies } from '@/features/typologies/hooks/useTypologies.ts'
import type { TypologyRepository } from '@/features/typologies/api/typology.repository.ts'
import type { Typology } from '@/features/typologies/model/typology.ts'
import { HttpError } from '@/shared/lib/http/HttpError.ts'

const typology = { id: 'a', name: 'A', bedrooms: 2 } as Typology

/**
 * These three cases are the reason the hook depends on a repository interface
 * instead of calling `fetch` directly: the error path is exercised without a
 * network, a server, or any mocking of globals.
 */
describe('useTypologies', () => {
  it('starts loading and settles on the data', async () => {
    const repository: TypologyRepository = { findAll: async () => [typology] }

    const { result } = renderHook(() => useTypologies(repository))
    expect(result.current.state.status).toBe('loading')

    await waitFor(() => expect(result.current.state.status).toBe('ready'))
    if (result.current.state.status !== 'ready') throw new Error('esperaba ready')
    expect(result.current.state.data).toHaveLength(1)
  })

  it('reports the empty state when the collection has nothing in it', async () => {
    const repository: TypologyRepository = { findAll: async () => [] }

    const { result } = renderHook(() => useTypologies(repository))

    await waitFor(() => expect(result.current.state.status).toBe('empty'))
  })

  it('surfaces the server message when the read fails', async () => {
    const repository: TypologyRepository = {
      findAll: async () => {
        throw new HttpError('server', 'El servidor no responde')
      },
    }

    const { result } = renderHook(() => useTypologies(repository))

    await waitFor(() => expect(result.current.state.status).toBe('error'))
    if (result.current.state.status !== 'error') throw new Error('esperaba error')
    expect(result.current.state.error.message).toBe('El servidor no responde')
  })
})
