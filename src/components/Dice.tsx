import type { CSSProperties, HTMLAttributes } from 'react'
import type { D6Value } from '../types/data'

interface DiceProps extends HTMLAttributes<HTMLSpanElement> {
  value: D6Value
  color?: string
  size?: CSSProperties['fontSize']
}

export function Dice({
  value,
  color = '#D2232A',
  size,
  className,
  style,
  ...props
}: DiceProps) {
  return (
    <span
      aria-hidden="true"
      className={className ? `dice ${className}` : 'dice'}
      style={{
        fontSize: size,
        ...style,
      }}
      {...props}
    >
      <svg
        className="dice__icon"
        viewBox="0 0 100 100"
        width="1em"
        height="1em"
        style={{ color }}
        aria-hidden="true"
        focusable="false"
      >
        <use href={`#d6-${value}`} />
      </svg>
    </span>
  )
}
