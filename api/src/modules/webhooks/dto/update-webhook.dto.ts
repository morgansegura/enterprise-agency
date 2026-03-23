import {
  IsString,
  IsUrl,
  IsArray,
  IsBoolean,
  IsOptional,
} from "class-validator";

export class UpdateWebhookDto {
  @IsOptional()
  @IsUrl({}, { message: "url must be a valid URL" })
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  events?: string[];

  @IsOptional()
  @IsString()
  secret?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
