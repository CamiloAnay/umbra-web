import { get, patch, post, remove } from '@/shared/lib/http/httpClient.ts'
import type { Amenity, AmenityDraft } from '../model/amenity.ts'

/**
 * Port. The hooks depend on this interface rather than on `fetch`, which is
 * what lets the tests hand them a fake and exercise every path — including the
 * conflict and the failed delete — without a network or a running server.
 */
export interface AmenityRepository {
  findAll(signal?: AbortSignal): Promise<Amenity[]>
  create(draft: AmenityDraft, signal?: AbortSignal): Promise<Amenity>
  update(id: string, draft: AmenityDraft, signal?: AbortSignal): Promise<Amenity>
  remove(id: string, signal?: AbortSignal): Promise<void>
}

export const httpAmenityRepository: AmenityRepository = {
  findAll: (signal) => get<Amenity[]>('/amenities', { signal }),
  create: (draft, signal) => post<Amenity>('/amenities', draft, { signal }),
  update: (id, draft, signal) => patch<Amenity>(`/amenities/${id}`, draft, { signal }),
  remove: (id, signal) => remove(`/amenities/${id}`, { signal }),
}
