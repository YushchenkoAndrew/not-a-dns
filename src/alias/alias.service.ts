import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';

import { ArrayService, ObjectService } from '../common/common.service';
import { ObjectLiteral, TreeOptions } from '../common/types';
import { AliasEntity } from './entities/alias.entity';
import { AliasDto } from './request-dto/alias.dto';
import { AliasLinksResponseDto } from './response-dto/alias-links-response.dto';
import { AliasResponseDto } from './response-dto/alias-response.dto';
import { LinkableTypeEnum } from './types/linkable-type.enum';

@Injectable()
export class AliasService {
  constructor(
    @InjectRepository(AliasEntity)
    public readonly aliasRepository: Repository<AliasEntity>,
  ) {}

  getAll(options: AliasDto): Promise<unknown> {
    const alias = this.aliasRepository.find({
      where: { name: options.query && Like(options.query) },
      take: options.per_page,
      skip: options.skip,
    });

    return null;
  }

  async getOne(nanoid: string): Promise<AliasResponseDto> {
    const entity = await this.validateAlias(nanoid);
    const roots = await this.findTree('root', {
      where: { id: entity.id },
      relations: {
        alias_link: { linkable_links: true },
      },
    });

    // TODO: Add somehow links
    console.dir(roots[entity.id], { depth: null });

    return new AliasResponseDto({
      children: new AliasLinksResponseDto().build(roots[entity.id]),
    }).build(entity);
  }

  upsertAlias(body: unknown, id?: string): Promise<unknown> {
    return null;
  }

  deleteAlias(id: string): Promise<unknown> {
    return null;
  }

  async findTreeIds(
    startAs: 'root' | 'leaf',
    options?: TreeOptions<AliasEntity>,
  ): Promise<number[]> {
    const master =
      'where' in options
        ? await this.aliasRepository
            .find({ select: { id: true }, where: options.where })
            .then((items) => ArrayService.extract(items, 'id'))
        : options.ids;

    const column =
      startAs == 'root'
        ? { select: 'linkable_id', condition: 'alias_id' }
        : { select: 'alias_id', condition: 'linkable_id' };

    const params = [] as any;
    return this.aliasRepository
      .query(
        `
    WITH RECURSIVE nodes(id, depth) AS (
      SELECT al.${column.select}, 1 FROM alias_links al 
      WHERE al.alias_id IN (${master
        .map((v) => `$${params.push(v)}`)
        .join(', ')}) AND al.linkable_type = $${params.push(
          LinkableTypeEnum.alias,
        )}
      UNION ALL
        SELECT al.${column.select}, n.depth + 1 FROM nodes n, alias_links al
        WHERE n.id = al.${
          column.condition
        } AND al.linkable_type = $${params.push(
          LinkableTypeEnum.alias,
        )} AND n.depth < 10
    ) SELECT n.id FROM nodes n
    `,
        params,
      )
      .then((items) =>
        items.reduce((acc, { id }) => (acc.push(id), acc), master),
      );
  }

  async findTree(
    startAs: 'root' | 'leaf',
    options?: FindManyOptions<AliasEntity>,
  ): Promise<ObjectLiteral<AliasEntity>> {
    const master = await this.aliasRepository
      .find({ where: options?.where })
      .then((items) => ObjectService.toMap(items, 'id'));

    const tree_ids = await this.findTreeIds(startAs, {
      ids: ArrayService.values<any>(Object.keys(master)),
    });

    const nodes = await this.aliasRepository
      .find({
        ...(options || {}),
        where: { id: In(tree_ids) },
        relations: { alias_link: true, ...(options?.relations || {}) },
      })
      .then((items) => ObjectService.toMap(items, 'id'));

    for (const id in nodes) {
      nodes[id].alias = [];
      if (!nodes[id].alias_link) continue;

      for (const e of nodes[id].alias_link) {
        if (e.linkable_type != LinkableTypeEnum.alias) continue;

        // TODO: Replace value with new one
        nodes[id].alias.push(nodes[e.linkable_id]);
      }
    }

    return Object.keys(master).reduce(
      (acc, id) => ((acc[id] = nodes[id] ?? master[id]), acc),
      {},
    );
  }

  async validateAlias(id: string): Promise<AliasEntity> {
    const alias = await this.aliasRepository.findOne({
      where: { nanoid: id || '_' },
    });

    if (alias) return alias;

    throw new HttpException(
      "Unknown 'alias' id",
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
