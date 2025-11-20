import { IsString, IsEnum, IsOptional } from "class-validator";

export class HeadingBlockDataDto {
  @IsString()
  text: string;

  @IsEnum(["h1", "h2", "h3", "h4", "h5", "h6"])
  level: string;

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"])
  size?: string;

  @IsOptional()
  @IsEnum(["left", "center", "right"])
  align?: string;

  @IsOptional()
  @IsEnum(["normal", "medium", "semibold", "bold"])
  weight?: string;
}

export class HeadingBlockDto {
  @IsEnum(["heading-block"])
  _type: "heading-block";

  @IsString()
  _key: string;

  @IsOptional()
  data: HeadingBlockDataDto;
}
