import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { MicoPageService } from './mico-page.service';
import { GenerateHTMLDto } from './dto/generate-html.dto';

@Controller('mico-page')
export class MicoPageController {
  constructor(private readonly micoPageService: MicoPageService) {}

  @Post('generate/ejs')
  async generateHTML(
    @Body() dto: GenerateHTMLDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const result = await this.micoPageService.generateHTML(dto);
      reply.status(200).send(result);
    } catch (error) {
      reply.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}