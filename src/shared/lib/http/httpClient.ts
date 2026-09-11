import { HttpError, type HttpErrorKind } from './HttpError.ts'

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1').replace(/\/$/, '')

/** The envelope every read endpoint answers with. */
type DataEnvelope<T> = { data: T }

/** The envelope every failing endpoint answers with. */
type ErrorEnvelope = {
  error?: { message?: string; fields?: Record<string, string> }
}

type RequestOptions = {
  signal?: AbortSignal | undefined
}

export async function get<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return unwrap<T>(await send(path, 'GET', undefined, options))
}

export async function post<T>(
  path: string,
  payload: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return unwrap<T>(await send(path, 'POST', payload, options))
}

export async function patch<T>(
  path: string,
  payload: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return unwrap<T>(await send(path, 'PATCH', payload, options))
}

/** The API answers 204 with no body, so there is nothing to unwrap. */
export async function remove(path: string, options: RequestOptions = {}): Promise<void> {
  await send(path, 'DELETE', undefined, options)
}

/** `POST /leads` answers with its own shape, not the `{ data }` envelope. */
export async function postRaw<T>(
  path: string,
  payload: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const response = await send(path, 'POST', payload, options)
  return (await parseJson(response)) as T
}

async function unwrap<T>(response: Response): Promise<T> {
  const body = (await parseJson(response)) as DataEnvelope<T>
  return body.data
}

async function send(
  path: string,
  method: string,
  payload: unknown,
  { signal }: RequestOptions,
): Promise<Response> {
  const init: RequestInit = {
    method,
    ...(payload === undefined
      ? {}
      : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
    ...(signal ? { signal } : {}),
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, init)
  } catch (cause) {
    // An aborted request is a cancellation, not a failure: let it through so
    // the caller can ignore it instead of painting an error state.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw HttpError.network()
  }

  if (!response.ok) throw await toHttpError(response)
  return response
}

async function toHttpError(response: Response): Promise<HttpError> {
  const body = await safeJson<ErrorEnvelope>(response)
  const message = body?.error?.message ?? 'Ocurrió un error inesperado'
  const fields = body?.error?.fields

  return new HttpError(kindFor(response.status), message, fields, response.status)
}

function kindFor(status: number): HttpErrorKind {
  if (status === 400 || status === 422) return 'validation'
  if (status === 404) return 'notFound'
  if (status === 409) return 'conflict'
  if (status >= 500) return 'server'
  return 'unknown'
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    throw new HttpError('server', 'El servidor respondió con un formato inesperado')
  }
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}
