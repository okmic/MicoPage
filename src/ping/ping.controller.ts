// src/ping/ping.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  async ping(): Promise<{ msg: string }> {
    return this.pingService.ping();
  }
}