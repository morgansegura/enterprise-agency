import { cn } from '@/lib/utils'
import './text.css'

type TextProps = {
  children?: React.ReactNode
  /** The HTML tag to render */
  as?: 'p' | 'span' | 'div'
  /** Text size */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify'
  /** Text variant/style */
  variant?: 'default' | 'muted' | 'lead' | 'subtle'
  className?: string
}

export function Text({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  variant = 'default',
  className
}: TextProps) {
  return (
    <Component
      className={cn("text", className)}
      data-size={size}
      data-weight={weight}
      data-align={align}
      data-variant={variant}
    >
      {children}
    </Component>
  )
}
