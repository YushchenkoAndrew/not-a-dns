import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { AliasService } from './alias.service';

@Controller()
export class AliasController {
  constructor(private readonly aliasService: AliasService) {}

  @Get('alias')
  getAll(@Query() options: unknown): Promise<unknown> {
    return this.aliasService.getAll(options);
  }

  @Get('alias/:id')
  getOne(@Param('id') id: string): Promise<unknown> {
    return this.aliasService.getOne(id);
  }

  @Post('alias')
  postAlias(@Body() body: unknown): Promise<unknown> {
    return this.aliasService.upsertAlias(body);
  }

  @Put('alias/:id')
  putAlias(@Param('id') id: string, @Body() body: unknown): Promise<unknown> {
    return this.aliasService.upsertAlias(body, id);
  }

  @Delete('alias/:id')
  deleteAlias(@Param('id') id: string): Promise<unknown> {
    return this.aliasService.deleteAlias(id);
  }
}
