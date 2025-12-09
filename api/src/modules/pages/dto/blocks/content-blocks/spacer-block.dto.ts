import { IsString, IsEnum } from "class-validator";

export class SpacerBlockDataDto {
  @IsEnum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl"])
  height: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export class SpacerBlockDto {
  @IsString()
  _key: string;

  @IsString()
  _type: "spacer-block";

  data: SpacerBlockDataDto;
}
