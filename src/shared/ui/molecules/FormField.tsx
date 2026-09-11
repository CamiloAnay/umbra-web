import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

type Base = {
  id: string
  label: string
  error?: string | undefined
  className?: string
}

type InputProps = Base & { as?: 'input' } & InputHTMLAttributes<HTMLInputElement>
type TextareaProps = Base & { as: 'textarea' } & TextareaHTMLAttributes<HTMLTextAreaElement>

const control =
  'border-0 border-b bg-transparent py-2.5 font-body text-[17px] outline-none transition-colors ' +
  'placeholder:text-ink/35 focus:border-blueprint md:text-[17.5px]'

/**
 * A labelled control that carries its own error.
 *
 * The message is tied to the input with `aria-describedby` and the field is
 * marked `aria-invalid`, so a screen reader announces what is wrong when focus
 * lands there — a coloured underline alone only works for people who see it.
 */
export function FormField(props: InputProps | TextareaProps) {
  const errorId = `${props.id}-error`
  const border = props.error ? 'border-blueprint' : 'border-ink/30'
  const shared = {
    id: props.id,
    'aria-invalid': Boolean(props.error),
    'aria-describedby': props.error ? errorId : undefined,
  }

  // The union is narrowed here, before the spread, so each branch keeps the
  // element-specific event types instead of collapsing into a union of both.
  if (props.as === 'textarea') {
    const { id: _id, label, error, className, as: _as, ...rest } = props
    return (
      <Field id={props.id} label={label} error={error} errorId={errorId} className={className}>
        <textarea {...rest} {...shared} className={`${control} ${border} resize-none`} />
      </Field>
    )
  }

  const { id: _id, label, error, className, as: _as, ...rest } = props
  return (
    <Field id={props.id} label={label} error={error} errorId={errorId} className={className}>
      <input {...rest} {...shared} className={`${control} ${border}`} />
    </Field>
  )
}

type FieldProps = {
  id: string
  label: string
  error: string | undefined
  errorId: string
  className: string | undefined
  children: ReactNode
}

function Field({ id, label, error, errorId, className = '', children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="font-display text-[11.5px] font-semibold text-ink/60 md:text-[12px]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="cota">
          {error}
        </p>
      )}
    </div>
  )
}
