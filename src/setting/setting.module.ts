import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AliasModule } from '../alias/alias.module';
import { LinksModule } from '../links/links.module';
import { SettingsEntity } from './entities/settings.entity';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingsEntity]),
    AliasModule,
    LinksModule,
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
