import { IsString, IsOptional } from "class-validator";

export class MarkAsTemplateDto {
  @IsOptional()
  @IsString()
  templateName?: string;

  @IsOptional()
  @IsString()
  templateDescription?: string;
}
