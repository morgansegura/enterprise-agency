import {
  IsString,
  IsOptional,
  IsIn,
  MaxLength,
  IsArray,
  IsUUID,
} from "class-validator";

export class CreatePostDto {
  @IsString()
  @MaxLength(255)
  slug: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  featuredImageId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @IsIn(["draft", "published", "scheduled", "archived"])
  status?: string;
}
