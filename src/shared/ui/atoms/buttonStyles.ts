export type ButtonVariant =
  /** Primary action on a light ground. */
  | 'solid'
  /** Secondary action: outlined in the accent. */
  | 'outline'
  /** Primary action over a photograph or a dark ground. */
  | 'light'
  /** Inline action that reads as text, for retry, cancel and the like. */
  | 'quiet'

const BASE =
  'inline-flex cursor-pointer items-center justify-center font-display font-semibold w-mid ' +
  'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const VARIANTS: Record<ButtonVariant, string> = {
  solid: 'bg-ink text-model px-7 py-4 text-[14px] hover:bg-blueprint',
  outline:
    'border border-blueprint text-blueprint px-5 py-2.5 text-[13px] hover:bg-blueprint hover:text-model',
  light: 'bg-lime text-ink px-7 py-4 text-[14px] hover:bg-blueprint hover:text-model',
  quiet:
    'text-[13px] text-blueprint underline decoration-blueprint/40 underline-offset-[6px] hover:decoration-blueprint',
}

/**
 * The button styles, as a function rather than a component.
 *
 * The same button appears as three different elements across the page: an
 * anchor when it navigates, a button when it acts, and a label when it drives
 * a hidden file input. A polymorphic component would need an `as` prop and a
 * pile of generics to say what an exported class string says plainly, so the
 * shared part here is the styling and each caller keeps the element its
 * semantics require.
 */
export function buttonClasses(variant: ButtonVariant, extra = ''): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim()
}
