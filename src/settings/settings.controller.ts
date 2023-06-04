import { Body, Controller, Get, Param, Put } from '@nestjs/common';

import { SettingsBodyDto } from './body-dto/settings-body.dto';
import { SettingsResponseDto } from './response-dto/settings-response.dto';
import { SettingsService } from './settings.service';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('setting/:name')
  getSetting(@Param('name') name: string): Promise<SettingsResponseDto> {
    return this.settingsService.getSetting(name);
  }

  @Put('setting/:name')
  putSetting(
    @Param('name') name: string,
    @Body() body: SettingsBodyDto,
  ): Promise<SettingsResponseDto> {
    return this.settingsService.putSetting(name, body);
  }

  // TODO:
  @Get('info/:id')
  get(@Param('type') type: string) {
    return { type: 'alias' };
  }
}
