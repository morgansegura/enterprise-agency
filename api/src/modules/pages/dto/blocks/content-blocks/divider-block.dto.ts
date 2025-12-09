import { IsString, IsEnum, IsOptional } from "class-validator";

export class DividerBlockDataDto {
  @IsOptional()
  @IsEnum(["solid", "dashed", "dotted"])
  style?: "solid" | "dashed" | "dotted";

  @IsOptional()
  @IsEnum(["thin", "medium", "thick"])
  thickness?: "thin" | "medium" | "thick";

  @IsOptional()
  @IsEnum(["sm", "md", "lg"])
  spacing?: "sm" | "md" | "lg";

  @IsOptional()
  @IsEnum(["default", "muted"])
  color?: "default" | "muted";
}

export class DividerBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "divider-block";

  data: DividerBlockDataDto;
}
