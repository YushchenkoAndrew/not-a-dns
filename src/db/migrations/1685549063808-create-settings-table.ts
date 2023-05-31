import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSettingsTable1685549063808 implements MigrationInterface {
  public async up(query: QueryRunner): Promise<void> {
    await query.createTable(
      new Table({
        name: 'settings',
        columns: [
          { name: 'id', type: 'INTEGER', isNullable: false, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'nanoid', type: 'TEXT', isNullable: false },
          { name: 'created_at', type: 'DATETIME', isNullable: false },
          { name: 'updated_at', type: 'DATETIME', isNullable: false },
          { name: 'mode', type: 'BOOLEAN', isNullable: false, default: true },
        ],
      }),
    );

    await query.createIndex(
      'settings',
      new TableIndex({ name: 'IDX_SETTINGS_NANOID', columnNames: ['nanoid'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("settings", "IDX_SETTINGS_NANOID")
    await queryRunner.dropTable("settings")
  }}
