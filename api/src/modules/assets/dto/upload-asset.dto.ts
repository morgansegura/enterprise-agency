import { IsOptional, IsString, MaxLength } from "class-validator";

export class UploadAssetDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  usageContext?: string; // 'product', 'post', 'page', 'profile', 'general'
}
