// src/mico-page/dto/generate-html.dto.ts
import { IsArray, IsString, IsNumber } from 'class-validator';

export class GenerateHTMLDto {
  @IsArray()
  entryPointPathsToPages: string[];

  @IsString()
  exitPointPathToDeploy: string;

  @IsNumber()
  contentId: number;

  @IsString()
  entryPointPath: string;

  @IsNumber()
  ftpServerId: number;
}