import { IsString, IsEnum, IsOptional } from "class-validator";

export class EmbedBlockDataDto {
  @IsString()
  html: string; // iframe HTML

  @IsOptional()
  @IsEnum(["16/9", "4/3", "1/1", "auto"])
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";

  @IsOptional()
  @IsString()
  caption?: string;
}

export class EmbedBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "embed-block";

  data: EmbedBlockDataDto;
}
