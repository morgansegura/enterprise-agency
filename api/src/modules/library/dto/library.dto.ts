import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsBoolean,
  IsIn,
  MaxLength,
} from "class-validator";

export class CreateLibraryItemDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsIn(["SECTION", "BLOCK"])
  type!: "SECTION" | "BLOCK";

  @IsObject()
  content!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}

export class UpdateLibraryItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
