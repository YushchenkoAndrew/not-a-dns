import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AliasController } from './alias.controller';
import { AliasService } from './alias.service';
import { AliasEntity } from './entities/alias.entity';
import { AliasRepository } from './repositories/alias.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AliasEntity])],
  controllers: [AliasController],
  providers: [AliasRepository, AliasService],
  exports: [AliasService, AliasRepository],
})
export class AliasModule {}
