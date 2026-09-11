import { useAsync } from '@/shared/hooks/useAsync.ts'
import {
  httpPointOfInterestRepository,
  type PointOfInterestRepository,
} from '../api/pointOfInterest.repository.ts'
import type { PointOfInterest } from '../model/pointOfInterest.ts'

export function usePointsOfInterest(
  repository: PointOfInterestRepository = httpPointOfInterestRepository,
) {
  return useAsync<PointOfInterest[]>((signal) => repository.findAll(signal))
}
