import { useCallback, useState } from 'react'
import { HttpError } from '@/shared/lib/http/HttpError.ts'
import { httpLeadRepository, type LeadRepository } from '../api/lead.repository.ts'
import {
  emptyLeadDraft,
  hasErrors,
  validateLead,
  type LeadDraft,
  type LeadErrors,
} from '../model/lead.ts'

/**
 * The submission is a state machine, not a pair of booleans: a form cannot be
 * sending and succeeded at once, and the union makes that unrepresentable.
 */
export type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

export function useLeadForm(repository: LeadRepository = httpLeadRepository) {
  const [draft, setDraft] = useState<LeadDraft>(emptyLeadDraft)
  const [errors, setErrors] = useState<LeadErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof LeadDraft, boolean>>>({})
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })

  const setField = useCallback(
    (field: keyof LeadDraft, value: string) => {
      setDraft((current) => {
        const next = { ...current, [field]: value }
        // Once a field has been visited, re-validate as it is typed so the
        // error clears the moment it is fixed.
        if (touched[field]) {
          setErrors(pick(validateLead(next), field, errors))
        }
        return next
      })
      if (submitState.status !== 'idle') setSubmitState({ status: 'idle' })
    },
    [touched, errors, submitState.status],
  )

  const blurField = useCallback(
    (field: keyof LeadDraft) => {
      setTouched((current) => ({ ...current, [field]: true }))
      setErrors((current) => pick(validateLead(draft), field, current))
    },
    [draft],
  )

  const submit = useCallback(async () => {
    const found = validateLead(draft)
    setErrors(found)
    setTouched({ name: true, email: true, phone: true, message: true })

    if (hasErrors(found)) {
      setSubmitState({
        status: 'error',
        message: 'Revisa los campos marcados antes de enviar.',
      })
      return
    }

    setSubmitState({ status: 'submitting' })

    try {
      const receipt = await repository.submit(draft)
      setDraft(emptyLeadDraft)
      setTouched({})
      setSubmitState({ status: 'success', message: receipt.message })
    } catch (cause) {
      if (cause instanceof HttpError) {
        // The server can reject fields the client accepted; its messages win.
        if (cause.fields) setErrors(cause.fields as LeadErrors)
        setSubmitState({ status: 'error', message: cause.message })
        return
      }
      setSubmitState({
        status: 'error',
        message: 'No pudimos enviar el mensaje. Inténtalo de nuevo en un momento.',
      })
    }
  }, [draft, repository])

  return { draft, errors, touched, submitState, setField, blurField, submit }
}

/** Replaces the message of one field only, leaving the rest untouched. */
function pick(fresh: LeadErrors, field: keyof LeadDraft, previous: LeadErrors): LeadErrors {
  const next = { ...previous }
  if (fresh[field]) next[field] = fresh[field]
  else delete next[field]
  return next
}
