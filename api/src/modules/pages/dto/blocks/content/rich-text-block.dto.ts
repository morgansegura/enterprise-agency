import { IsString, IsEnum, IsOptional } from "class-validator";

export class RichTextBlockDataDto {
  @IsString()
  content: string; // HTML or JSON from TipTap

  @IsOptional()
  @IsEnum(["prose", "article", "compact"])
  variant?: string;
}

export class RichTextBlockDto {
  @IsEnum(["rich-text-block"])
  _type: "rich-text-block";

  @IsString()
  _key: string;

  @IsOptional()
  data: RichTextBlockDataDto;
}
