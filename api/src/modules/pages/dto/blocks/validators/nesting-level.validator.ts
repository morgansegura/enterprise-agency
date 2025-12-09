import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

/**
 * Maximum allowed nesting depth for blocks
 * Section > Container > Container > Content = 4 levels
 */
const MAX_NESTING_DEPTH = 4;

/**
 * Container block types that can have nested blocks
 */
const CONTAINER_BLOCK_TYPES = [
  "grid-block",
  "flex-block",
  "stack-block",
  "container-block",
  "columns-block",
];

interface BlockWithNesting {
  _type: string;
  blocks?: BlockWithNesting[];
}

/**
 * Validator to enforce maximum nesting depth for blocks
 */
@ValidatorConstraint({ name: "maxNestingDepth", async: false })
export class MaxNestingDepthConstraint implements ValidatorConstraintInterface {
  validate(blocks: BlockWithNesting[], _args: ValidationArguments): boolean {
    if (!blocks || !Array.isArray(blocks)) {
      return true; // Let @IsArray handle this validation
    }

    return this.checkNestingDepth(blocks, 1) <= MAX_NESTING_DEPTH;
  }

  defaultMessage(_args: ValidationArguments): string {
    return `Block nesting exceeds maximum depth of ${MAX_NESTING_DEPTH} levels`;
  }

  /**
   * Recursively calculate the maximum nesting depth
   */
  private checkNestingDepth(
    blocks: BlockWithNesting[],
    currentDepth: number,
  ): number {
    if (!blocks || blocks.length === 0) {
      return currentDepth;
    }

    let maxDepth = currentDepth;

    for (const block of blocks) {
      // Only container blocks can have nested blocks
      if (CONTAINER_BLOCK_TYPES.includes(block._type) && block.blocks) {
        const depth = this.checkNestingDepth(block.blocks, currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }

    return maxDepth;
  }
}

/**
 * Decorator to validate maximum nesting depth
 * Usage: @MaxNestingDepth()
 */
export function MaxNestingDepth(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: MaxNestingDepthConstraint,
    });
  };
}
