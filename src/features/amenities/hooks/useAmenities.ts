import { useAsync } from '@/shared/hooks/useAsync.ts'
import { httpAmenityRepository, type AmenityRepository } from '../api/amenity.repository.ts'
import type { Amenity } from '../model/amenity.ts'

export function useAmenities(repository: AmenityRepository = httpAmenityRepository) {
  return useAsync<Amenity[]>((signal) => repository.findAll(signal))
}
