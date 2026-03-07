import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsUUID,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

// ============================================================================
// ENUMS
// ============================================================================

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
}

export enum MediaSortBy {
  CREATED_AT = "createdAt",
  FILE_NAME = "fileName",
  FILE_SIZE = "sizeBytes",
  UPDATED_AT = "updatedAt",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// ============================================================================
// QUERY DTOs
// ============================================================================

export class MediaQueryDto {
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(MediaSortBy)
  sortBy?: MediaSortBy = MediaSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 50;
}

// ============================================================================
// UPDATE DTOs
// ============================================================================

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  usageContext?: string;
}

export class MoveMediaDto {
  @IsOptional()
  @IsUUID()
  folderId?: string | null;
}

// ============================================================================
// BULK OPERATION DTOs
// ============================================================================

export class BulkMoveDto {
  @IsArray()
  @IsUUID("4", { each: true })
  mediaIds: string[];

  @IsOptional()
  @IsUUID()
  folderId?: string | null;
}

export class BulkDeleteDto {
  @IsArray()
  @IsUUID("4", { each: true })
  ids: string[];
}

export class BulkTagDto {
  @IsArray()
  @IsUUID("4", { each: true })
  mediaIds: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

// ============================================================================
// CROP DTO
// ============================================================================

export class CropMediaDto {
  @IsNumber()
  @Min(0)
  x: number;

  @IsNumber()
  @Min(0)
  y: number;

  @IsNumber()
  @Min(1)
  width: number;

  @IsNumber()
  @Min(1)
  height: number;

  @IsOptional()
  @IsString()
  aspectRatio?: string;
}

// ============================================================================
// UPLOAD DTOs
// ============================================================================

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsOptional()
  @IsString()
  usageContext?: string;
}

export class PresignedUploadDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsNumber()
  fileSize: number;

  @IsEnum(MediaType)
  type: MediaType;

  @IsOptional()
  @IsUUID()
  folderId?: string;
}

export class CompleteUploadDto {
  @IsOptional()
  @IsString()
  blurHash?: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}
