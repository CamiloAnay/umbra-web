import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap.ts'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'

type Layer = {
  ref: RefObject<HTMLElement | null>
  /**
   * How far the layer travels across the whole scroll of its container, as a
   * fraction of that distance. Positive lags behind, negative runs ahead.
   */
  depth: number
}

/**
 * Real parallax: each layer is tied to the scroll position of its container
 * through `scrub`, so it tracks the scrollbar instead of playing on a timer.
 *
 * The layers do not merely move at different speeds — the shadow layer travels
 * furthest, so as the page scrolls the cast shadow sweeps across the facade
 * the way it would as the sun drops. The motion is the concept, not decoration.
 */
export function useParallax(
  containerRef: RefObject<HTMLElement | null>,
  layers: readonly Layer[],
): void {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container || reducedMotion) return

    const context = gsap.context(() => {
      for (const { ref, depth } of layers) {
        if (!ref.current) continue
        gsap.to(ref.current, {
          yPercent: depth * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, container)

    return () => context.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, reducedMotion])
}
