import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAliasTable1685539257571 implements MigrationInterface {
  public async up(query: QueryRunner): Promise<void> {
    await query.createTable(
      new Table({
        name: 'alias',
        columns: [
          { name: 'id', type: 'INTEGER', isNullable: false, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'nanoid', type: 'TEXT', isNullable: false },
          { name: 'created_at', type: 'DATETIME', isNullable: false },
          { name: 'updated_at', type: 'DATETIME', isNullable: false },
          { name: 'name', type: 'TEXT', isNullable: false },
          { name: 'value', type: 'TEXT', isNullable: true },
          { name: 'favorite', type: 'BOOLEAN', isNullable: false, default: false },
        ],
      }),
    );

    await query.createIndex(
      'alias',
      new TableIndex({ name: 'IDX_ALIAS_NANOID', columnNames: ['nanoid'] }),
    );

    await query.createIndex(
      'alias',
      new TableIndex({ name: 'IDX_ALIAS_NAME', columnNames: ['name'] }),
    );
  }

  public async down(query: QueryRunner): Promise<void> {
    await query.dropIndex("alias", "IDX_ALIAS_NAME")
    await query.dropIndex("alias", "IDX_ALIAS_NANOID")
    await query.dropTable("alias")
  }
}
