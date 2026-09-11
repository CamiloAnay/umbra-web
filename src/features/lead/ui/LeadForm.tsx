import type { FormEvent } from 'react'
import { FormField } from '@/shared/ui/molecules/FormField.tsx'
import { buttonClasses } from '@/shared/ui/atoms/buttonStyles.ts'
import { useLeadForm } from '../hooks/useLeadForm.ts'

/**
 * The contact form.
 *
 * Validation runs twice on purpose: here, so the answer is immediate, and on
 * the server, because the server cannot trust this one. The messages are the
 * same text on both sides, so a field never says two different things.
 */
export function LeadForm() {
  const { draft, errors, touched, submitState, setField, blurField, submit } = useLeadForm()
  const submitting = submitState.status === 'submitting'

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    void submit()
  }

  const fieldError = (field: keyof typeof draft) => (touched[field] ? errors[field] : undefined)

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7 md:grid-cols-2 md:gap-x-6 md:gap-y-[30px]">
      <FormField
        id="lead-name"
        label="Nombre"
        name="name"
        autoComplete="name"
        placeholder="Nombre y apellido"
        value={draft.name}
        error={fieldError('name')}
        onChange={(event) => setField('name', event.target.value)}
        onBlur={() => blurField('name')}
      />

      <FormField
        id="lead-email"
        label="Correo"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="nombre@correo.com"
        value={draft.email}
        error={fieldError('email')}
        onChange={(event) => setField('email', event.target.value)}
        onBlur={() => blurField('email')}
      />

      <FormField
        id="lead-phone"
        label="Teléfono"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+57"
        value={draft.phone}
        error={fieldError('phone')}
        onChange={(event) => setField('phone', event.target.value)}
        onBlur={() => blurField('phone')}
      />

      <FormField
        id="lead-message"
        label="Mensaje"
        as="textarea"
        name="message"
        rows={3}
        placeholder="Qué día y a qué hora le queda bien"
        value={draft.message}
        error={fieldError('message')}
        onChange={(event) => setField('message', event.target.value)}
        onBlur={() => blurField('message')}
        className="md:col-span-2"
      />

      <div className="flex flex-col items-start gap-4 md:col-span-2">
        <button type="submit" disabled={submitting} className={buttonClasses('solid')}>
          {submitting ? 'Enviando…' : 'Agendar visita'}
        </button>

        {/* The outcome is announced, not just coloured. */}
        <p
          role="status"
          aria-live="polite"
          className={`min-h-[1.5rem] text-[1rem] ${
            submitState.status === 'error' ? 'text-blueprint' : 'text-ink/70'
          }`}
        >
          {submitState.status === 'success' && submitState.message}
          {submitState.status === 'error' && submitState.message}
        </p>
      </div>
    </form>
  )
}
