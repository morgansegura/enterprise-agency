import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma";

type JsonValue = Prisma.JsonValue;

/**
 * Public Page Response DTO
 * Safe for unauthenticated consumption
 * Enterprise: Only exposes published, non-sensitive data
 */
export class PublicPageDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "about-us" })
  slug: string;

  @ApiProperty({ example: "About Our Company" })
  title: string;

  @ApiProperty({
    description: "Structured content blocks",
    type: "object",
    additionalProperties: true,
  })
  content: JsonValue;

  @ApiProperty({ example: "About Us - Acme Consulting" })
  metaTitle?: string;

  @ApiProperty({
    example: "Learn about our company history, mission, and values",
  })
  metaDescription?: string;

  @ApiProperty({ example: "2024-01-15T10:30:00.000Z" })
  publishedAt: string;

  @ApiProperty({ example: "2024-01-15T10:30:00.000Z" })
  updatedAt: string;

  @ApiProperty({ example: "default" })
  template?: string;
}

/**
 * Paginated list of pages
 */
export class PublicPagesListDto {
  @ApiProperty({ type: [PublicPageDto] })
  pages: PublicPageDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 45 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
