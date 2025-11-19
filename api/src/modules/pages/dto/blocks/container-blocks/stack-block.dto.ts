import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator'

export class StackBlockDataDto {
  @IsOptional()
  @IsEnum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  @IsOptional()
  @IsEnum(['left', 'center', 'right'])
  align?: 'left' | 'center' | 'right' // Horizontal alignment
}

export class StackBlockDto {
  @IsString()
  _key: string

  @IsString()
  _type: 'stack-block'

  data: StackBlockDataDto

  @IsArray()
  blocks: any[] // Will be validated as Block[] in discriminated union
}
