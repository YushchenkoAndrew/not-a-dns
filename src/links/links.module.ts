import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinksEntity } from './entities/links.entity';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinksEntity])],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
