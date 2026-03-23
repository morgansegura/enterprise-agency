import { IsString, IsOptional, IsUUID, Matches } from "class-validator";

// ============================================================================
// CREATE/UPDATE DTOs
// ============================================================================

export class CreateFolderDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, {
    message:
      "Folder name can only contain letters, numbers, spaces, hyphens, and underscores",
  })
  name: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class UpdateFolderDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, {
    message:
      "Folder name can only contain letters, numbers, spaces, hyphens, and underscores",
  })
  name: string;
}

export class MoveFolderDto {
  @IsOptional()
  @IsUUID()
  parentId?: string | null;
}
