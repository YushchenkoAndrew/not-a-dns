import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';

import { ObjectLiteral } from '../../client/src/types';
import { ArrayService, ObjectService } from '../common/common.service';
import { AliasEntity } from './entities/alias.entity';
import { AliasDto } from './request-dto/alias.dto';
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

  async getOne(id: string): Promise<unknown> {
    const alias = await this.validateAlias(id);
    console.dir(await this.findTree(), { depth: null });

    return alias;
  }

  upsertAlias(body: unknown, id?: string): Promise<unknown> {
    return null;
  }

  deleteAlias(id: string): Promise<unknown> {
    return null;
  }

  async findTreeIds(): Promise<number[]> {
    const params = [] as any;
    return this.aliasRepository
      .query(
        `
    WITH RECURSIVE nodes(id, depth) AS (
      SELECT a.id, 1 FROM alias a 
        JOIN alias_links al ON al.alias_id = a.id AND al.linkable_type = $${params.push(
          LinkableTypeEnum.alias,
        )} 
      UNION ALL
        SELECT al.alias_id, n.depth + 1 FROM nodes n, alias_links al
        WHERE n.id = al.linkable_id AND al.linkable_type = $${params.push(
          LinkableTypeEnum.alias,
        )} 
    ) SELECT DISTINCT n.id FROM nodes n
    `,
        params,
      )
      .then((items) => items.map(({ id }) => id));
  }

  async findTree(
    options?: FindOptionsWhere<AliasEntity>,
  ): Promise<ObjectLiteral<AliasEntity>> {
    const nodes = await this.aliasRepository
      .find({
        where: { id: In(ArrayService.values(await this.findTreeIds())) },
        relations: { secret: true, alias_link: true },
      })
      .then((items) => ObjectService.toMap(items, 'id'));

    const master =
      options &&
      (await this.aliasRepository.find({
        select: { id: true },
        where: options,
      }));

    for (const id in nodes) {
      nodes[id].alias = [];
      if (!nodes[id].alias_link) continue;

      for (const e of nodes[id].alias_link) {
        if (e.linkable_type != LinkableTypeEnum.alias) continue;
        nodes[id].alias.push(nodes[e.linkable_id]);
      }
    }

    if (!master) return nodes;
    return master.reduce(
      (acc, { id }) => (nodes[id] ? ((acc[id] = nodes[id]), acc) : acc),
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
