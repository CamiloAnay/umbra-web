import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClasses, type ButtonVariant } from './buttonStyles.ts'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ variant = 'solid', className = '', children, ...rest }: Props) {
  return (
    <button className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  )
}
