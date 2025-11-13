import { cn } from '@/lib/utils'
import './section.css'

type SectionProps = {
  children?: React.ReactNode
  /** The HTML tag to render */
  as?: 'section' | 'div' | 'article' | 'aside' | 'main'
  /** Vertical spacing (padding top/bottom) */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Background style */
  background?: 'none' | 'white' | 'gray' | 'dark' | 'primary' | 'secondary'
  /** Max width constraint */
  width?: 'narrow' | 'wide' | 'full'
  /** Content alignment */
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function Section({
  children,
  as: Component = 'section',
  spacing = 'md',
  background = 'none',
  width = 'wide',
  align = 'left',
  className
}: SectionProps) {
  return (
    <Component
      className={cn("section", className)}
      data-spacing={spacing}
      data-background={background}
      data-width={width}
      data-align={align}
    >
      {children}
    </Component>
  )
}
