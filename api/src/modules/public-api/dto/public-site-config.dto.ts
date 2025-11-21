import { ApiProperty } from "@nestjs/swagger";
import { JsonValue } from "@prisma/client/runtime/library";

/**
 * Public Site Configuration DTO
 * Safe for unauthenticated consumption
 * Enterprise: Only exposes client-facing branding and navigation
 */
export class PublicSiteConfigDto {
  @ApiProperty({ example: "bible-baptist-church" })
  slug: string;

  @ApiProperty({ example: "Bible Baptist Church" })
  businessName: string;

  @ApiProperty({ example: "church" })
  businessType: string;

  @ApiProperty({ example: "https://cdn.example.com/logos/bbc-logo.png" })
  logoUrl?: string;

  @ApiProperty({
    example: "A welcoming community church serving families since 1985",
  })
  metaDescription?: string;

  @ApiProperty({ example: "info@biblebaptist.com" })
  contactEmail?: string;

  @ApiProperty({ example: "(555) 123-4567" })
  contactPhone?: string;

  @ApiProperty({
    description: "Header navigation configuration",
    type: "object",
    additionalProperties: true,
    example: {
      logo: { url: "/logo.png", alt: "Church Logo" },
      navigation: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ],
    },
  })
  headerConfig?: JsonValue;

  @ApiProperty({
    description: "Footer configuration",
    type: "object",
    additionalProperties: true,
    example: {
      columns: [
        {
          title: "Contact",
          links: [{ label: "Email Us", href: "mailto:info@church.com" }],
        },
      ],
    },
  })
  footerConfig?: JsonValue;

  @ApiProperty({
    description: "Menu configurations",
    type: "object",
    additionalProperties: true,
  })
  menusConfig?: JsonValue;

  @ApiProperty({
    description: "Logo configurations for different contexts",
    type: "object",
    additionalProperties: true,
  })
  logosConfig?: JsonValue;

  @ApiProperty({ example: "2024-01-01T10:00:00.000Z" })
  updatedAt: string;
}
