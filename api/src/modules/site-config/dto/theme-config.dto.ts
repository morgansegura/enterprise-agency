import { IsObject, IsNotEmpty } from "class-validator";

export class ThemeConfigDto {
  @IsObject()
  @IsNotEmpty()
  theme: Record<string, unknown>;
}

export class UpdateThemeConfigDto extends ThemeConfigDto {}
