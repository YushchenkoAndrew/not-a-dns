import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsRelations,
  In,
  IsNull,
  Like,
  Not,
  Repository,
} from 'typeorm';

import { ArrayService, ObjectService } from '../common/common.service';
import { ObjectLiteral, TreeOptions } from '../common/types';
import { LinksEntity } from '../links/entities/links.entity';
import { SecretEntity } from '../secret/entities/secret.entity';
import { AliasBodyDto } from './body-dto/alias-body.dto';
import { AliasLinksEntity } from './entities/alias-links.entity';
import { AliasEntity } from './entities/alias.entity';
import { AliasDto } from './request-dto/alias.dto';
import { AliasPageResponseDto } from './response-dto/alias-page-response.dto';
import { AliasResponseDto } from './response-dto/alias-response.dto';
import { AliasViewEnum } from './types/alias-view.enum';
import { LinkableTypeEnum } from './types/linkable-type.enum';

@Injectable()
export class AliasService {
  constructor(
    @InjectRepository(AliasEntity)
    public readonly repository: Repository<AliasEntity>,
  ) {}

  async getAll(options: AliasDto): Promise<AliasPageResponseDto> {
    const [alias, total] = await this.repository.findAndCount({
      where: {
        name: options.query && Like(options.query),
        favorite: options.favorite,
        secret:
          typeof options.secret != 'boolean'
            ? undefined
            : options.secret
            ? Not(IsNull())
            : IsNull(),
      },
      take: options.per_page,
      skip: options.skip,
    });

    const items = await this.findTree('root', {
      where: { id: In(ArrayService.values(ArrayService.extract(alias, 'id'))) },
      relations: { alias_link: { linkable_links: true }, secret: true },
    }).then((obj) => Object.values(obj));

    return new AliasPageResponseDto({
      total,
      items: new AliasResponseDto().buildAll(items),
    }).build(options);
  }

  async getOne(nanoid: string, dto: AliasDto): Promise<AliasResponseDto> {
    const entity = await this.validateAlias(nanoid);
    const options: FindManyOptions<AliasEntity> = {
      where: { id: entity.id },
      relations: { alias_link: { linkable_links: true }, secret: true },
    };

    if (dto.view == AliasViewEnum.tree) {
      const root = await this.findTree('root', options);
      const leaf = await this.findTree('leaf', options);

      return new AliasResponseDto().build({
        ...root[entity.id],
        parent: leaf[entity.id].parent,
      });
    }

    const final = (function unwrap(e: AliasEntity) {
      if (!e.parent?.length) return e.value || e.secret?.value || '';

      return e.parent.reduce(
        (acc, alias) =>
          acc.replace(new RegExp(`{{ ${alias.name} }}`, 'g'), unwrap(alias)),
        e.value || e.secret?.value || '',
      );
    })(await this.findTree('leaf', options).then((e) => e[entity.id]));

    return new AliasResponseDto({
      value: final,
      parent: undefined,
      children: undefined,
    }).build(entity);
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
        : this.repository.create();

    const parent = {
      toInsert: {} as ObjectLiteral<true>,
      toDelete:
        entity.alias_link?.reduce(
          (acc, curr) => ((acc[curr.linkable_alias.nanoid] = curr.id), acc),
          {} as ObjectLiteral<number>,
        ) || {},
    };

    for (const id of ArrayService.unique(body.parent.alias)) {
      if (parent.toDelete[id]) delete parent.toDelete[id];
      else parent.toInsert[id] = true;
    }

    return this.repository.manager.transaction(async (manager) => {
      const repo = {
        alias: manager.getRepository(AliasEntity),
        secret: manager.getRepository(SecretEntity),
        alias_links: manager.getRepository(AliasLinksEntity),
      };

      if (entity.secret) await repo.secret.remove(entity.secret);

      const alias = await repo.alias.save(
        repo.alias.create({
          ...entity,
          value: body.secret ? null : body.value,
          secret: body.secret
            ? await repo.secret.save(repo.secret.create({ value: body.value }))
            : null,
        }),
      );

      await repo.alias_links.delete({
        id: In(Object.keys(parent.toDelete).map((k) => parent.toDelete[k])),
      });

      const items = await repo.alias.find({
        where: { id: In(ArrayService.values(Object.keys(parent.toInsert))) },
      });

      if (items.length != Object.keys(parent.toInsert).length) {
        throw new HttpException(
          "Unknown 'alias' id",
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await repo.alias_links.save(
        items.map(({ id }) =>
          repo.alias_links.create({
            alias,
            linkable_id: id,
            linkable_type: LinkableTypeEnum.alias,
          }),
        ),
      );

      return new AliasResponseDto({
        children: undefined,
        parent: undefined,
      }).build(alias);
    });
  }

  async deleteAlias(id: string): Promise<AliasResponseDto> {
    const entity = await this.validateAlias(id);

    const tree = await this.findTree('root', {
      where: { id: entity.id },
      relations: { alias_link: { linkable_links: true } },
    }).then((item) => item[entity.id]);

    return this.repository.manager.transaction(async (manager) => {
      const repo = {
        alias: manager.getRepository(AliasEntity),
        secret: manager.getRepository(SecretEntity),
        alias_links: manager.getRepository(AliasLinksEntity),
        links: manager.getRepository(LinksEntity),
      };

      await (async function unwrap(entity: AliasEntity) {
        if (entity.secret_id) {
          await repo.secret.delete({ id: entity.secret_id });
        }

        if (entity.alias_link?.length) {
          for (const { linkable_links } of entity.alias_link) {
            if (!linkable_links) continue;
            await repo.links.remove(linkable_links);
          }

          await repo.alias_links.remove(entity.alias_link);
        }

        await Promise.all(entity.children.map((e) => unwrap(e)));
        await repo.alias.remove(entity);
      })(tree);

      return new AliasResponseDto({
        parent: undefined,
        children: undefined,
      }).build(entity);
    });
  }

  async findTreeIds(
    startAs: 'root' | 'leaf',
    options?: TreeOptions<AliasEntity>,
  ): Promise<number[]> {
    const master =
      'where' in options
        ? await this.repository
            .find({ select: { id: true }, where: options.where })
            .then((items) => ArrayService.extract(items, 'id'))
        : options.ids;

    const column =
      startAs == 'root'
        ? { select: 'linkable_id', condition: 'alias_id' }
        : { select: 'alias_id', condition: 'linkable_id' };

    const params = [] as any;
    return this.repository
      .query(
        `
    WITH RECURSIVE nodes(id, depth) AS (
      SELECT al.${column.select}, 1 FROM alias_links al 
      WHERE al.${column.condition} IN (${master
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
    const master = await this.repository
      .find({ where: options?.where })
      .then((items) => ObjectService.toMap(items, 'id'));

    const tree_ids = await this.findTreeIds(startAs, {
      ids: ArrayService.values<any>(Object.keys(master)),
    });

    console.log({ tree_ids });

    const nodes = await this.repository
      .find({
        ...(options || {}),
        where: { id: In(tree_ids) },
        relations: { alias_link: true, ...(options?.relations || {}) },
      })
      .then((items) => ObjectService.toMap(items, 'id'));

    for (const id in nodes) {
      nodes[id].parent ??= [];
      nodes[id].children ??= [];
      if (!nodes[id].alias_link) continue;

      for (const e of nodes[id].alias_link) {
        if (e.linkable_type != LinkableTypeEnum.alias) continue;
        if (!nodes[e.linkable_id]) continue;

        nodes[e.linkable_id].parent ??= [];
        nodes[e.linkable_id].parent.push(nodes[id]);

        nodes[id].children.push(nodes[e.linkable_id]);
      }
    }

    return Object.keys(master).reduce(
      (acc, id) => ((acc[id] = nodes[id] ?? master[id]), acc),
      {},
    );
  }

  async validateAlias(
    id: string,
    relations?: FindOptionsRelations<AliasEntity>,
  ): Promise<AliasEntity> {
    const alias = await this.repository.findOne({
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
