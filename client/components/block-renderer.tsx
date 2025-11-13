import { HeadingBlock, type HeadingBlockData } from '@/components/block/heading-block'
import { TextBlock, type TextBlockData } from '@/components/block/text-block'

/**
 * Block Registry - Maps block types to components
 * Add new block types here as you create them
 */
const BLOCK_REGISTRY = {
  'heading-block': HeadingBlock,
  'text-block': TextBlock,
  // Add more block components here as they're created
  // 'image-block': ImageBlock,
  // 'gallery-block': GalleryBlock,
} as const

/**
 * Map of block types to their data shapes
 * This ensures type safety when rendering blocks
 */
type BlockDataMap = {
  'heading-block': HeadingBlockData
  'text-block': TextBlockData
  // Add more as you create blocks
  // 'image-block': ImageBlockData
}

/**
 * Discriminated union of all block types
 * TypeScript will narrow this automatically based on _type
 */
export type TypedBlock = {
  [K in keyof BlockDataMap]: {
    _type: K
    _key: string
    data: BlockDataMap[K]
  }
}[keyof BlockDataMap]

type BlockType = keyof typeof BLOCK_REGISTRY

/**
 * BlockRenderer - Renders an array of blocks
 *
 * This component takes block data and renders the appropriate
 * block component for each one. It's the bridge between data
 * and visual components.
 */
type BlockRendererProps = {
  blocks: TypedBlock[]
  className?: string
}

/**
 * Render a single block with proper type narrowing
 */
function renderBlock(block: TypedBlock) {
  // TypeScript narrows the type based on _type
  switch (block._type) {
    case 'heading-block':
      // block.data is HeadingBlockData here
      return <HeadingBlock key={block._key} {...block.data} />

    case 'text-block':
      // block.data is TextBlockData here
      return <TextBlock key={block._key} {...block.data} />

    // Add more cases as you create blocks
    // case 'image-block':
    //   return <ImageBlock key={block._key} {...block.data} />

    default:
      // This will cause a TypeScript error if we forget to handle a block type
      const _exhaustiveCheck: never = block
      console.warn(`Unknown block type:`, block)
      return (
        <div
          key={block._key}
          className="border border-red-300 bg-red-50 p-4 rounded my-4"
        >
          <p className="text-red-600 font-semibold">
            Unknown block type
          </p>
          <pre className="text-xs mt-2 text-red-800">
            {JSON.stringify(block, null, 2)}
          </pre>
        </div>
      )
  }
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
      {blocks.map(renderBlock)}
    </div>
  )
}
