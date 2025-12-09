import { IsString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateStripeConfigDto {
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
