import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

/**
 * Validator to enforce maximum nesting depth of blocks
 * Church CMS enforces a maximum of 4 levels:
 * 1. Section
 * 2. Container Block (grid/flex/stack)
 * 3. Container Block OR Content Block
 * 4. Content Block only
 */
export function MaxNestingDepth(
  maxDepth: number = 4,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxNestingDepth',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxDepth],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return true

          const [maxDepthValue] = args.constraints

          function calculateDepth(blocks: any[], currentDepth: number = 1): number {
            let maxDepthFound = currentDepth

            for (const block of blocks) {
              if (block.blocks && Array.isArray(block.blocks)) {
                const childDepth = calculateDepth(block.blocks, currentDepth + 1)
                maxDepthFound = Math.max(maxDepthFound, childDepth)
              }
            }

            return maxDepthFound
          }

          const depth = calculateDepth(value)
          return depth <= maxDepthValue
        },
        defaultMessage(args: ValidationArguments) {
          const [maxDepthValue] = args.constraints
          return `Block nesting depth cannot exceed ${maxDepthValue} levels. Please simplify your block structure.`
        },
      },
    })
  }
}
