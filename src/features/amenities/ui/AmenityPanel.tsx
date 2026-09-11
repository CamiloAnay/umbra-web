import { useEffect, useRef } from 'react'
import { Figure } from '@/shared/ui/molecules/Figure.tsx'
import { Measure } from '@/shared/ui/atoms/Measure.tsx'
import { gsap } from '@/shared/motion/gsap.ts'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion.ts'
import type { Amenity } from '../model/amenity.ts'

type Props = {
  amenity: Amenity
}

/** Presentational: renders whichever amenity it is handed, and crosses over. */
export function AmenityPanel({ amenity }: Props) {
  const photoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // The photograph and the text arrive together but at different distances, so
  // the change reads as one movement rather than two elements being swapped.
  useEffect(() => {
    if (reducedMotion) return

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .fromTo(photoRef.current, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.6 }, 0)
        .fromTo(textRef.current?.children ?? [], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 }, 0.1)
    })

    return () => context.revert()
  }, [amenity.id, reducedMotion])

  return (
    <div
      id={`amenidad-${amenity.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${amenity.id}`}
      tabIndex={-1}
    >
      <div ref={photoRef}>
        <Figure
          src={amenity.image}
          alt={amenity.summary}
          width={1600}
          height={1000}
          className="mb-6 h-[18rem] md:h-[470px]"
          shadow={{ flatness: 0.28 }}
        />
      </div>

      <div ref={textRef} className="flex flex-col gap-6 md:flex-row md:items-start md:gap-14">
        <p className="max-w-[58ch] flex-1 text-prose text-ink/86">{amenity.description}</p>
        <Measure length={96} className="md:pt-1.5">
          {amenity.measure}
        </Measure>
      </div>
    </div>
  )
}
