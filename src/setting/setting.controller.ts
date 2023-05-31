import { Controller, Get, Param } from '@nestjs/common';

import { SettingService } from './setting.service';

@Controller()
export class SettingController {
  constructor(private readonly settingsService: SettingService) {}

  @Get('setting/:type')
  getSettingByType(@Param('type') type: string) {
    return this.settingsService.getSettingByType(type);
  }

  @Get('info/:id')
  get(@Param('type') type: string) {
    return { type: 'alias' };
  }

  // @Get('alias')
  // gette(@Param('type') type: string) {
  //   return {
  //     page: 1,

  //     per_page: 30,

  //     total: 4,
  //     items: [
  //       {
  //         id: 'tes',
  //         favorite: false,
  //         name: 'test',
  //         value: 'localhost:20',
  //         used_in: [],
  //       },
  //       {
  //         id: 'tes1',
  //         favorite: false,
  //         name: 'test2',
  //         value: '192.168.0.1:20',
  //         used_in: [],
  //       },
  //       {
  //         id: 'tes2',
  //         favorite: true,
  //         name: 'test2',
  //         value: '192.168.0.2:20',
  //         relations: [
  //           {
  //             id: 'tes1',
  //             favorite: false,
  //             name: 'test2',
  //             value: '192.168.0.1:20',
  //             used_in: [],
  //           },
  //         ],
  //       },
  //       {
  //         id: 'tes3',
  //         favorite: false,
  //         name: 'test2',
  //         value: '192.168.0.5:20',
  //         used_in: [],
  //       },
  //     ],
  //   };
  // }

  // @Get('links')
  // gette2(@Param('type') type: string) {
  //   return {
  //     page: 1,

  //     per_page: 30,

  //     total: 1,
  //     items: [
  //       {
  //         id: 'tes',
  //         favorite: false,
  //         from: 'http://localhost:8000/hello_world',
  //         to: 'http://localhost:8000/temp#1',
  //         relations: [],
  //       },
  //     ],
  //   };
  // }
}
