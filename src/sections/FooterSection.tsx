import { NAV_LINKS } from '@/shared/ui/organisms/navigation.ts'

type Props = {
  onAdmin: () => void
}

export function FooterSection({ onAdmin }: Props) {
  return (
    <footer className="frame pb-14 pt-16 md:pb-14 md:pt-24">
      <div className="grid gap-10 border-b border-ink/18 pb-12 md:grid-cols-4 md:pb-16">
        <p className="font-display text-[28px] font-bold w-wide tracking-[-0.03em] md:text-[40px]">
          UMBRAL
        </p>

        <nav className="flex flex-col gap-[11px] text-[17px]" aria-label="Pie de página">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-blueprint">
              {link.label}
            </a>
          ))}
        </nav>

        <address className="flex flex-col gap-[11px] text-[17px] not-italic text-ink/78">
          <span>Cra. 34 # 10-22</span>
          <span>El Poblado, Medellín</span>
          <span>Lunes a sábado, 9 a 6</span>
        </address>

        <div className="flex flex-col gap-[11px] text-[17px] text-ink/78">
          <a href="tel:+576040000000" className="transition-colors hover:text-blueprint">
            +57 604 000 0000
          </a>
          <a href="mailto:ventas@umbral.co" className="transition-colors hover:text-blueprint">
            ventas@umbral.co
          </a>
          <span>48 unidades · entrega 2028</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6 text-[12px] text-ink/50 md:flex-row md:justify-between">
        <span>Constructora · NIT 900.000.000-0</span>
        <span>Imágenes de referencia. Áreas construidas sujetas a planos aprobados.</span>
        <button
          type="button"
          onClick={onAdmin}
          className="cursor-pointer self-start text-left underline decoration-ink/25
            underline-offset-4 transition-colors hover:text-ink md:self-auto"
        >
          Administración
        </button>
      </div>
    </footer>
  )
}
