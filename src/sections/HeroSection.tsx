import { useRef } from 'react'
import { Figure } from '@/shared/ui/molecules/Figure.tsx'
import { Measure } from '@/shared/ui/atoms/Measure.tsx'
import { useParallax } from '@/shared/motion/useParallax.ts'
import { buttonClasses } from '@/shared/ui/atoms/buttonStyles.ts'
import { useIntro } from '@/shared/motion/useIntro.ts'

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const wordShadowRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Three depths tied to the scrollbar. The shadow travels furthest, so as the
  // page moves the shadow sweeps out from under the facade the way it would as
  // the sun drops. The motion is the concept of the project, not decoration.
  useIntro({ shadow: wordShadowRef, title: titleRef, body: bodyRef, photo: photoRef })

  useParallax(containerRef, [
    { ref: photoRef, depth: 0.14 },
    { ref: shadowRef, depth: 0.4 },
    { ref: wordRef, depth: -0.08 },
  ])

  return (
    <section ref={containerRef} id="top" className="relative overflow-hidden pb-16 md:pb-[124px]">
      <div className="frame pt-28 md:pt-[152px]">
        {/* The word throws its own shadow: the page's thesis, stated once. */}
        <div ref={wordRef} className="relative h-[3.25rem] md:h-[9.5rem]">
          <div
            ref={wordShadowRef}
            aria-hidden
            className="absolute bottom-0 left-0 whitespace-nowrap font-display text-hero
              font-bold w-wide tracking-[-0.035em] text-cast opacity-[0.28]"
            style={{ transform: 'skewX(58deg) scaleY(0.58)', transformOrigin: 'bottom left' }}
          >
            UMBRAL
          </div>
          <span className="absolute bottom-0 left-0 block overflow-hidden pb-[0.06em]">
            <h1
              ref={titleRef}
              className="whitespace-nowrap text-hero font-bold w-wide tracking-[-0.035em]"
            >
              UMBRAL
            </h1>
          </span>
        </div>
      </div>

      <div className="frame mt-10 flex flex-col gap-10 md:mt-[52px] md:flex-row md:items-end md:gap-14">
        <div ref={bodyRef} className="md:flex-1 md:pb-6">
          <p className="max-w-[30ch] text-lead text-ink/88">
            48 apartamentos en la loma de El Poblado. Fachada al occidente, entrega en 2028.
          </p>

          <div className="mt-8 flex flex-col items-start gap-7 md:mt-[34px]">
            <a href="#contacto" className={buttonClasses('solid')}>
              Agendar visita
            </a>
            <Measure length={74}>Cra. 34 con Cl. 10 · 600 m a Parque Lleras</Measure>
          </div>
        </div>

        <div className="relative md:h-[560px] md:w-[588px] md:flex-none">
          {/* A second, wider and softer shadow: the ambient one under the volume. */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-full w-full bg-cast opacity-[0.1]"
            style={{
              transform: 'skewX(64deg) scaleY(0.78)',
              transformOrigin: 'bottom left',
              filter: 'blur(26px)',
            }}
          />
          <div ref={shadowRef} className="absolute inset-0">
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-full w-full bg-cast"
              style={{
                transform: 'skewX(58deg) scaleY(0.44)',
                transformOrigin: 'bottom left',
                filter: 'blur(2px)',
                opacity: 0.24,
              }}
            />
          </div>
          <div ref={photoRef} className="relative h-[24rem] md:h-full">
            <Figure
              src="/img/facade-wide"
              alt="Fachada de UMBRAL con la sombra rasante de las cuatro de la tarde sobre el andén"
              width={1600}
              height={1008}
              priority
              shadow={false}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
