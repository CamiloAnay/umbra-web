const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'

/** Origin of the API, derived from its base URL. */
const API_ORIGIN = new URL(BASE_URL, 'http://localhost').origin

/**
 * Resolves an image path to a URL the browser can fetch.
 *
 * Built-in photographs live under `/img` and are served by this site.
 * Uploaded ones live under `/uploads` and are served by the API, which is a
 * different origin, so they need the prefix. Keeping the stored value relative
 * means the data does not carry a hostname that changes with the environment.
 */
export function assetUrl(path: string): string {
  return path.startsWith('/uploads/') ? `${API_ORIGIN}${path}` : path
}
