import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
  ping(): { msg: string } {
    return { msg: 'pong' };
  }
}