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
import { AliasBodyDto } from './body-dto/alias-body.dto';
import { AliasDto } from './request-dto/alias.dto';
import { AliasPageResponseDto } from './response-dto/alias-page-response.dto';
import { AliasResponseDto } from './response-dto/alias-response.dto';

@Controller()
export class AliasController {
  constructor(private readonly aliasService: AliasService) {}

  @Get('alias')
  getAll(@Query() options: AliasDto): Promise<AliasPageResponseDto> {
    return this.aliasService.getAll(options);
  }

  @Get('alias/:id')
  getOne(
    @Param('id') id: string,
    @Query() options: AliasDto,
  ): Promise<AliasResponseDto> {
    return this.aliasService.getOne(id, options);
  }

  @Post('alias')
  postAlias(@Body() body: AliasBodyDto): Promise<AliasResponseDto> {
    return this.aliasService.upsertAlias(body);
  }

  @Put('alias/:id')
  putAlias(
    @Param('id') id: string,
    @Body() body: AliasBodyDto,
  ): Promise<AliasResponseDto> {
    return this.aliasService.upsertAlias(body, id);
  }

  @Delete('alias/:id')
  deleteAlias(@Param('id') id: string): Promise<AliasResponseDto> {
    return this.aliasService.deleteAlias(id);
  }
}
