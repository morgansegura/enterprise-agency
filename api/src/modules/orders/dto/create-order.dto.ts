import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsArray,
  IsEmail,
  MaxLength,
  Min,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class OrderAddressDto {
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  company?: string;

  @IsString()
  @MaxLength(255)
  address1: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address2?: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  @IsString()
  @MaxLength(2)
  country: string;

  @IsString()
  @MaxLength(20)
  postalCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;
}

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  shippingAddress?: OrderAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  billingAddress?: OrderAddressDto;

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
  @MaxLength(3)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  shippingMethod?: string;

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  staffNote?: string;
}
