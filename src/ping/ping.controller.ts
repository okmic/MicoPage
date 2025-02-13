import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('ping')
export class PingController {
  @Get()
  async ping(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    reply.send({ msg: 'pong' });
  }
}