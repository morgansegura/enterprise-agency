import { IsString, IsOptional, ValidateNested, IsIn } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class StripeConfigDto {
  @ApiPropertyOptional({
    description: "Stripe publishable key (pk_live_... or pk_test_...)",
    example: "pk_test_51ABC123...",
  })
  @IsOptional()
  @IsString()
  publishableKey?: string;

  @ApiPropertyOptional({
    description: "Stripe secret key (sk_live_... or sk_test_...)",
    example: "sk_test_51ABC123...",
  })
  @IsOptional()
  @IsString()
  secretKey?: string;

  @ApiPropertyOptional({
    description: "Stripe webhook signing secret (whsec_...)",
    example: "whsec_abc123...",
  })
  @IsOptional()
  @IsString()
  webhookSecret?: string;
}

class SquareConfigDto {
  @ApiPropertyOptional({
    description: "Square Application ID",
    example: "sq0idp-abc123...",
  })
  @IsOptional()
  @IsString()
  applicationId?: string;

  @ApiPropertyOptional({
    description: "Square Access Token",
    example: "EAAAl...",
  })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional({
    description: "Square Location ID",
    example: "L1234567890",
  })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({
    description: "Square Webhook Signature Key",
  })
  @IsOptional()
  @IsString()
  webhookSignatureKey?: string;
}

export class UpdatePaymentConfigDto {
  @ApiProperty({
    description: "Active payment provider",
    enum: ["stripe", "square"],
    example: "stripe",
  })
  @IsIn(["stripe", "square"])
  provider: "stripe" | "square";

  @ApiPropertyOptional({
    description: "Stripe configuration",
    type: StripeConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StripeConfigDto)
  stripe?: StripeConfigDto;

  @ApiPropertyOptional({
    description: "Square configuration",
    type: SquareConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SquareConfigDto)
  square?: SquareConfigDto;
}
