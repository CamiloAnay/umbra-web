import { useCallback, useEffect, useRef, useState } from 'react'
import { HttpError } from '../lib/http/HttpError.ts'

/**
 * The four states a piece of remote data can be in, as a discriminated union
 * rather than a bag of booleans.
 *
 * The point is that `loading && error` cannot be represented: the compiler
 * refuses the combination, so the interface can never render a spinner on top
 * of an error message, and every consumer is forced to handle all four cases.
 */
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: HttpError }
  | { status: 'empty' }
  | { status: 'ready'; data: T }

type Options<T> = {
  /** Decides what counts as "nothing to show". Empty arrays by default. */
  isEmpty?: (data: T) => boolean
}

const defaultIsEmpty = (data: unknown): boolean => Array.isArray(data) && data.length === 0

export function useAsync<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  { isEmpty = defaultIsEmpty }: Options<T> = {},
): { state: AsyncState<T>; retry: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  // The loader is usually an inline arrow, so it is a new function on every
  // render. Keeping it in a ref lets the effect depend only on the attempt
  // counter without ever reading a stale closure.
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const isEmptyRef = useRef(isEmpty)
  isEmptyRef.current = isEmpty

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    loaderRef
      .current(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setState(isEmptyRef.current(data) ? { status: 'empty' } : { status: 'ready', data })
      })
      .catch((cause: unknown) => {
        // Aborting is how this hook cleans up after itself; it is not a failure.
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          error: cause instanceof HttpError ? cause : HttpError.network(),
        })
      })

    return () => controller.abort()
  }, [attempt])

  return { state, retry }
}
