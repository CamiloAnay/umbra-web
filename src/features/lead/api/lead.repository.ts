import { postRaw } from '@/shared/lib/http/httpClient.ts'
import type { LeadDraft } from '../model/lead.ts'

export type LeadReceipt = {
  data: { id: string; createdAt: string }
  message: string
}

export interface LeadRepository {
  submit(draft: LeadDraft, signal?: AbortSignal): Promise<LeadReceipt>
}

export const httpLeadRepository: LeadRepository = {
  submit: (draft, signal) => postRaw<LeadReceipt>('/leads', draft, { signal }),
}
