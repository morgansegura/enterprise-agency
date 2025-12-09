import { IsString, IsOptional, IsBoolean, MaxLength } from "class-validator";

export class CreateCustomerAddressDto {
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

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
