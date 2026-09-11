import { useEffect, useState } from 'react'
import { MobileMenu } from './MobileMenu.tsx'
import { NAV_LINKS } from './navigation.ts'
import { buttonClasses } from '../atoms/buttonStyles.ts'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The bar only takes a ground once the hero is behind it, so it never sits
  // as a solid strip across the facade.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a
        href="#proyecto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60
          focus:bg-ink focus:px-4 focus:py-2 focus:text-model"
      >
        Saltar al contenido
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300
          ${scrolled ? 'bg-lime/94 backdrop-blur-[2px]' : 'bg-transparent'}`}
      >
        <div className="frame flex items-center justify-between py-5 md:py-[30px]">
          <a
            href="#top"
            className="font-display text-[17px] font-bold w-wide tracking-[0.02em] md:text-[17px]"
          >
            UMBRAL
          </a>

          <nav className="hidden items-center gap-[34px] md:flex" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[16.5px] text-ink/72 transition-colors hover:text-blueprint"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#contacto" className={buttonClasses('outline', 'hidden md:inline-flex')}>
            Agendar visita
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-mr-2 flex w-11 flex-col items-end gap-[5px] p-2 md:hidden"
            aria-label="Abrir el menú"
            aria-expanded={menuOpen}
          >
            <span aria-hidden className="h-px w-6 bg-ink" />
            <span aria-hidden className="h-px w-6 bg-ink" />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
