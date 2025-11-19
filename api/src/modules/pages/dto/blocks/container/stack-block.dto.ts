import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator'

export class StackBlockDataDto {
  @IsOptional()
  @IsEnum(['xs', 'sm', 'md', 'lg', 'xl', '2xl'])
  gap?: string

  @IsOptional()
  @IsEnum(['left', 'center', 'right', 'stretch'])
  align?: string
}

export class StackBlockDto {
  @IsEnum(['stack-block'])
  _type: 'stack-block'

  @IsString()
  _key: string

  @IsOptional()
  data?: StackBlockDataDto

  @IsArray()
  blocks: any[] // Will be typed with ContentBlock union
}
