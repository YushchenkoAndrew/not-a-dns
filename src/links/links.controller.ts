import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LinksService } from './links.service';
import { LinksDto } from './request-dto/links.dto';
import { LinksPageResponseDto } from './response-dto/links-page-response.dto';
import { LinksResponseDto } from './response-dto/links-response.dto';
import { LinksViewEnum } from './types/links-view.enum';

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get('links')
  getAll(@Query() options: LinksDto): Promise<LinksPageResponseDto> {
    return this.linksService.getAll(options);
  }

  @Get('links/:id')
  getOne(
    @Param('id') id: string,
    @Query() options: LinksDto,
  ): Promise<LinksResponseDto> {
    return this.linksService.getOne(id, options);
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
  deleteLinks(@Param('id') id: string): Promise<LinksResponseDto> {
    return this.linksService.deleteLinks(id);
  }

  @Get('links/:id/redirect')
  async getLinkAndRedirect(@Res() res: Response, @Param('id') id: string) {
    return this.linksService
      .getOne(id, new LinksDto({ view: LinksViewEnum.final }))
      .then(({ url }) => res.redirect(url));
  }
}
