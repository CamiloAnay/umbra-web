import { useEffect, useRef } from 'react'
import { gsap } from '@/shared/motion/gsap.ts'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion.ts'
import { formatStatValue, type ProjectStat } from '../model/projectStat.ts'

type Props = {
  stat: ProjectStat
}

/** Presentational: it knows one figure and how to count up to it. */
export function StatRow({ stat }: Props) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = valueRef.current
    if (!element || reducedMotion) return

    // React already rendered the final value, so if this never runs the figure
    // on screen is still correct.
    const counter = { current: 0 }
    const context = gsap.context(() => {
      gsap.to(counter, {
        current: stat.value,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        onUpdate: () => {
          element.textContent = formatStatValue(Math.round(counter.current))
        },
      })
    }, element)

    return () => context.revert()
  }, [stat, reducedMotion])

  return (
    <div className="flex flex-col border-b border-ink/14 py-5 md:flex-row md:items-end md:gap-8 md:py-[30px]">
      <div className="flex items-baseline gap-2.5 md:w-[300px] md:flex-none">
        <span
          ref={valueRef}
          className="font-display text-figure font-semibold w-wide tabular-nums tracking-[-0.03em]"
        >
          {formatStatValue(stat.value)}
        </span>
        <span className="text-[1.0625rem] text-ink/60 md:text-[1.25rem]">{stat.unit}</span>
      </div>

      <div aria-hidden className="my-2 flex flex-1 items-center md:mb-3 md:mt-0">
        <span className="h-2.5 w-px bg-blueprint" />
        <span className="h-px flex-1 bg-blueprint/55" />
        <span className="h-2.5 w-px bg-blueprint" />
      </div>

      <p className="text-[1rem] leading-[1.55] text-ink/80 md:w-[330px] md:flex-none md:pb-2 md:text-[1.09375rem]">
        {stat.note}
      </p>
    </div>
  )
}
