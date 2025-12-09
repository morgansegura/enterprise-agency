import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUrl,
} from "class-validator";

export class VideoBlockDataDto {
  @IsUrl()
  url: string; // YouTube/Vimeo/direct

  @IsOptional()
  @IsEnum(["youtube", "vimeo", "direct"])
  provider?: "youtube" | "vimeo" | "direct";

  @IsOptional()
  @IsEnum(["16/9", "4/3", "1/1", "21/9"])
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";

  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @IsOptional()
  @IsBoolean()
  muted?: boolean;

  @IsOptional()
  @IsBoolean()
  controls?: boolean;

  @IsOptional()
  @IsBoolean()
  loop?: boolean;
}

export class VideoBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "video-block";

  data: VideoBlockDataDto;
}
