import type { ButtonHTMLAttributes } from 'react'

interface RerollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export function RerollButton({
  label = 'Перебросить',
  type = 'button',
  className,
  title,
  ...props
}: RerollButtonProps) {
  return (
    <button
      type={type}
      className={className ? `reroll-button ${className}` : 'reroll-button'}
      aria-label={label}
      title={title ?? label}
      {...props}
    >
      ↻
    </button>
  )
}
