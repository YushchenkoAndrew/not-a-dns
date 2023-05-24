import { Controller, Get, Param } from '@nestjs/common';

import { SettingService } from './setting.service';

@Controller()
export class SettingController {
  constructor(private readonly appService: SettingService) {}

  @Get('setting/:type')
  getSettingByType(@Param('type') type: string) {
    return this.appService.getSettingByType(type);
  }
}
