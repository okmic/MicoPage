import { Module } from '@nestjs/common';
import { MicoPageController } from './mico-page.controller';
import { MicoPageService } from './mico-page.service';

@Module({
  controllers: [MicoPageController],
  providers: [MicoPageService],
})
export class MicoPageModule {}