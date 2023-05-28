import { Controller, Get, Param } from '@nestjs/common';

import { SettingService } from './setting.service';

@Controller()
export class SettingController {
  constructor(private readonly appService: SettingService) {}

  @Get('setting/:type')
  getSettingByType(@Param('type') type: string) {
    return this.appService.getSettingByType(type);
  }

  @Get('hosts')
  gette(@Param('type') type: string) {
    return {
      page: 1,

      per_page: 30,

      total: 4,
      items: [
        {
          id: 'tes',
          favorite: false,
          alias: 'test',
          ip: 'localhost',
          port: 20,
        },
        {
          id: 'tes1',
          favorite: false,
          alias: 'test2',
          ip: '192.168.0.1',
          port: 20,
        },
        {
          id: 'tes2',
          favorite: false,
          alias: 'test2',
          ip: '192.168.0.2',
          port: 20,
        },
        {
          id: 'tes3',
          favorite: false,
          alias: 'test2',
          ip: '192.168.0.5',
          port: 20,
        },
      ],
    };
  }
}
