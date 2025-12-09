import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  MaxLength,
  IsUUID,
} from "class-validator";

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsBoolean()
  acceptsMarketing?: boolean;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
