import { IsString, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRefundDto {
  @ApiProperty({
    description: "Order ID to refund",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({
    description:
      "Amount to refund in cents (partial refund). If not provided, full refund.",
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiPropertyOptional({
    description: "Reason for refund",
    example: "Customer requested cancellation",
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
