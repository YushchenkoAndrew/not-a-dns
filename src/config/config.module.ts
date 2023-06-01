import { Module } from '@nestjs/common';
import { ConfigModule as NestJsConfigModule } from '@nestjs/config';

import { Config } from '.';

@Module({
  imports: [
    NestJsConfigModule.forRoot({
      load: [() => Config.self],
      envFilePath: ['.env', '.env.template'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class ConfigModule {}
