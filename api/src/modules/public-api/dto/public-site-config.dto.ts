import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma";

type JsonValue = Prisma.JsonValue;

/**
 * Public Site Configuration DTO
 * Safe for unauthenticated consumption
 * Enterprise: Only exposes client-facing branding and navigation
 */
export class PublicSiteConfigDto {
  @ApiProperty({ example: "acme-consulting" })
  slug: string;

  @ApiProperty({ example: "Acme Consulting" })
  businessName: string;

  @ApiProperty({ example: "professional-services" })
  businessType: string;

  @ApiProperty({ example: "https://cdn.example.com/logos/acme-logo.png" })
  logoUrl?: string;

  @ApiProperty({
    example: "Professional consulting services for growing businesses",
  })
  metaDescription?: string;

  @ApiProperty({ example: "hello@acmeconsulting.com" })
  contactEmail?: string;

  @ApiProperty({ example: "(555) 123-4567" })
  contactPhone?: string;

  @ApiProperty({
    description: "Header navigation configuration",
    type: "object",
    additionalProperties: true,
    example: {
      logo: { url: "/logo.png", alt: "Company Logo" },
      navigation: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
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
          links: [{ label: "Email Us", href: "mailto:hello@example.com" }],
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

  @ApiProperty({
    description: "Theme configuration (CSS custom properties)",
    type: "object",
    additionalProperties: true,
    example: {
      primary: "#1e40af",
      secondary: "#0891b2",
      "space-6": "1.5rem",
      "font-body": "Inter",
      "nav-link-gap": "1.5rem",
    },
  })
  themeConfig?: JsonValue;

  @ApiProperty({ example: "2024-01-01T10:00:00.000Z" })
  updatedAt: string;
}
