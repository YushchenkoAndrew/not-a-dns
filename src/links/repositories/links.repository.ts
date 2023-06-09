import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  In,
  Repository,
} from 'typeorm';
import { AliasLinksEntity } from '../../alias/entities/alias-links.entity';
import { AliasRepository } from '../../alias/repositories/alias.repository';
import { LinkableTypeEnum } from '../../alias/types/linkable-type.enum';
import { ArrayService } from '../../common/common.service';
import { LinksEntity } from '../entities/links.entity';

@Injectable()
export class LinksRepository extends Repository<LinksEntity> {
  private readonly repo: {
    alias: AliasRepository;
    alias_links: Repository<AliasLinksEntity>;
  };

  constructor(
    @InjectRepository(LinksEntity)
    repo: Repository<LinksEntity>,

    @InjectRepository(AliasLinksEntity)
    alias_links: Repository<AliasLinksEntity>,
    alias: AliasRepository,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
    this.repo = { alias, alias_links };
  }

  findOne(options: FindOneOptions<LinksEntity>): Promise<LinksEntity> {
    return this.find(options).then((items) => items[0] || null);
  }

  findAndCount(
    options?: FindManyOptions<LinksEntity>,
  ): Promise<[LinksEntity[], number]> {
    return Promise.all([
      this.find(options),
      this.count({ ...(options || {}), relations: undefined }),
    ]);
  }

  async find(options?: FindManyOptions<LinksEntity>): Promise<LinksEntity[]> {
    const relations: FindOptionsRelations<LinksEntity> = {
      ...((options?.relations as any) || {}),
    };

    const aliasLinkRelation = !!relations?.alias_link;
    if (aliasLinkRelation) delete relations.alias_link;
    const links = await super.find({ ...(options || {}), relations });

    if (!aliasLinkRelation) return links;

    // NOTE: Query builder can solve this unnecessary request, but Im too lazy
    const alias_links = await this.repo.alias_links.find({
      where: {
        linkable_id: In(ArrayService.values(ArrayService.extract(links, 'id'))),
        linkable_type: LinkableTypeEnum.links,
      },
    });

    const alias = await this.repo.alias.findTree('leaf', {
      where: {
        alias_link: {
          alias_id: In(
            ArrayService.values(ArrayService.extract(alias_links, 'alias_id')),
          ),
        },
      },
      relations: { alias_link: { linkable_links: true }, secret: true },
    });

    for (const link of links) {
      link.alias_link = alias_links
        .filter(({ linkable_id }) => link.id == linkable_id)
        .map((item) => ((item.alias = alias[item.alias_id]), item));
    }

    return links;
  }
}
