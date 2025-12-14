import { IsString, IsIn, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePreviewTokenDto {
  @ApiProperty({
    description: "Type of content to preview",
    enum: ["page", "post"],
    example: "page",
  })
  @IsString()
  @IsIn(["page", "post"])
  contentType: "page" | "post";

  @ApiProperty({
    description: "ID of the content to preview",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  contentId: string;

  @ApiProperty({
    description: "Token expiration time (e.g., '7d', '24h', '1h')",
    example: "7d",
    required: false,
    default: "7d",
  })
  @IsOptional()
  @IsString()
  expiresIn?: string;
}
