import { IsString, IsEnum, IsOptional } from "class-validator";

export class RichTextBlockDataDto {
  @IsString()
  html: string; // HTML content

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl"])
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  @IsOptional()
  @IsEnum(["left", "center", "right", "justify"])
  align?: "left" | "center" | "right" | "justify";
}

export class RichTextBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "rich-text-block";

  data: RichTextBlockDataDto;
}
