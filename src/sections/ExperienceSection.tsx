import { useEffect, useRef } from 'react'
import { Figure } from '@/shared/ui/molecules/Figure.tsx'
import { Measure } from '@/shared/ui/atoms/Measure.tsx'
import { gsap, ScrollTrigger } from '@/shared/motion/gsap.ts'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion.ts'

/**
 * The immersive section.
 *
 * On a wide screen it pins: the room holds still while the page keeps
 * scrolling, the light wash slides off it and the text settles. That is the
 * point of the section — four o'clock lasts about seventy minutes, and pinning
 * is how a page can hold a moment instead of passing through it.
 *
 * On a phone it does not pin. Pinning fights the momentum scrolling of a touch
 * screen and steals the gesture, so there the photograph just drifts.
 */
export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const washRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    if (!section || reducedMotion) return

    const media = gsap.matchMedia()

    media.add('(min-width: 768px)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=90%',
          pin: stageRef.current,
          scrub: 0.6,
        },
      })

      timeline
        .fromTo(imageRef.current, { scale: 1.14 }, { scale: 1, ease: 'none' }, 0)
        .fromTo(washRef.current, { xPercent: 0 }, { xPercent: -24, ease: 'none' }, 0)
        .fromTo(copyRef.current, { y: 0 }, { y: -70, ease: 'none' }, 0)
    })

    media.add('(max-width: 767px)', () => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -6, scale: 1.1 },
        {
          yPercent: 6,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })

    return () => {
      media.revert()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  return (
    <section ref={sectionRef} aria-labelledby="experiencia-titulo" className="relative">
      <div
        ref={stageRef}
        className="relative h-[34rem] overflow-hidden bg-cast md:h-screen md:max-h-[44rem]"
      >
        <div ref={imageRef} className="absolute inset-0">
          <Figure
            src="/img/interior"
            alt="Interior a las cuatro de la tarde, con la sombra de la aleta cruzando el piso"
            width={1920}
            height={1104}
            shadow={false}
            className="h-full"
          />
        </div>

        <div
          ref={washRef}
          aria-hidden
          className="pointer-events-none absolute -inset-x-1/4 inset-y-0
            bg-[linear-gradient(180deg,rgba(229,226,217,.94)_0%,rgba(229,226,217,.86)_38%,rgba(229,226,217,0)_76%)]
            md:bg-[linear-gradient(105deg,rgba(229,226,217,.94)_0%,rgba(229,226,217,.94)_26%,rgba(229,226,217,.88)_42%,rgba(229,226,217,0)_68%)]"
        />

        <div
          ref={copyRef}
          className="pointer-events-none absolute inset-x-[var(--spacing-gutter)] top-11
            md:inset-x-auto md:left-24 md:top-1/2 md:w-[560px] md:-translate-y-1/2"
        >
          <h2 id="experiencia-titulo" className="text-immersive font-bold tracking-[-0.035em]">
            Las cuatro
            <br />
            de la tarde
          </h2>
          <p className="mt-4 max-w-[40ch] text-lead text-ink/88 md:mt-6">
            Es la hora en que el sol entra por el occidente con 22 grados de inclinación y la sombra
            de la aleta llega hasta el fondo de la sala. Dura cerca de 70 minutos.
          </p>
          <Measure length={110} className="mt-8 hidden md:flex">
            sol a 22° · sombra de 3,8 m
          </Measure>
        </div>
      </div>
    </section>
  )
}
