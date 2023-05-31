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

import { LinksService } from './links.service';

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get('links')
  getAll(@Query() options: unknown): Promise<unknown> {
    return this.linksService.getAll(options);
  }

  @Get('links/:id')
  getOne(@Param('id') id: string): Promise<unknown> {
    return this.linksService.getOne(id);
  }

  @Post('links')
  postLinks(@Body() body: unknown): Promise<unknown> {
    return this.linksService.upsertLinks(body);
  }

  @Put('links/:id')
  putLinks(@Param('id') id: string, @Body() body: unknown): Promise<unknown> {
    return this.linksService.upsertLinks(body, id);
  }

  @Delete('links/:id')
  deleteLinks(@Param('id') id: string): Promise<unknown> {
    return this.linksService.deleteLinks(id);
  }
}
