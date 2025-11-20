import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateDomainDto {
  @IsString()
  domain: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  environment?: string;
}
