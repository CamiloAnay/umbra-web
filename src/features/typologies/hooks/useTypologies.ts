import { useAsync } from '@/shared/hooks/useAsync.ts'
import { httpTypologyRepository, type TypologyRepository } from '../api/typology.repository.ts'
import type { Typology } from '../model/typology.ts'

export function useTypologies(repository: TypologyRepository = httpTypologyRepository) {
  return useAsync<Typology[]>((signal) => repository.findAll(signal))
}
