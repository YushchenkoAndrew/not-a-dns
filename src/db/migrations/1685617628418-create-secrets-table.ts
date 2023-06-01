import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSecretsTable1685617628418 implements MigrationInterface {
  public async up(query: QueryRunner): Promise<void> {
    await query.createTable(
      new Table({
        name: 'secrets',
        columns: [
          { name: 'id', type: 'INTEGER', isNullable: false, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'nanoid', type: 'TEXT', isNullable: false },
          { name: 'created_at', type: 'DATETIME', isNullable: false },
          { name: 'updated_at', type: 'DATETIME', isNullable: false },
          { name: 'algorithm', type: 'TEXT', isNullable: false },
          { name: 'salt', type: 'TEXT', isNullable: false },
          { name: 'iv', type: 'TEXT', isNullable: false },
          { name: 'auth_tag', type: 'TEXT', isNullable: true },
          { name: 'value', type: 'TEXT', isNullable: false },
        ],
      }),
    );

    await query.createIndex(
      'secrets',
      new TableIndex({ name: 'IDX_SECRETS_NANOID', columnNames: ['nanoid'] }),
    );

  
    await query.addColumn(
      'alias',
      new TableColumn({ name: 'secret_id', type: 'INTEGER', isNullable: true }),
    );

    await query.createForeignKey(
      'alias',
      new TableForeignKey({
        columnNames: ['secret_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secrets',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(query: QueryRunner): Promise<void> {
    const table = await query.getTable('alias')

    const fk = table.foreignKeys.find((fk) => fk.columnNames.find((k) => k == 'secret_id'));
    await query.dropForeignKey('alias', fk)
    await query.dropColumn('alias', 'secret_id')

    await query.dropIndex('secrets', 'IDX_SECRETS_NANOID')
    await query.dropTable('secrets')
  }
}
