import { IsString, IsEnum, IsOptional } from "class-validator";

export class QuoteBlockDataDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  title?: string; // Author's title/role

  @IsOptional()
  @IsEnum(["sm", "md", "lg"])
  size?: "sm" | "md" | "lg";

  @IsOptional()
  @IsEnum(["left", "center", "right"])
  align?: "left" | "center" | "right";

  @IsOptional()
  @IsEnum(["default", "bordered", "highlighted"])
  variant?: "default" | "bordered" | "highlighted";
}

export class QuoteBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "quote-block";

  data: QuoteBlockDataDto;
}
