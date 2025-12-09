import { IsString, IsEnum, IsOptional, IsNumber } from "class-validator";

export class MapBlockDataDto {
  @IsOptional()
  @IsString()
  address?: string; // Address to geocode

  @IsOptional()
  @IsNumber()
  lat?: number; // Or direct coordinates

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsNumber()
  zoom?: number; // Default: 15

  @IsOptional()
  @IsString()
  height?: string; // CSS height

  @IsOptional()
  @IsEnum(["google", "openstreetmap"])
  provider?: "google" | "openstreetmap";

  @IsOptional()
  @IsString()
  apiKey?: string; // For Google Maps
}

export class MapBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "map-block";

  data: MapBlockDataDto;
}
