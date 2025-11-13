import { cn } from '@/lib/utils'
import { Text } from '@/components/ui/text'
import type { TextSize, TextAlign } from '@/lib/types'
import './text-block.css'

/**
 * Data structure for TextBlock
 */
export type TextBlockData = {
  /** Text content */
  content: string
  /** Text size */
  size?: TextSize
  /** Text alignment */
  align?: TextAlign
  /** Text variant */
  variant?: 'default' | 'muted' | 'lead' | 'subtle'
  className?: string
}

/**
 * TextBlock - A block component for text content
 * Composed of Text UI component
 */
export function TextBlock({
  content,
  size = 'base',
  align = 'left',
  variant = 'default',
  className
}: TextBlockData) {
  return (
    <div className={cn("text-block", className)} data-align={align}>
      <Text
        size={size}
        align={align}
        variant={variant}
      >
        {content}
      </Text>
    </div>
  )
}
