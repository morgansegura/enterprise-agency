import { cn } from '@/lib/utils'
import './heading-block.css'

type HeadingBlockProps = {
  children?: React.ReactNode
  className?: string
}

export function HeadingBlock({ children, className }: HeadingBlockProps) {
  return (
    <div className={cn("heading-block", className)}>
      {children}
    </div>
  )
}
