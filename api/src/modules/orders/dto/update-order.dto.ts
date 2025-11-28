import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  MaxLength,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsIn(["open", "completed", "cancelled"])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(["pending", "paid", "refunded", "partially_refunded"])
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  transactionId?: string;

  @IsOptional()
  @IsString()
  @IsIn(["unfulfilled", "partial", "fulfilled"])
  fulfillmentStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  shippingMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  tax?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  shipping?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  discount?: number;

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  staffNote?: string;
}
