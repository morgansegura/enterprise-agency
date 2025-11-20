import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

interface BlockWithKey {
  _key: string;
  blocks?: BlockWithKey[];
}

/**
 * Validator to ensure all block keys are unique within a page
 */
@ValidatorConstraint({ name: "uniqueBlockKeys", async: false })
export class UniqueBlockKeysConstraint implements ValidatorConstraintInterface {
  validate(blocks: BlockWithKey[], _args: ValidationArguments): boolean {
    if (!blocks || !Array.isArray(blocks)) {
      return true; // Let @IsArray handle this validation
    }

    const keys = this.collectAllKeys(blocks);
    const uniqueKeys = new Set(keys);

    // If the set size is different from the array length, there are duplicates
    return keys.length === uniqueKeys.size;
  }

  defaultMessage(args: ValidationArguments): string {
    const blocks = args.value as BlockWithKey[];
    const keys = this.collectAllKeys(blocks);
    const duplicates = this.findDuplicates(keys);

    return `Duplicate block keys found: ${duplicates.join(", ")}. All block keys must be unique.`;
  }

  /**
   * Recursively collect all block keys from the block tree
   */
  private collectAllKeys(blocks: BlockWithKey[]): string[] {
    const keys: string[] = [];

    for (const block of blocks) {
      keys.push(block._key);

      // Recursively collect keys from nested blocks
      if (block.blocks && Array.isArray(block.blocks)) {
        keys.push(...this.collectAllKeys(block.blocks));
      }
    }

    return keys;
  }

  /**
   * Find duplicate keys in the array
   */
  private findDuplicates(keys: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const key of keys) {
      if (seen.has(key)) {
        duplicates.add(key);
      } else {
        seen.add(key);
      }
    }

    return Array.from(duplicates);
  }
}

/**
 * Decorator to validate unique block keys
 * Usage: @UniqueBlockKeys()
 */
export function UniqueBlockKeys(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueBlockKeysConstraint,
    });
  };
}
