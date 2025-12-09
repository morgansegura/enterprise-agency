import { IsString, IsEnum, IsOptional } from "class-validator";

export class HeadingBlockDataDto {
  @IsString()
  text: string;

  @IsEnum(["h1", "h2", "h3", "h4", "h5", "h6"])
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  @IsOptional()
  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"])
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";

  @IsOptional()
  @IsEnum(["left", "center", "right"])
  align?: "left" | "center" | "right";

  @IsOptional()
  @IsEnum(["normal", "medium", "semibold", "bold"])
  weight?: "normal" | "medium" | "semibold" | "bold";

  @IsOptional()
  @IsEnum(["default", "primary", "secondary", "muted"])
  color?: "default" | "primary" | "secondary" | "muted";
}

export class HeadingBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "heading-block";

  data: HeadingBlockDataDto;
}
