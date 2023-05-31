import { Module } from '@nestjs/common';

import { AliasModule } from './alias/alias.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { LinksModule } from './links/links.module';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [DbModule, SettingModule, AliasModule, LinksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
