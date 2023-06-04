import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateLinksTable1685543075826 implements MigrationInterface {
  public async up(query: QueryRunner): Promise<void> {
    await query.createTable(
      new Table({
        name: 'links',
        columns: [
          { name: 'id', type: 'INTEGER', isNullable: false, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'nanoid', type: 'TEXT', isNullable: false },
          { name: 'created_at', type: 'DATETIME', isNullable: false },
          { name: 'updated_at', type: 'DATETIME', isNullable: false },
          { name: 'name', type: 'TEXT', isNullable: false },
          { name: 'url', type: 'TEXT', isNullable: false },
          { name: 'favorite', type: 'BOOLEAN', isNullable: false, default: false },
        ],
      }),
    );

    await query.createIndex(
      'links',
      new TableIndex({ name: 'IDX_LINKS_NANOID', columnNames: ['nanoid'] }),
    );

    await query.createIndex(
      'links',
      new TableIndex({ name: 'IDX_LINKS_TO', columnNames: ['link_to'] }),
    );
  }

  public async down(query: QueryRunner): Promise<void> {
    await query.dropIndex("links", "IDX_LINKS_TO")
    await query.dropIndex("links", "IDX_LINKS_NANOID")
    await query.dropTable("links")
  }
}
