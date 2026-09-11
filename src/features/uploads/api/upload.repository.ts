import { HttpError } from '@/shared/lib/http/HttpError.ts'

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1').replace(/\/$/, '')

export type UploadedImage = { path: string }

export interface UploadRepository {
  upload(file: File, signal?: AbortSignal): Promise<UploadedImage>
}

/**
 * Uploads go through their own client rather than the shared JSON one: the
 * body is multipart, and setting `content-type` by hand would strip the
 * boundary the browser generates.
 */
export const httpUploadRepository: UploadRepository = {
  async upload(file, signal) {
    const body = new FormData()
    body.append('file', file)

    let response: Response
    try {
      response = await fetch(`${BASE_URL}/uploads`, {
        method: 'POST',
        body,
        ...(signal ? { signal } : {}),
      })
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
      throw HttpError.network()
    }

    const payload = (await response.json().catch(() => null)) as
      | { data?: UploadedImage; error?: { message?: string } }
      | null

    if (!response.ok) {
      throw new HttpError(
        response.status === 413 ? 'validation' : 'server',
        payload?.error?.message ?? 'No pudimos subir la imagen',
        undefined,
        response.status,
      )
    }

    if (!payload?.data) throw new HttpError('server', 'El servidor no devolvió la ruta de la imagen')
    return payload.data
  },
}
