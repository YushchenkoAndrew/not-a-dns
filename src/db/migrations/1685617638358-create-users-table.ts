import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

import { Config } from '../../config';
import { SecretEntity } from '../../user/entities/secret.entity';
import { UsersEntity } from '../../user/entities/user.entity';

export class CreateUsersTable1685617638358 implements MigrationInterface {
  public async up(query: QueryRunner): Promise<void> {
    await query.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'INTEGER', isNullable: false, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'nanoid', type: 'TEXT', isNullable: false },
          { name: 'created_at', type: 'DATETIME', isNullable: false },
          { name: 'updated_at', type: 'DATETIME', isNullable: false },
          { name: 'name', type: 'TEXT', isNullable: false },
          { name: 'secret_id', type: 'INTEGER', isNullable: false },
        ],
      }),
    );

    await query.createIndex(
      'users',
      new TableIndex({ name: 'IDX_USERS_NANOID', columnNames: ['nanoid'] }),
    );

    await query.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['secret_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secrets',
        onDelete: 'CASCADE',
      }),
    );


    const repo = {
      user: query.manager.getRepository(UsersEntity),
      secret: query.manager.getRepository(SecretEntity),
    }

    await repo.user.save(repo.user.create({ 
      name: 'DEFAULT', 
      secret: await repo.secret.save(repo.secret.create({
        value: Config.self.secrets.secret
      }))
    }));
  }

  public async down(query: QueryRunner): Promise<void> {
    const table = await query.getTable('users')

    const fk = table.foreignKeys.find((fk) => fk.columnNames.find((k) => k == 'secret_id'));
    await query.dropForeignKey('users', fk)
    await query.dropColumn('users', 'secret_id')

    await query.dropIndex('users', 'IDX_USERS_NANOID')
    await query.dropTable('users')
  }
}

