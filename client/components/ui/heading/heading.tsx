import { cn } from '@/lib/utils'
import './heading.css'

type HeadingProps = {
  children?: React.ReactNode
  /** The HTML tag to render (h1-h6) - semantic level */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** Visual size - can differ from semantic level */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Text color variant */
  variant?: 'default' | 'primary' | 'muted'
  className?: string
}

export function Heading({
  children,
  as: Component = 'h2',
  size = 'lg',
  weight = 'bold',
  align = 'left',
  variant = 'default',
  className
}: HeadingProps) {
  return (
    <Component
      className={cn("heading", className)}
      data-size={size}
      data-weight={weight}
      data-align={align}
      data-variant={variant}
    >
      {children}
    </Component>
  )
}
