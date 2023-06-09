import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AliasModule } from '../alias/alias.module';
import { AliasLinksEntity } from '../alias/entities/alias-links.entity';
import { LinksEntity } from './entities/links.entity';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { LinksRepository } from './repositories/links.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinksEntity, AliasLinksEntity]),
    AliasModule,
  ],
  controllers: [LinksController],
  providers: [LinksService, LinksRepository],
  exports: [LinksService, LinksRepository],
})
export class LinksModule {}
