import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config } from '../config';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forRoot(Config.self.db)],
  controllers: [],
  providers: [],
})
export class DbModule {}
