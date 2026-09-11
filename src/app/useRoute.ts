import { useCallback, useSyncExternalStore } from 'react'

export type Route = 'landing' | 'admin'

const ADMIN_PATH = '/admin'

function subscribe(callback: () => void): () => void {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

function currentRoute(): Route {
  return window.location.pathname.replace(/\/+$/, '') === ADMIN_PATH ? 'admin' : 'landing'
}

/**
 * Two views do not justify a routing library.
 *
 * This reads the path, listens for back and forward, and pushes history on
 * navigation — which is the whole of what the app needs. The server side is
 * already handled: nginx falls back to the document for any unknown path, so
 * opening /admin directly works.
 */
export function useRoute(): { route: Route; navigate: (to: Route) => void } {
  const route = useSyncExternalStore(subscribe, currentRoute, () => 'landing' as Route)

  const navigate = useCallback((to: Route) => {
    window.history.pushState(null, '', to === 'admin' ? ADMIN_PATH : '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0 })
  }, [])

  return { route, navigate }
}
