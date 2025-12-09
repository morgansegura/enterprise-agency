import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsUrl,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class CheckoutLineItem {
  @ApiProperty({ description: "Product ID" })
  @IsString()
  productId: string;

  @ApiPropertyOptional({ description: "Variant ID (if applicable)" })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ description: "Quantity to purchase", minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateCheckoutDto {
  @ApiProperty({
    description: "Customer ID for the order",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    description: "Line items for checkout",
    type: [CheckoutLineItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutLineItem)
  items: CheckoutLineItem[];

  @ApiProperty({
    description: "URL to redirect after successful payment",
    example: "https://example.com/order/success",
  })
  @IsUrl()
  successUrl: string;

  @ApiProperty({
    description: "URL to redirect if payment is cancelled",
    example: "https://example.com/cart",
  })
  @IsUrl()
  cancelUrl: string;

  @ApiPropertyOptional({
    description: "Customer email for receipt",
    example: "customer@example.com",
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: "Shipping amount in cents",
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  shippingAmount?: number;

  @ApiPropertyOptional({
    description: "Tax amount in cents",
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  taxAmount?: number;

  @ApiPropertyOptional({
    description: "Discount amount in cents",
    example: 200,
  })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ApiPropertyOptional({
    description: "Customer-facing note for the order",
  })
  @IsOptional()
  @IsString()
  customerNote?: string;
}
