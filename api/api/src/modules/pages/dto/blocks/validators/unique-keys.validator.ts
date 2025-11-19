import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

/**
 * Validator to ensure all block keys are unique within a page
 * This is critical for React rendering and block identification
 */
export function UniqueBlockKeys(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'uniqueBlockKeys',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return true

          const keys = new Set<string>()

          function collectKeys(blocks: any[]): boolean {
            for (const block of blocks) {
              if (!block._key) continue

              if (keys.has(block._key)) {
                return false // Duplicate key found
              }

              keys.add(block._key)

              // Recursively check nested blocks
              if (block.blocks && Array.isArray(block.blocks)) {
                if (!collectKeys(block.blocks)) {
                  return false
                }
              }
            }

            return true
          }

          return collectKeys(value)
        },
        defaultMessage(args: ValidationArguments) {
          return `Duplicate block keys detected. Each block must have a unique _key property within the page.`
        },
      },
    })
  }
}
