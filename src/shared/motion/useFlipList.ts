import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react'
import { Flip, gsap } from './gsap.ts'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'

type Options = {
  /** Selector for the items that move inside the container. */
  items: string
  /** Anything that changes the list, so the animation runs after that render. */
  dependency: unknown
}

/**
 * Animates a list through a layout change.
 *
 * Filtering re-orders and removes cards, and the browser does not interpolate
 * layout: elements simply appear in their new positions. FLIP is the technique
 * for exactly that — measure First, let the Last state render, Invert the
 * difference as a transform, then Play it out. `Flip.getState` records the
 * positions before React re-renders, and `Flip.from` animates from those to
 * wherever the new render put everything.
 *
 * `capture` has to run before the state update that changes the list, which is
 * why it is returned instead of being called here.
 */
export function useFlipList(
  containerRef: RefObject<HTMLElement | null>,
  { items, dependency }: Options,
): { capture: () => void } {
  const reducedMotion = useReducedMotion()
  const stateRef = useRef<ReturnType<typeof Flip.getState> | null>(null)

  const capture = useCallback(() => {
    const container = containerRef.current
    if (!container || reducedMotion) return
    stateRef.current = Flip.getState(container.querySelectorAll(items))
  }, [containerRef, items, reducedMotion])

  useLayoutEffect(() => {
    const captured = stateRef.current
    if (!captured || reducedMotion) return
    stateRef.current = null

    Flip.from(captured, {
      duration: 0.55,
      ease: 'power2.inOut',
      // Cards are taken out of the flow while they travel, so the ones staying
      // put do not get pushed around by the ones leaving.
      absolute: true,
      // Cards that appear grow into place; cards that go, shrink away. Both are
      // staggered so the group reads as a single movement.
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in' }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency, reducedMotion])

  return { capture }
}
