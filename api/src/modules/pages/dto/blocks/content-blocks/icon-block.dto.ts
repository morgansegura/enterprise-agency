import { IsString, IsEnum, IsOptional } from "class-validator";

export class IconBlockDataDto {
  @IsString()
  icon: string; // Icon name

  @IsOptional()
  @IsEnum(["sm", "md", "lg", "xl", "2xl"])
  size?: "sm" | "md" | "lg" | "xl" | "2xl";

  @IsOptional()
  @IsEnum(["default", "primary", "secondary", "muted"])
  color?: "default" | "primary" | "secondary" | "muted";

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsEnum(["left", "center", "right"])
  align?: "left" | "center" | "right";
}

export class IconBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "icon-block";

  data: IconBlockDataDto;
}
