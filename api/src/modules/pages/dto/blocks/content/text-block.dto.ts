import { IsString, IsEnum, IsOptional } from "class-validator";

export class TextBlockDataDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl"])
  size?: string;

  @IsOptional()
  @IsEnum(["left", "center", "right", "justify"])
  align?: string;

  @IsOptional()
  @IsEnum(["default", "muted", "subtle"])
  variant?: string;
}

export class TextBlockDto {
  @IsEnum(["text-block"])
  _type: "text-block";

  @IsString()
  _key: string;

  @IsOptional()
  data: TextBlockDataDto;
}
