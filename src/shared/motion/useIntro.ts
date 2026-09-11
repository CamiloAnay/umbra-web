import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap.ts'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'

type Refs = {
  shadow: RefObject<HTMLElement | null>
  title: RefObject<HTMLElement | null>
  body: RefObject<HTMLElement | null>
  photo: RefObject<HTMLElement | null>
}

/**
 * The one orchestrated moment on load: the sun arrives.
 *
 * The shadow stretches out from the letters first, the word rises into its own
 * clip, and only then does the rest settle. It runs once, on entry, because a
 * single sequence reads as intent while effects scattered over every section
 * read as decoration.
 *
 * Nothing here animates opacity on the heading. That heading is the largest
 * element painted, so fading it in would push back the moment the browser
 * considers the page rendered. It is painted immediately and moves inside a
 * clip instead.
 */
export function useIntro({ shadow, title, body, photo }: Refs): void {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (title.current) {
        timeline.from(title.current, { yPercent: 116, duration: 0.9 }, 0)
      }

      if (shadow.current) {
        // The shadow grows from nothing, as if the sun had just cleared the
        // building opposite.
        timeline.from(
          shadow.current,
          { scaleX: 0.2, opacity: 0, transformOrigin: 'bottom left', duration: 1.1 },
          0.12,
        )
      }

      if (photo.current) {
        timeline.from(photo.current, { yPercent: 6, opacity: 0, duration: 1 }, 0.2)
      }

      if (body.current) {
        timeline.from(
          body.current.children,
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.09 },
          0.45,
        )
      }
    })

    return () => context.revert()
  }, [reducedMotion, shadow, title, body, photo])
}
