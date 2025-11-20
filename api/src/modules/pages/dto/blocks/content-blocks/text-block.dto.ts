import { IsString, IsEnum, IsOptional } from "class-validator";

export class TextBlockDataDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl"])
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  @IsOptional()
  @IsEnum(["left", "center", "right", "justify"])
  align?: "left" | "center" | "right" | "justify";

  @IsOptional()
  @IsEnum(["body", "muted", "caption"])
  variant?: "body" | "muted" | "caption";

  @IsOptional()
  @IsString()
  maxWidth?: string; // CSS value (e.g., '65ch')
}

export class TextBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "text-block";

  data: TextBlockDataDto;
}
