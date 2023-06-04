import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';

import { AliasService } from '../alias/alias.service';
import { LinksService } from '../links/links.service';
import { SettingsBodyDto } from './body-dto/settings-body.dto';
import { SettingsEntity } from './entities/settings.entity';
import { SettingsResponseDto } from './response-dto/settings-response.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    public readonly repository: Repository<SettingsEntity>,

    private readonly aliasService: AliasService,
    private readonly linksService: LinksService,
  ) {}

  async getSetting(name: string): Promise<SettingsResponseDto> {
    const entity = await this.validateSetting(name);
    return new SettingsResponseDto().build(entity);
  }

  async putSetting(
    name: string,
    body: SettingsBodyDto,
  ): Promise<SettingsResponseDto> {
    const entity = await this.validateSetting(name);
    return new SettingsResponseDto().build(
      await this.repository.save(
        this.repository.create({
          ...entity,
          mode: body.mode ?? entity.mode,
        }),
      ),
    );
  }

  async validateSetting(
    name: string,
    relations?: FindOptionsRelations<SettingsEntity>,
  ): Promise<SettingsEntity> {
    const settings = await this.repository.findOne({
      relations,
      where: { name: name.toUpperCase() },
    });

    if (settings) return settings;

    throw new HttpException(
      "Unknown 'settings' name",
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
