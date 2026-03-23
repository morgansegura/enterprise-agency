import {
  IsString,
  IsUrl,
  IsArray,
  IsBoolean,
  IsOptional,
  ArrayMinSize,
} from "class-validator";

export class CreateWebhookDto {
  @IsUrl({}, { message: "url must be a valid URL" })
  url: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: "At least one event is required" })
  events: string[];

  @IsOptional()
  @IsString()
  secret?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
