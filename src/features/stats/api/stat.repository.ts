import { get } from '@/shared/lib/http/httpClient.ts'
import type { ProjectStat } from '../model/projectStat.ts'

export interface StatRepository {
  findAll(signal?: AbortSignal): Promise<ProjectStat[]>
}

export const httpStatRepository: StatRepository = {
  findAll: (signal) => get<ProjectStat[]>('/stats', { signal }),
}
