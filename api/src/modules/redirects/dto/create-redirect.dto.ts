import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  IsBoolean,
  MaxLength,
  Matches,
} from "class-validator";

export class CreateRedirectDto {
  @IsString()
  @MaxLength(2048)
  @Matches(/^\//, { message: "sourcePath must start with /" })
  sourcePath: string;

  @IsString()
  @MaxLength(2048)
  targetPath: string;

  @IsOptional()
  @IsInt()
  @IsIn([301, 302])
  statusCode?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
