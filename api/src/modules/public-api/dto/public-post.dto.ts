import { ApiProperty } from "@nestjs/swagger";

/**
 * Public Post Response DTO
 * Safe for unauthenticated consumption
 * Enterprise: Only exposes published, non-sensitive data
 */
export class PublicPostDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "product-launch-2024" })
  slug: string;

  @ApiProperty({ example: "Announcing Our New Product Launch" })
  title: string;

  @ApiProperty({
    example:
      "We are excited to announce the launch of our latest product offering",
  })
  excerpt?: string;

  @ApiProperty({
    description: "Full post content (HTML or markdown)",
    example: "<p>We are excited to announce...</p>",
  })
  content?: string;

  @ApiProperty({ example: "https://cdn.example.com/images/launch-2024.jpg" })
  featuredImageUrl?: string;

  @ApiProperty({ example: "announcements" })
  category?: string;

  @ApiProperty({ example: ["product", "launch", "news"] })
  tags: string[];

  @ApiProperty({ example: "Product Launch 2024 - Acme Consulting" })
  metaTitle?: string;

  @ApiProperty({ example: "Announcing our exciting new product launch" })
  metaDescription?: string;

  @ApiProperty({ example: 142 })
  viewCount: number;

  @ApiProperty({ example: "2024-04-07T09:00:00.000Z" })
  publishedAt: string;

  @ApiProperty({ example: "2024-04-01T14:30:00.000Z" })
  updatedAt: string;
}

/**
 * Paginated list of posts
 */
export class PublicPostsListDto {
  @ApiProperty({ type: [PublicPostDto] })
  posts: PublicPostDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 145 })
  total: number;

  @ApiProperty({ example: 8 })
  totalPages: number;

  @ApiProperty({ example: "announcements" })
  category?: string;

  @ApiProperty({ example: ["product", "news"] })
  tags?: string[];
}
