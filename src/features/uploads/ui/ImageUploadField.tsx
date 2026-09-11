import { useId, useRef, useState } from 'react'
import { HttpError } from '@/shared/lib/http/HttpError.ts'
import { assetUrl } from '@/shared/lib/http/assets.ts'
import { buttonClasses } from '@/shared/ui/atoms/buttonStyles.ts'
import { httpUploadRepository, type UploadRepository } from '../api/upload.repository.ts'

type Props = {
  /** Stored value: the base path, without extension. Empty when there is none. */
  value: string
  onChange: (path: string) => void
  error?: string | undefined
  label?: string
  repository?: UploadRepository
}

type State = { status: 'idle' } | { status: 'uploading' } | { status: 'failed'; message: string }

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif'

/**
 * Picks a photograph, sends it, and keeps the path the server returns.
 *
 * The native file input is visually hidden and a label drives it. That is not
 * decoration: the browser's own button carries an intrinsic width and a locale
 * label that cannot be shortened, so inside a narrow column it overflows and
 * gets clipped. A label can be sized, and it stays keyboard accessible because
 * the real input keeps the focus — `peer-focus-visible` draws the ring on the
 * label instead.
 */
export function ImageUploadField({
  value,
  onChange,
  error,
  label = 'Fotografía',
  repository = httpUploadRepository,
}: Props) {
  const inputId = useId()
  const labelId = `${inputId}-label`
  const helpId = `${inputId}-help`
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<State>({ status: 'idle' })

  const uploading = state.status === 'uploading'
  const message = state.status === 'failed' ? state.message : error

  const onPick = async (file: File | undefined) => {
    if (!file) return
    setState({ status: 'uploading' })

    try {
      const uploaded = await repository.upload(file)
      onChange(uploaded.path)
      setState({ status: 'idle' })
    } catch (cause) {
      setState({
        status: 'failed',
        message: cause instanceof HttpError ? cause.message : 'No pudimos subir la imagen',
      })
    } finally {
      // Clear the input so choosing the same file again still fires a change.
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="font-display text-[11.5px] font-semibold text-ink/60 md:text-[12px]">
        {label}
      </span>

      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="grid h-20 w-20 flex-none place-items-center overflow-hidden border
            border-ink/15 bg-lime"
        >
          {value ? (
            <img
              src={assetUrl(`${value}-sm.webp`)}
              alt=""
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden'
              }}
            />
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-ink/25">
              <path
                d="M2 16l5-5 4 4 3-3 6 6M2 3h18v16H2z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          )}
        </span>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            disabled={uploading}
            aria-labelledby={labelId}
            aria-describedby={message ? `${inputId}-error` : helpId}
            aria-invalid={Boolean(message)}
            onChange={(event) => void onPick(event.target.files?.[0])}
            className="peer sr-only"
          />

          <label
            htmlFor={inputId}
            className={buttonClasses(
              'outline',
              `whitespace-nowrap peer-focus-visible:outline peer-focus-visible:outline-2
               peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blueprint
               ${uploading ? 'pointer-events-none opacity-60' : ''}`,
            )}
          >
            {uploading ? 'Subiendo…' : value ? 'Reemplazar imagen' : 'Seleccionar imagen'}
          </label>

          <p id={helpId} className="text-[0.8125rem] leading-snug text-ink/55">
            {uploading
              ? 'Convirtiendo a WebP en dos tamaños.'
              : value
                ? 'Imagen cargada.'
                : 'JPG, PNG, WebP o AVIF, hasta 8 MB.'}
          </p>
        </div>
      </div>

      {message && (
        <p id={`${inputId}-error`} className="cota">
          {message}
        </p>
      )}
    </div>
  )
}
