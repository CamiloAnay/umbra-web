import { get } from '@/shared/lib/http/httpClient.ts'
import type { PointOfInterest } from '../model/pointOfInterest.ts'

export interface PointOfInterestRepository {
  findAll(signal?: AbortSignal): Promise<PointOfInterest[]>
}

export const httpPointOfInterestRepository: PointOfInterestRepository = {
  findAll: (signal) => get<PointOfInterest[]>('/points-of-interest', { signal }),
}
