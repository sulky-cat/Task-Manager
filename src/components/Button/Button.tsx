import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  iconOnly?: boolean
}

export function Button({
  variant = 'primary',
  iconOnly = false,
  type = 'button',
  ...rest
}: ButtonProps) {
  const className = `${styles.button} ${styles[variant]}${iconOnly ? ` ${styles.iconOnly}` : ''}`
  return <button type={type} className={className} {...rest} />
}
