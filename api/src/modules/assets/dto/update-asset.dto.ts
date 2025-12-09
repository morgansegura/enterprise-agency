import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateAssetDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fileName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  usageContext?: string;
}
