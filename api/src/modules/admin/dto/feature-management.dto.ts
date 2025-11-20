import { IsString, IsBoolean, IsObject, IsOptional } from "class-validator";

export class UpdateFeaturesDto {
  @IsObject()
  enabledFeatures: Record<string, boolean>;
}

export class ToggleFeatureDto {
  @IsString()
  featureKey: string;

  @IsBoolean()
  enabled: boolean;
}

export class FeaturePresetDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  features: Record<string, boolean>;
}
