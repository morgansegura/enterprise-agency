import { IsOptional, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO for updating tenant design tokens
 * Supports the token-based design system with colors, typography, spacing, etc.
 */
export class UpdateDesignTokensDto {
  @ApiProperty({
    description: "Complete design token configuration",
    example: {
      colors: {
        primary: {
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      typography: {
        fontFamily: {
          sans: ["Inter", "system-ui", "sans-serif"],
        },
      },
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  tokens?: Record<string, unknown>;
}
