/**
 * Every failure the UI can face, normalised into one shape. The kind is what
 * the interface branches on: a dead network needs a different message than a
 * rejected form.
 */
export type HttpErrorKind =
  | 'network'
  | 'validation'
  | 'notFound'
  | 'conflict'
  | 'server'
  | 'unknown'

export class HttpError extends Error {
  constructor(
    readonly kind: HttpErrorKind,
    message: string,
    /** Per-field messages, present only when the server rejected a payload. */
    readonly fields?: Readonly<Record<string, string>>,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'HttpError'
  }

  static network(): HttpError {
    return new HttpError(
      'network',
      'No pudimos conectarnos con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    )
  }
}
