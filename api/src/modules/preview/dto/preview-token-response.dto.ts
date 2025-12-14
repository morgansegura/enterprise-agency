import { ApiProperty } from "@nestjs/swagger";

export class PreviewTokenResponseDto {
  @ApiProperty({
    description: "The generated preview token",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  token: string;

  @ApiProperty({
    description: "Full preview URL for the content",
    example: "https://client.example.com/api/preview?token=550e8400...",
  })
  url: string;

  @ApiProperty({
    description: "Token expiration timestamp",
    example: "2025-01-29T12:00:00.000Z",
  })
  expiresAt: string;
}

export class ValidatedPreviewTokenDto {
  @ApiProperty({
    description: "Type of content being previewed",
    enum: ["page", "post"],
  })
  contentType: "page" | "post";

  @ApiProperty({
    description: "ID of the content being previewed",
  })
  contentId: string;

  @ApiProperty({
    description: "Tenant slug for the content",
  })
  tenantSlug: string;

  @ApiProperty({
    description: "Slug of the content item",
  })
  contentSlug: string;
}
