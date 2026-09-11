import { useCallback, useState } from 'react'
import { HttpError } from '@/shared/lib/http/HttpError.ts'
import { httpAmenityRepository, type AmenityRepository } from '../api/amenity.repository.ts'
import {
  hasAmenityErrors,
  validateAmenity,
  type Amenity,
  type AmenityDraft,
  type AmenityErrors,
} from '../model/amenity.ts'

/**
 * Where the panel is in a write. Modelled as a union for the same reason the
 * reads are: a form cannot be saving and have succeeded at the same time.
 */
export type WriteState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; message: string }
  | { status: 'failed'; message: string }

type Options = {
  repository?: AmenityRepository
  /** Called after every successful write, so the list can be re-read. */
  onChanged: () => void
}

export function useAmenityAdmin({ repository = httpAmenityRepository, onChanged }: Options) {
  const [write, setWrite] = useState<WriteState>({ status: 'idle' })
  const [errors, setErrors] = useState<AmenityErrors>({})

  const reset = useCallback(() => {
    setWrite({ status: 'idle' })
    setErrors({})
  }, [])

  /** Runs a write, translating whatever the API says into panel state. */
  const run = useCallback(
    async (operation: () => Promise<unknown>, success: string): Promise<boolean> => {
      setWrite({ status: 'saving' })
      try {
        await operation()
        setErrors({})
        setWrite({ status: 'saved', message: success })
        onChanged()
        return true
      } catch (cause) {
        if (cause instanceof HttpError) {
          // The server can reject fields the client accepted; its messages win.
          if (cause.fields) setErrors(cause.fields as AmenityErrors)
          setWrite({ status: 'failed', message: cause.message })
        } else {
          setWrite({ status: 'failed', message: 'No pudimos guardar los cambios.' })
        }
        return false
      }
    },
    [onChanged],
  )

  const save = useCallback(
    async (draft: AmenityDraft, existing: Amenity | null): Promise<boolean> => {
      const found = validateAmenity(draft)
      setErrors(found)

      if (hasAmenityErrors(found)) {
        setWrite({ status: 'failed', message: 'Revisa los campos marcados.' })
        return false
      }

      return existing
        ? run(() => repository.update(existing.id, draft), `Se actualizó ${draft.name}.`)
        : run(() => repository.create(draft), `Se creó ${draft.name}.`)
    },
    [repository, run],
  )

  const destroy = useCallback(
    (amenity: Amenity) =>
      run(() => repository.remove(amenity.id), `Se eliminó ${amenity.name}.`),
    [repository, run],
  )

  return { write, errors, save, destroy, reset }
}
