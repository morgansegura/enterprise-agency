import { IsString, IsEnum, IsOptional, IsBoolean } from "class-validator";

export class ButtonBlockDataDto {
  @IsString()
  text: string;

  @IsString()
  href: string;

  @IsOptional()
  @IsEnum(["default", "primary", "secondary", "outline", "ghost", "link"])
  variant?: string;

  @IsOptional()
  @IsEnum(["sm", "md", "lg"])
  size?: string;

  @IsOptional()
  @IsBoolean()
  fullWidth?: boolean;

  @IsOptional()
  @IsBoolean()
  external?: boolean;
}

export class ButtonBlockDto {
  @IsEnum(["button-block"])
  _type: "button-block";

  @IsString()
  _key: string;

  @IsOptional()
  data: ButtonBlockDataDto;
}
