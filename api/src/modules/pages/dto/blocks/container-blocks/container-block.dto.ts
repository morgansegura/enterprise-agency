import { IsString, IsEnum, IsOptional, IsBoolean, IsArray } from 'class-validator'

export class ContainerBlockDataDto {
  @IsOptional()
  @IsEnum(['sm', 'md', 'lg', 'xl', '2xl', 'full'])
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

  @IsOptional()
  @IsEnum(['none', 'sm', 'md', 'lg'])
  padding?: 'none' | 'sm' | 'md' | 'lg'

  @IsOptional()
  @IsBoolean()
  center?: boolean
}

export class ContainerBlockDto {
  @IsString()
  _key: string

  @IsString()
  _type: 'container-block'

  data: ContainerBlockDataDto

  @IsArray()
  blocks: any[] // Will be validated as Block[] in discriminated union
}
