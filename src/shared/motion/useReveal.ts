import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from './gsap.ts'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'

type Options = {
  /** Selector for the children that travel. Without it, the element itself moves. */
  children?: string
  /** Delay between each child, in seconds. */
  stagger?: number
  /** Travel distance in pixels. */
  distance?: number
  /** Portion of the viewport that must be crossed before it fires. */
  start?: string
}

/**
 * Reveals an element when it enters the viewport.
 *
 * The hidden state is applied by GSAP, never by CSS. That ordering matters: if
 * this hook does not run — reduced motion, a JavaScript failure, an old
 * browser — the content is simply visible, instead of being stuck at
 * `opacity: 0` with nothing left to reveal it.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, options: Options = {}): void {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion) return

    const { children, stagger = 0.08, distance = 28, start = 'top 82%' } = options
    const targets = children ? element.querySelectorAll<HTMLElement>(children) : element
    if (children && (targets as NodeListOf<HTMLElement>).length === 0) return

    const context = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: distance,
        duration: 0.75,
        ease: 'power2.out',
        stagger: children ? stagger : 0,
        scrollTrigger: { trigger: element, start, once: true },
      })
    }, element)

    return () => context.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, reducedMotion])

  useEffect(() => ScrollTrigger.refresh, [])
}
