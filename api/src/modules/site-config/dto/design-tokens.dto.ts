import { IsObject, IsNotEmpty } from "class-validator";

export class DesignTokensDto {
  @IsObject()
  @IsNotEmpty()
  tokens: Record<string, unknown>;
}

export class UpdateDesignTokensDto extends DesignTokensDto {}
