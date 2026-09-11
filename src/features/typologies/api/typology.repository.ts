import { get } from '@/shared/lib/http/httpClient.ts'
import type { Typology } from '../model/typology.ts'

/**
 * Port. The hook depends on this interface rather than on `fetch`, which is
 * what lets the tests hand it a fake and exercise the error path without a
 * network or a running server.
 */
export interface TypologyRepository {
  findAll(signal?: AbortSignal): Promise<Typology[]>
}

export const httpTypologyRepository: TypologyRepository = {
  findAll: (signal) => get<Typology[]>('/typologies', { signal }),
}
