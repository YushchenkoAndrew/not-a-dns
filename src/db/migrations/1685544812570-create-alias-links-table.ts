import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAliasLinksTable1685544812570 implements MigrationInterface {
  public async up(query: QueryRunner): Promise<void> {
    await query.createTable(
      new Table({
        name: 'alias_links',
        columns: [
          { name: 'id', type: 'INTEGER', isNullable: false, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'alias_id', type: 'INTEGER', isNullable: true },
          { name: 'linkable_id', type: 'INTEGER', isNullable: true },
          { name: 'linkable_type', type: 'INTEGER', isNullable: true },
        ],
      }),
    );

    await query.createIndex(
      'alias_links',
      new TableIndex({ name: 'IDX_ALIAS_LINKS_IDS', columnNames: ['alias_id', 'linkable_id', 'linkable_type'] }),
    );

    await query.createIndex(
      'alias_links',
      new TableIndex({ name: 'IDX_ALIAS_LINKS_LINKABLE_ID', columnNames: ['linkable_id', 'linkable_type'] }),
    );
  }

  public async down(query: QueryRunner): Promise<void> {
    await query.dropIndex("alias_links", "IDX_ALIAS_LINKS_LINKABLE_ID")
    await query.dropIndex("alias_links", "IDX_ALIAS_LINKS_IDS")
    await query.dropTable("alias_links")
  }
}
