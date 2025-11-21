import { ApiProperty } from "@nestjs/swagger";

/**
 * Public Post Response DTO
 * Safe for unauthenticated consumption
 * Enterprise: Only exposes published, non-sensitive data
 */
export class PublicPostDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "easter-service-2024" })
  slug: string;

  @ApiProperty({ example: "Easter Service 2024 - Join Us!" })
  title: string;

  @ApiProperty({
    example:
      "Join us for a special Easter celebration service with worship and message",
  })
  excerpt?: string;

  @ApiProperty({
    description: "Full post content (HTML or markdown)",
    example: "<p>Join us for...</p>",
  })
  content?: string;

  @ApiProperty({ example: "https://cdn.example.com/images/easter-2024.jpg" })
  featuredImageUrl?: string;

  @ApiProperty({ example: "events" })
  category?: string;

  @ApiProperty({ example: ["easter", "worship", "celebration"] })
  tags: string[];

  @ApiProperty({ example: "Easter Service 2024 - Bible Baptist Church" })
  metaTitle?: string;

  @ApiProperty({ example: "Join us for Easter celebration service" })
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

  @ApiProperty({ example: "events" })
  category?: string;

  @ApiProperty({ example: ["easter", "worship"] })
  tags?: string[];
}
