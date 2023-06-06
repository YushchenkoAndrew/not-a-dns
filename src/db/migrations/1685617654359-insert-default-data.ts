import { randomBytes } from 'crypto';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

import { AliasLinksEntity } from '../../alias/entities/alias-links.entity';
import { AliasEntity } from '../../alias/entities/alias.entity';
import { LinkableTypeEnum } from '../../alias/types/linkable-type.enum';
import { SecretEntity } from '../../secret/entities/secret.entity';

export class InsertDefaultData1685617654359 implements MigrationInterface {
  public async up(query: QueryRunner): Promise<void> {
    const repo = {
      alias: query.manager.getRepository(AliasEntity),
      alias_links: query.manager.getRepository(AliasLinksEntity),
      secret: query.manager.getRepository(SecretEntity)
    };

    //  await repo.alias.save([
    //   repo.alias.create({ alias: 'WEB_URL', value: 'http://127.0.0.1:8000/projects', favorite: true }),
    //   repo.alias.create({ alias: 'API_URL', value: 'http://127.0.0.1:31337/api', favorite: true }),
    //   repo.alias.create({ alias: 'VOID_URL', value: 'http://127.0.0.1:8003/files', favorite: true }),
    //   repo.alias.create({ alias: 'BOT_URL', value: 'http://127.0.0.1:3000/bot', favorite: true }),
    // ]);

    const res = await repo.alias.save([
      repo.alias.create({ name: "/mortis-grimreaper", alias: 'WEB_URL', value: 'http://127.0.0.1:8000/projects', favorite: true }),
      repo.alias.create({ name: "/grape", alias: 'API_URL', value: `{{ WEB_URL }}/api`, favorite: true }),
      repo.alias.create({ name: "/void", alias: 'VOID_URL', value: '{{ API_URL }}/files', favorite: true }),
      repo.alias.create({ name: "/botodachi", alias: 'BOT_URL', value: '{{ VOID_URL }}/bot', favorite: true }),
    ]);


    await repo.alias_links.save([
      repo.alias_links.create({ alias: res[0], linkable_type: LinkableTypeEnum.alias, linkable_id: res[1].id }),
      repo.alias_links.create({ alias: res[1], linkable_type: LinkableTypeEnum.alias, linkable_id: res[2].id }),
      repo.alias_links.create({ alias: res[2], linkable_type: LinkableTypeEnum.alias, linkable_id: res[3].id }),
    ])

    await repo.alias.save([
      repo.alias.create({ 
        alias: 'WEB_SECRET', 
        secret: await repo.secret.save(
          repo.secret.create({ value: process.env.WEB_SECRET || randomBytes(128).toString("hex") })
        )
      }),
      repo.alias.create({ 
        alias: 'API_SECRET', 
        secret: await repo.secret.save(
          repo.secret.create({ value: process.env.API_SECRET || randomBytes(128).toString("hex") })
        )
      }),
      repo.alias.create({ 
        alias: 'VOID_SECRET', 
        secret: await repo.secret.save(
          repo.secret.create({ value: process.env.VOID_SECRET || randomBytes(128).toString("hex") })
        )
      }),
      repo.alias.create({ 
        alias: 'BOT_SECRET', 
        secret: await repo.secret.save(
          repo.secret.create({ value: process.env.BOT_SECRET || randomBytes(128).toString("hex") })
        )
      }),
    ]);

  }

  public async down(query: QueryRunner): Promise<void> {
    const repo = {
      secret: query.manager.getRepository(SecretEntity),
      alias: query.manager.getRepository(AliasEntity),
    }

    const alias = await repo.alias.find({
      where: { alias: In(['WEB_SECRET', 'API_SECRET', 'VOID_SECRET', 'BOT_SECRET']) },
      relations: { secret: true }
    });

    await repo.secret.remove(alias.map(({ secret }) => secret));
    await repo.alias.remove(alias);

    await repo.alias.remove(await repo.alias.find({
      where: { alias: In(['WEB_URL', 'API_URL', 'VOID_URL', 'BOT_URL']) }
    }));
  }
}
