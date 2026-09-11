const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'

/**
 * Origin of the API, or an empty string when it shares this site's origin.
 *
 * The base URL takes two shapes depending on how the app is deployed. Split
 * across two hosts it is absolute, and uploaded photographs need that origin
 * prepended. Behind one nginx it is the relative `/api/v1`, and prepending
 * anything would be wrong: deriving an origin from a relative URL yields
 * whatever base was used to parse it, which would send every visitor to their
 * own machine.
 */
const API_ORIGIN = /^https?:\/\//i.test(BASE_URL) ? new URL(BASE_URL).origin : ''

/**
 * Resolves an image path to a URL the browser can fetch.
 *
 * Built-in photographs live under `/img` and are served by this site.
 * Uploaded ones live under `/uploads` and are served by the API, which may or
 * may not be the same origin. Keeping the stored value relative means the data
 * never carries a hostname that changes with the environment.
 */
export function assetUrl(path: string): string {
  if (!path.startsWith('/uploads/')) return path
  return API_ORIGIN ? `${API_ORIGIN}${path}` : path
}
