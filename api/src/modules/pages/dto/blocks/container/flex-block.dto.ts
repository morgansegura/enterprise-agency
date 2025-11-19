import { IsString, IsEnum, IsOptional, IsArray, IsBoolean } from 'class-validator'

export class FlexBlockDataDto {
  @IsOptional()
  @IsEnum(['row', 'column', 'row-reverse', 'column-reverse'])
  direction?: string

  @IsOptional()
  @IsBoolean()
  wrap?: boolean

  @IsOptional()
  @IsEnum(['xs', 'sm', 'md', 'lg', 'xl', '2xl'])
  gap?: string

  @IsOptional()
  @IsEnum(['start', 'center', 'end', 'between', 'around', 'evenly'])
  justify?: string

  @IsOptional()
  @IsEnum(['start', 'center', 'end', 'stretch', 'baseline'])
  align?: string
}

export class FlexBlockDto {
  @IsEnum(['flex-block'])
  _type: 'flex-block'

  @IsString()
  _key: string

  @IsOptional()
  data?: FlexBlockDataDto

  @IsArray()
  blocks: any[] // Will be typed with ContentBlock union
}
