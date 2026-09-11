import { useAsync } from '@/shared/hooks/useAsync.ts'
import { httpStatRepository, type StatRepository } from '../api/stat.repository.ts'
import type { ProjectStat } from '../model/projectStat.ts'

export function useStats(repository: StatRepository = httpStatRepository) {
  return useAsync<ProjectStat[]>((signal) => repository.findAll(signal))
}
