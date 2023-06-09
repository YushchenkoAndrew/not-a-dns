import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';

import { AliasLinksEntity } from '../alias/entities/alias-links.entity';
import { AliasRepository } from '../alias/repositories/alias.repository';
import { LinkableTypeEnum } from '../alias/types/linkable-type.enum';
import { ArrayService } from '../common/common.service';
import { LinksEntity } from './entities/links.entity';
import { LinksRepository } from './repositories/links.repository';
import { LinksDto } from './request-dto/links.dto';
import { LinksPageResponseDto } from './response-dto/links-page-response.dto';
import { LinksResponseDto } from './response-dto/links-response.dto';
import { LinksViewEnum } from './types/links-view.enum';

@Injectable()
export class LinksService {
  constructor(
    public readonly repo: LinksRepository,
    private readonly aliasRepo: AliasRepository,

    @InjectRepository(AliasLinksEntity)
    public readonly aliasLinkRepo: Repository<AliasLinksEntity>,
  ) {}

  async getAll(dto: LinksDto): Promise<LinksPageResponseDto> {
    const condition: FindOptionsWhere<LinksEntity> = {
      id: Not(IsNull()),
      favorite: dto.favorite,
    };

    const [links, total] = await this.repo.findAndCount({
      where: [
        { name: dto.query && ILike(dto.query) },
        { url: dto.query && ILike(dto.query) },
      ].map((item) => ({ ...condition, ...item })),
      relations: { alias_link: true },
      take: dto.per_page,
      skip: dto.skip,
    });

    if (dto.view == LinksViewEnum.tree) {
      return new LinksPageResponseDto({
        total,
        items: new LinksResponseDto().buildAll(links),
      }).build(dto);
    }

    return new LinksPageResponseDto({
      total,
      items: new LinksResponseDto({
        parent: undefined,
        children: undefined,
      }).buildAll(links.map((e) => (e.unwrap(), e))),
    }).build(dto);
  }

  async getOne(nanoid: string, dto: LinksDto): Promise<LinksResponseDto> {
    const link = await this.validateLink(nanoid, { alias_link: true });

    if (dto.view == LinksViewEnum.tree) {
      return new LinksResponseDto().build(link);
    }

    return new LinksResponseDto({
      parent: undefined,
      children: undefined,
    }).build((link.unwrap(), link));
  }

  upsertLinks(body: unknown, id?: string): Promise<unknown> {
    // TODO: Create impl
    return null;
  }

  async deleteLinks(id: string): Promise<LinksResponseDto> {
    const link = await this.validateLink(id);

    // NOTE: Query builder can solve this unnecessary request, but Im too lazy
    const alias_links = await this.aliasLinkRepo.find({
      where: { linkable_id: link.id, linkable_type: LinkableTypeEnum.links },
    });

    const alias = await this.aliasRepo.find({
      where: {
        id: In(
          ArrayService.values(ArrayService.extract(alias_links, 'alias_id')),
        ),
      },
    });

    return this.repo.manager.transaction(async (manager) => {
      const repo = {
        alias_links: manager.getRepository(AliasLinksEntity),
        links: manager.getRepository(LinksEntity),
      };

      await Promise.all(
        alias.map((entity) => this.aliasRepo.dropEntity(manager, entity)),
      );

      await repo.alias_links.remove(alias_links);
      await repo.links.remove(link);

      return new LinksResponseDto({
        parent: undefined,
        children: undefined,
      }).build(link);
    });
  }

  async validateLink(
    id: string,
    relations?: FindOptionsRelations<LinksEntity>,
  ): Promise<LinksEntity> {
    const link = await this.repo.findOne({
      relations,
      where: { nanoid: id || '_' },
    });

    if (link) return link;

    throw new HttpException(
      "Unknown 'link' id",
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
