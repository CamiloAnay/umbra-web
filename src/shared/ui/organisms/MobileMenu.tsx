import { useEffect, useRef } from 'react'
import { useFocusTrap } from '@/shared/hooks/useFocusTrap.ts'
import { NAV_LINKS } from './navigation.ts'
import { buttonClasses } from '../atoms/buttonStyles.ts'

type Props = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap(panelRef, open)

  // Escape closes it, and the page underneath stops scrolling while it is open.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}>
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Cerrar el menú"
        onClick={onClose}
        className={`absolute inset-0 bg-cast/45 transition-opacity duration-300
          ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navegación"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col bg-model px-6 py-5
          transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-[15px] font-bold w-wide tracking-[0.02em]">UMBRAL</span>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 p-2 text-ink/60 transition-colors hover:text-ink"
            aria-label="Cerrar el menú"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <nav className="mt-14 flex flex-col">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="border-b border-ink/12 py-4 font-display text-[26px] font-semibold w-mid
                transition-colors hover:text-blueprint"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contacto" onClick={onClose} className={buttonClasses('solid', 'mt-auto')}>
          Agendar visita
        </a>
      </div>
    </div>
  )
}
