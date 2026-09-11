import type { ReactNode } from 'react'
import type { AsyncState } from '@/shared/hooks/useAsync.ts'
import { buttonClasses } from '../atoms/buttonStyles.ts'

type Props<T> = {
  state: AsyncState<T>
  onRetry: () => void
  /** What to show while the data travels. */
  skeleton: ReactNode
  /** Copy for the empty case, written for this particular section. */
  emptyMessage: string
  children: (data: T) => ReactNode
}

/**
 * Renders the four states of a remote read in one place.
 *
 * Because `AsyncState` is a discriminated union, the compiler will not let a
 * case be forgotten here — which is the whole reason for modelling it that way
 * instead of juggling `isLoading` and `error` booleans in every section.
 */
export function AsyncBoundary<T>({
  state,
  onRetry,
  skeleton,
  emptyMessage,
  children,
}: Props<T>) {
  switch (state.status) {
    case 'loading':
      return (
        <div aria-busy="true" aria-live="polite">
          <span className="sr-only">Cargando</span>
          {state.slow && (
            <p className="mb-6 max-w-[52ch] border-l-2 border-blueprint py-1 pl-5 text-ink/70">
              El servidor está despertando. La primera carga después de un rato sin visitas puede
              tardar cerca de un minuto.
            </p>
          )}
          {skeleton}
        </div>
      )

    case 'error':
      return (
        <div role="alert" className="max-w-[52ch] border-l-2 border-blueprint py-1 pl-5">
          <p className="text-lead">{state.error.message}</p>
          <button type="button" onClick={onRetry} className={buttonClasses('quiet', 'mt-3')}>
            Reintentar
          </button>
        </div>
      )

    case 'empty':
      return (
        <p className="max-w-[52ch] border-l-2 border-ink/25 py-1 pl-5 text-lead text-ink/70">
          {emptyMessage}
        </p>
      )

    case 'ready':
      return <>{children(state.data)}</>
  }
}
