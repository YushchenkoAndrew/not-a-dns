import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AliasController } from './alias.controller';
import { AliasService } from './alias.service';
import { AliasEntity } from './entities/alias.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AliasEntity])],
  controllers: [AliasController],
  providers: [AliasService],
  exports: [AliasService],
})
export class AliasModule {}
