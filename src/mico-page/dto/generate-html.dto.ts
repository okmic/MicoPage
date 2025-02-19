import { IsArray, IsString, IsNumber } from 'class-validator'

export class GenerateMicoPageEjsDto {
  @IsArray()
  entryPointPathsToPages: string[]

  @IsString()
  exitPointPathToDeploy: string

  @IsNumber()
  contentId: number

  @IsString()
  entryPointPath: string

  @IsNumber()
  ftpServerId: number
}