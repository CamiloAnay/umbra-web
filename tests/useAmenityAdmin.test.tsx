import { describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useAmenityAdmin } from '@/features/amenities/hooks/useAmenityAdmin.ts'
import type { AmenityRepository } from '@/features/amenities/api/amenity.repository.ts'
import type { Amenity, AmenityDraft } from '@/features/amenities/model/amenity.ts'
import { HttpError } from '@/shared/lib/http/HttpError.ts'

const draft: AmenityDraft = {
  name: 'Sala de cine',
  summary: 'Doce butacas en el semisótano.',
  description: 'Sala de doce butacas sin luz natural por diseño, con proyección en 4K.',
  specs: ['12 butacas', 'Nivel -1'],
  measure: '12 butacas · nivel -1',
  image: '/img/interior.webp',
}

const stored = { id: 'piscina', name: 'Piscina' } as Amenity

const repositoryWith = (overrides: Partial<AmenityRepository> = {}): AmenityRepository => ({
  findAll: async () => [],
  create: async () => stored,
  update: async () => stored,
  remove: async () => {},
  ...overrides,
})

const setup = (repository: AmenityRepository) => {
  const onChanged = vi.fn()
  const view = renderHook(() => useAmenityAdmin({ repository, onChanged }))
  return { ...view, onChanged }
}

describe('useAmenityAdmin', () => {
  it('creates when there is nothing being edited', async () => {
    const create = vi.fn(async () => stored)
    const { result, onChanged } = setup(repositoryWith({ create }))

    await act(async () => {
      await result.current.save(draft, null)
    })

    expect(create).toHaveBeenCalledWith(draft)
    expect(onChanged).toHaveBeenCalledOnce()
    expect(result.current.write.status).toBe('saved')
  })

  it('updates the amenity being edited instead of creating another', async () => {
    const update = vi.fn(async () => stored)
    const create = vi.fn(async () => stored)
    const { result } = setup(repositoryWith({ update, create }))

    await act(async () => {
      await result.current.save(draft, stored)
    })

    expect(update).toHaveBeenCalledWith('piscina', draft)
    expect(create).not.toHaveBeenCalled()
  })

  it('refuses to send an invalid draft and marks the offending fields', async () => {
    const create = vi.fn(async () => stored)
    const { result } = setup(repositoryWith({ create }))

    await act(async () => {
      await result.current.save({ ...draft, name: 'A', specs: [] }, null)
    })

    expect(create).not.toHaveBeenCalled()
    expect(result.current.errors.name).toBeDefined()
    expect(result.current.errors.specs).toBeDefined()
    expect(result.current.write.status).toBe('failed')
  })

  /** The server rejects what the client accepted; its messages win. */
  it('adopts the field messages the server sends back', async () => {
    const create = async () => {
      throw new HttpError('conflict', 'Ya existe la amenidad', { name: 'Ese nombre está tomado' })
    }
    const { result } = setup(repositoryWith({ create }))

    await act(async () => {
      await result.current.save(draft, null)
    })

    await waitFor(() => expect(result.current.errors.name).toBe('Ese nombre está tomado'))
    expect(result.current.write.status).toBe('failed')
  })

  it('deletes and reports the change upwards', async () => {
    const remove = vi.fn(async () => {})
    const { result, onChanged } = setup(repositoryWith({ remove }))

    await act(async () => {
      await result.current.destroy(stored)
    })

    expect(remove).toHaveBeenCalledWith('piscina')
    expect(onChanged).toHaveBeenCalledOnce()
  })

  it('does not report a change when the delete fails', async () => {
    const remove = async () => {
      throw new HttpError('server', 'No se pudo eliminar')
    }
    const { result, onChanged } = setup(repositoryWith({ remove }))

    await act(async () => {
      await result.current.destroy(stored)
    })

    expect(onChanged).not.toHaveBeenCalled()
    expect(result.current.write.status).toBe('failed')
  })
})
