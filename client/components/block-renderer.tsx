import { HeadingBlock } from '@/components/block/heading-block'
import type { Block } from '@/lib/editor/types'

/**
 * Block Registry - Maps block types to components
 * Add new block types here as you create them
 */
const BLOCK_REGISTRY = {
  'heading-block': HeadingBlock,
  // Add more block components here as they're created
  // 'text-block': TextBlock,
  // 'image-block': ImageBlock,
  // 'gallery-block': GalleryBlock,
} as const

type BlockType = keyof typeof BLOCK_REGISTRY

/**
 * BlockRenderer - Renders an array of blocks
 *
 * This component takes block data and renders the appropriate
 * block component for each one. It's the bridge between data
 * and visual components.
 */
type BlockRendererProps = {
  blocks: Block[]
  className?: string
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className={className}>
        <p className="text-gray-500 text-center py-8">
          No content yet. Add some blocks to get started!
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {blocks.map((block) => {
        const Component = BLOCK_REGISTRY[block._type as BlockType]

        if (!Component) {
          console.warn(`Unknown block type: ${block._type}`)
          return (
            <div
              key={block._key}
              className="border border-red-300 bg-red-50 p-4 rounded my-4"
            >
              <p className="text-red-600 font-semibold">
                Unknown block type: {block._type}
              </p>
              <pre className="text-xs mt-2 text-red-800">
                {JSON.stringify(block, null, 2)}
              </pre>
            </div>
          )
        }

        return <Component key={block._key} {...block.data} />
      })}
    </div>
  )
}
