import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AliasModule } from './alias/alias.module';
import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { LinksModule } from './links/links.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [DbModule, SettingsModule, AliasModule, LinksModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: AppInterceptor },
  ],
})
export class AppModule {}
