import { useRef } from 'react'
import { Figure } from '@/shared/ui/molecules/Figure.tsx'
import { Measure } from '@/shared/ui/atoms/Measure.tsx'
import { useReveal } from '@/shared/motion/useReveal.ts'

export function ProjectSection() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { children: '[data-reveal]', stagger: 0.1 })

  return (
    <section ref={ref} id="proyecto" className="relative py-section">
      <div className="frame grid items-start gap-12 lg:grid-cols-2 lg:gap-[104px]">
        <div data-reveal>
          <h2 className="text-section">
            Dos volúmenes
            <br />y un patio entre ellos
          </h2>

          <p className="mt-8 max-w-[62ch] text-prose text-ink/86 md:mt-10">
            El lote tiene 62 metros de frente sobre la calle y una pendiente de 6 metros. En vez de
            un solo bloque, el proyecto son dos torres de nueve niveles separadas por un patio de
            420 m² que atraviesa la manzana de oriente a occidente.
          </p>

          <p className="mt-6 max-w-[62ch] text-prose text-ink/86">
            Los apartamentos de la torre occidental reciben sol desde las dos de la tarde. Las
            aletas de concreto de la fachada tienen 45 cm de profundidad: alcanzan para cortar el
            sol alto del mediodía y dejar entrar el rasante.
          </p>

          <Measure length={130} className="mt-9">
            altura libre 2,70 m · aleta 45 cm
          </Measure>
        </div>

        <div className="flex flex-col gap-7 lg:pt-3.5" data-reveal>
          <Figure
            src="/img/facade-wide"
            alt="Patio entre las dos torres, con la sombra de las aletas sobre el muro"
            width={1600}
            height={1008}
            className="h-[16rem] md:h-[380px]"
          />

          <div className="flex items-start gap-7">
            <Figure
              src="/img/facade-portrait"
              alt="Detalle del concreto de la fachada y su sombra"
              width={900}
              height={1184}
              className="h-[12rem] w-[56%] flex-none md:h-[220px]"
              shadow={false}
            />
            <p className="flex-1 font-body text-[1.0625rem] italic leading-[1.7] text-ink/70">
              La fachada se lee distinto cada hora. A las cuatro de la tarde las aletas dibujan una
              franja de sombra de 40 cm sobre el muro.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
