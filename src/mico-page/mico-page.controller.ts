import { Body, Controller, Post } from '@nestjs/common';
import { MicoPageService } from './mico-page.service';
import { GenerateHTMLDto } from './dto/generate-html.dto';

@Controller('mico-page')
export class MicoPageController {
  constructor(private readonly micoPageService: MicoPageService) {}

  @Post('generate/ejs')
  async generateHTML(@Body() dto: GenerateHTMLDto): Promise<{ msg: boolean }> {
    return this.micoPageService.generateHTML(dto);
  }
}