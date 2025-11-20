import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUrl,
} from "class-validator";

export class ButtonBlockDataDto {
  @IsString()
  text: string;

  @IsUrl()
  href: string;

  @IsOptional()
  @IsEnum(["primary", "secondary", "outline", "ghost", "link"])
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";

  @IsOptional()
  @IsEnum(["sm", "md", "lg"])
  size?: "sm" | "md" | "lg";

  @IsOptional()
  @IsBoolean()
  fullWidth?: boolean;

  @IsOptional()
  @IsString()
  icon?: string; // Icon name

  @IsOptional()
  @IsEnum(["left", "right"])
  iconPosition?: "left" | "right";

  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;
}

export class ButtonBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "button-block";

  data: ButtonBlockDataDto;
}
