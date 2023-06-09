import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Not,
} from 'typeorm';

import { ArrayService } from '../common/common.service';
import { AliasBodyDto } from './body-dto/alias-body.dto';
import { AliasEntity } from './entities/alias.entity';
import { AliasRepository } from './repositories/alias.repository';
import { AliasDto } from './request-dto/alias.dto';
import { AliasPageResponseDto } from './response-dto/alias-page-response.dto';
import { AliasResponseDto } from './response-dto/alias-response.dto';
import { AliasViewEnum } from './types/alias-view.enum';

@Injectable()
export class AliasService {
  constructor(public readonly repo: AliasRepository) {}

  async getAll(dto: AliasDto): Promise<AliasPageResponseDto> {
    const condition: FindOptionsWhere<AliasEntity> = {
      id: Not(IsNull()),
      favorite: dto.favorite,
      secret:
        typeof dto.secret != 'boolean'
          ? undefined
          : dto.secret
          ? Not(IsNull())
          : IsNull(),
    };

    const [alias, total] = await this.repo.findAndCount({
      where: [
        { alias: dto.query && ILike(dto.query) },
        { name: dto.query && ILike(dto.query) },
        { value: dto.query && ILike(dto.query) },
      ].map((item) => ({ ...condition, ...item })),
      take: dto.per_page,
      skip: dto.skip,
    });

    const options: FindManyOptions<AliasEntity> = {
      where: { id: In(ArrayService.values(ArrayService.extract(alias, 'id'))) },
      relations: { alias_link: { linkable_links: true }, secret: true },
    };

    if (dto.view == AliasViewEnum.tree) {
      const items = await this.repo
        .findTree('root', options)
        .then((obj) => Object.values(obj));

      return new AliasPageResponseDto({
        total,
        items: new AliasResponseDto().buildAll(items),
      }).build(dto);
    }

    const items = await this.repo
      .findTree('leaf', options)
      .then((e) => Object.values(e));

    return new AliasPageResponseDto({
      total,
      items: new AliasResponseDto({
        parent: undefined,
        children: undefined,
      }).buildAll(items.map((e) => (e.unwrap(), e))),
    }).build(dto);
  }

  async getOne(nanoid: string, dto: AliasDto): Promise<AliasResponseDto> {
    const entity = await this.validateAlias(nanoid);
    const options: FindManyOptions<AliasEntity> = {
      where: { id: entity.id },
      relations: { alias_link: { linkable_links: true }, secret: true },
    };

    if (dto.view == AliasViewEnum.tree) {
      const root = await this.repo.findTree('root', options);
      const leaf = await this.repo.findTree('leaf', options);

      return new AliasResponseDto().build({
        ...root[entity.id],
        parent: leaf[entity.id].parent,
      });
    }

    const item = await this.repo
      .findTree('leaf', options)
      .then((e) => e[entity.id]);

    return new AliasResponseDto({
      parent: undefined,
      children: undefined,
    }).build((item.unwrap(), item));
  }

  async upsertAlias(
    body: AliasBodyDto,
    id?: string,
  ): Promise<AliasResponseDto> {
    const entity =
      typeof id != 'undefined'
        ? await this.validateAlias(id, {
            secret: true,
            alias_link: { linkable_alias: true },
          })
        : this.repo.create({});

    return this.repo.manager.transaction(async (manager) => {
      const alias = await this.repo.upsertEntity(manager, {
        ...entity,
        name: body.name,
        alias: body.alias,
        favorite: body.favorite,
        value: body.secret ? null : body.value ?? entity.value,
        secret: body.secret as any,
      });

      return new AliasResponseDto({
        children: undefined,
        parent: undefined,
      }).build(alias);
    });
  }

  async deleteAlias(id: string): Promise<AliasResponseDto> {
    const entity = await this.validateAlias(id);

    return this.repo.manager.transaction(async (manager) => {
      await this.repo.dropEntity(manager, entity);

      return new AliasResponseDto({
        parent: undefined,
        children: undefined,
      }).build(entity);
    });
  }

  async validateAlias(
    id: string,
    relations?: FindOptionsRelations<AliasEntity>,
  ): Promise<AliasEntity> {
    const alias = await this.repo.findOne({
      relations,
      where: { nanoid: id || '_' },
    });

    if (alias) return alias;

    throw new HttpException(
      "Unknown 'alias' id",
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
