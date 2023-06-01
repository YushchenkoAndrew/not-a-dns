import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

import { SettingsEntity } from '../../setting/entities/settings.entity';

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


    const repo = query.manager.getRepository(SettingsEntity);
    await repo.save(repo.create({ mode: true }))
  }

  public async down(query: QueryRunner): Promise<void> {
    await query.dropIndex("settings", "IDX_SETTINGS_NANOID")
    await query.dropTable("settings")
  }
}
