type Props = {
  /** The dimension itself. Only use this when there is a real one to state. */
  children: string
  /** Length of the rule in pixels; the canvas varies it by context. */
  length?: number
  className?: string
  tone?: 'blueprint' | 'light'
}

/**
 * A dimension line: two ticks joined by a rule, with the measurement beside
 * it. Borrowed from the drafting convention the whole page leans on, and used
 * only where an actual measurement exists — never as decoration.
 */
export function Measure({ children, length = 96, className = '', tone = 'blueprint' }: Props) {
  const color = tone === 'light' ? 'bg-lime/60' : 'bg-blueprint'
  const text = tone === 'light' ? 'text-lime/75' : 'text-blueprint'

  return (
    <span className={`flex items-center gap-3 ${text} ${className}`}>
      <span aria-hidden className={`h-[9px] w-px ${color}`} />
      <span aria-hidden className={`h-px ${color}`} style={{ width: length }} />
      <span aria-hidden className={`h-[9px] w-px ${color}`} />
      <span className="cota whitespace-nowrap" style={{ color: 'currentColor' }}>
        {children}
      </span>
    </span>
  )
}
