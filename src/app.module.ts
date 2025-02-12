import { Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { MicoPageModule } from './mico-page/mico-page.module';

@Module({
  imports: [PingModule, MicoPageModule], 
})
export class AppModule {}