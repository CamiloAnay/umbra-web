import { Measure } from '@/shared/ui/atoms/Measure.tsx'
import { LeadForm } from './LeadForm.tsx'

export function ContactSection() {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-model py-section">
      <div className="frame grid items-start gap-10 lg:grid-cols-2 lg:gap-[104px]">
        <div>
          <h2 id="contacto-titulo" className="text-section">
            Agendar visita
          </h2>
          <p className="mt-5 max-w-[52ch] text-prose text-ink/86 md:mt-7">
            La sala de ventas abre de lunes a sábado, de 9 a 6. La visita dura 40 minutos e incluye
            el apartamento modelo del nivel 4.
          </p>
          <Measure length={88} className="mt-7">
            visita de 40 min
          </Measure>
        </div>

        <LeadForm />
      </div>
    </section>
  )
}
