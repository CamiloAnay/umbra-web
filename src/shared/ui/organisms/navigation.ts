export type NavLink = { href: string; label: string }

/** One source for the navigation, shared by the bar, the menu and the footer. */
export const NAV_LINKS: readonly NavLink[] = [
  { href: '#proyecto', label: 'Proyecto' },
  { href: '#tipologias', label: 'Tipologías' },
  { href: '#amenidades', label: 'Amenidades' },
  { href: '#ubicacion', label: 'Ubicación' },
]
