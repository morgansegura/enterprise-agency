import { IsString, IsOptional, IsBoolean } from "class-validator";

export class AudioBlockDataDto {
  @IsString()
  src: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  artist?: string;

  @IsOptional()
  @IsBoolean()
  controls?: boolean;

  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @IsOptional()
  @IsBoolean()
  loop?: boolean;
}

export class AudioBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "audio-block";

  data: AudioBlockDataDto;
}
